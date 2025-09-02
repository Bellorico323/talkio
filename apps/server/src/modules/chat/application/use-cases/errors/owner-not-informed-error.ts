import { UseCaseError } from '@/shared/domain/errors/use-case-error'

export class OwnerNotInformedError extends Error implements UseCaseError {
  constructor() {
    super('Owner not informed.')
  }
}
