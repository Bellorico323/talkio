import chalk from 'chalk'
import { db } from './connection'
import { authLinks, chats, messages, userChats, users } from './schema'
import { faker } from '@faker-js/faker'
import { friendships } from './schema/friendships'

/**
 * Reset database
 */
await db.delete(authLinks)
await db.delete(users)
await db.delete(userChats)
await db.delete(chats)
await db.delete(friendships)
await db.delete(messages)

console.log(chalk.yellow('✔ Database reset!'))

/**
 * Create user
 */
const [user] = await db
  .insert(users)
  .values({
    name: faker.person.fullName(),
    email: 'user@test.com',
    avatarUrl: faker.image.avatarGitHub(),
  })
  .returning()

if (!user) throw new Error('Error creating user.')

console.log(chalk.yellow('✔ Created test user!'))

/**
 * Create friends
 */
const [friend1, friend2, friend3, friend4] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
    },
  ])
  .returning()

if (!friend1 || !friend2 || !friend3 || !friend4)
  throw new Error('Error creating friends.')

await db.insert(friendships).values([
  {
    userId: user.id,
    friendId: friend1.id,
    status: 'accepted',
  },
  {
    userId: user.id,
    friendId: friend2.id,
    status: 'accepted',
  },
  {
    userId: user.id,
    friendId: friend3.id,
    status: 'accepted',
  },
  {
    userId: user.id,
    friendId: friend4.id,
    status: 'accepted',
  },
])

console.log(chalk.yellow('✔ Created friends!'))

/**
 * Create chats
 */
const [chat1, chat2, chat3] = await db
  .insert(chats)
  .values([
    {
      name: faker.internet.username(),
      type: 'private',
    },
    {
      name: faker.internet.username(),
      type: 'private',
    },
    {
      name: faker.internet.username(),
      type: 'private',
    },
  ])
  .returning()

if (!chat1 || !chat2 || !chat3) throw new Error('Error creating chats.')

await db.insert(userChats).values([
  {
    userId: user.id,
    chatId: chat1.id,
  },
  {
    userId: friend1.id,
    chatId: chat1.id,
  },
  {
    userId: user.id,
    chatId: chat2.id,
  },
  {
    userId: friend2.id,
    chatId: chat2.id,
  },
  {
    userId: user.id,
    chatId: chat3.id,
  },
  {
    userId: friend3.id,
    chatId: chat3.id,
  },
])

console.log(chalk.yellow('✔ Created chats!'))

/**
 * Create users (to test invites)
 */
await db.insert(users).values([
  {
    name: 'username1',
    email: faker.internet.email(),
    avatarUrl: faker.image.avatarGitHub(),
  },
  {
    name: 'username2',
    email: faker.internet.email(),
    avatarUrl: faker.image.avatarGitHub(),
  },
  {
    name: 'username2',
    email: faker.internet.email(),
    avatarUrl: faker.image.avatarGitHub(),
  },
])

console.log(chalk.yellow('✔ Created users!'))

/**
 * Create messages
 */
await db.insert(messages).values([
  {
    userId: user.id,
    chatId: chat1.id,
    content: 'E aí, como você está?',
    createdAt: faker.date.recent({ days: 3 }),
  },
  {
    userId: friend1.id,
    chatId: chat1.id,
    content: 'Tudo certo! E você?',
    createdAt: faker.date.recent({ days: 2 }),
  },

  {
    userId: friend2.id,
    chatId: chat2.id,
    content: 'Terminou o projeto?',
    createdAt: faker.date.recent({ days: 5 }),
  },
  {
    userId: user.id,
    chatId: chat2.id,
    content: 'Sim, ficou pronto ontem!',
    createdAt: faker.date.recent({ days: 4 }),
  },
  {
    userId: user.id,
    chatId: chat3.id,
    content: 'Vamos jogar mais tarde?',
    createdAt: faker.date.recent({ days: 1 }),
  },
  {
    userId: friend3.id,
    chatId: chat3.id,
    content: 'Bora! Às 20h tá bom?',
    createdAt: faker.date.recent({ days: 1 }),
  },
])

console.log(chalk.yellow('✔ Created messages!'))

console.log(chalk.greenBright('✔ Database seeded!'))
process.exit()
