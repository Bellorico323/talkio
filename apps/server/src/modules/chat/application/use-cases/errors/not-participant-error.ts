import { UseCaseError } from '@/shared/domain/errors/use-case-error'

export class NotParticipantError extends Error implements UseCaseError {
  constructor() {
    super('Sender is not a participant of this conversation.')
  }
}
