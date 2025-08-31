import { UseCaseError } from '@/shared/domain/errors/use-case-error'

export class FriendShipAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('A friendship or pending request already exists between these users.')
  }
}
