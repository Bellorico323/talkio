import { UseCaseError } from '@/shared/domain/errors/use-case-error'

export class FriendshipToYourselfError extends Error implements UseCaseError {
  constructor() {
    super('You cannot send a friend request to yourself.')
  }
}
