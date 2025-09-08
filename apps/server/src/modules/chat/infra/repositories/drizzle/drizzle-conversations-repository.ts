import { ConversationsRepository } from '@/modules/chat/application/repositories/conversations-repository'
import { Conversation } from '@/modules/chat/domain/entities/conversation'
import { ConversationMapper } from '../../mappers/conversation-mapper'
import { db } from '@/infra/database/client'
import { eq, getTableColumns, inArray, sql } from 'drizzle-orm'
import { conversationParticipants } from '../../database/schemas/conversation-participants'
import { conversations } from '../../database/schemas/conversation'
import { messages } from '../../database/schemas/message'

export class DrizzleConversationsRepository implements ConversationsRepository {
  async create(conversation: Conversation): Promise<void> {
    const databaseConversation = ConversationMapper.toPersistence(conversation)

    await db.insert(conversations).values(databaseConversation)

    for (const userId of conversation.participantsIds) {
      await db.insert(conversationParticipants).values({
        conversationId: conversation.id.toString(),
        userId: userId.toString(),
      })
    }

    for (const message of conversation.messages.getItems()) {
      await db.insert(messages).values({
        content: message.content,
        conversationId: message.conversationId.toString(),
        senderId: message.senderId.toString(),
        createdAt: message.createdAt,
      })
    }
  }

  async save(conversation: Conversation): Promise<void> {
    const databaseConversation = ConversationMapper.toPersistence(conversation)

    await db.transaction(async (tx) => {
      await tx
        .update(conversations)
        .set(databaseConversation)
        .where(eq(conversations.id, conversation.id.toString()))

      await tx
        .delete(conversationParticipants)
        .where(
          eq(
            conversationParticipants.conversationId,
            conversation.id.toString()
          )
        )

      for (const userId of conversation.participantsIds) {
        await tx
          .insert(conversationParticipants)
          .values({
            conversationId: conversation.id.toString(),
            userId: userId.toString(),
          })
          .onConflictDoNothing()
      }

      for (const message of conversation.messages.getNewItems()) {
        await tx.insert(messages).values({
          content: message.content,
          conversationId: message.conversationId.toString(),
          senderId: message.senderId.toString(),
          createdAt: message.createdAt,
        })
      }
    })
  }

  async findManyByParticipantId(
    participantId: string
  ): Promise<Conversation[]> {
    const rows = await db
      .select({
        ...getTableColumns(conversations),
        participantId: conversationParticipants.userId,
      })
      .from(conversations)
      .innerJoin(
        conversationParticipants,
        eq(conversations.id, conversationParticipants.conversationId)
      )
      .where(eq(conversationParticipants.userId, participantId))

    return rows.map((row) => ConversationMapper.toDomain(row))
  }

  async findById(conversationId: string): Promise<Conversation | null> {
    const row = await db.query.conversations.findFirst({
      where: eq(conversations.id, conversationId),
    })

    if (!row) return null
    return ConversationMapper.toDomain(row)
  }

  async findPrivateConversationBetweenUsers(
    senderId: string,
    recipientId: string
  ): Promise<Conversation | null> {
    const rows = await db
      .select({
        conversationId: conversationParticipants.conversationId,
      })
      .from(conversationParticipants)
      .where(inArray(conversationParticipants.userId, [senderId, recipientId]))
      .groupBy(conversationParticipants.conversationId)
      .having(sql`COUNT(DISTINCT ${conversationParticipants.userId}) = 2`)

    if (rows.length === 0 || !rows[0]?.conversationId) return null

    const conversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, rows[0].conversationId),
    })

    return conversation ? ConversationMapper.toDomain(conversation) : null
  }
}
