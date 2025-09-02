import { UseCaseError } from '@/shared/domain/errors/use-case-error'

export class ConversatinIsNotGroupError extends Error implements UseCaseError {
  constructor() {
    super('This conversation is not a group.')
  }
}
