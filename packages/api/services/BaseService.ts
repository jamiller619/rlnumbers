import { PrismaClient } from '@prisma/client'
import { TypedEmitter, TypedEventMap } from '@rln/shared/types'
import { connect } from '~/db'

export default abstract class BaseService<
  T extends TypedEventMap = Record<string, never>
> extends TypedEmitter<T> {
  client: PrismaClient

  constructor() {
    super()

    this.client = connect()
  }
}
