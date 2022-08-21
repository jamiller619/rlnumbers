import EventEmitter from 'node:events'
import { PrismaClient } from '@prisma/client'
import TypedEmitter, { EventMap } from 'typed-emitter'
import { connect } from '~/db'

export default class BaseService<T = unknown> extends (EventEmitter as {
  new <T>(): TypedEmitter<T & EventMap>
})<T> {
  client: PrismaClient

  constructor() {
    super()

    this.client = connect()
  }
}
