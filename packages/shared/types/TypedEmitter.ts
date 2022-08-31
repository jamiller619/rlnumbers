import EventEmitter from 'node:events'
import TypedEmitter, { EventMap } from 'typed-emitter'

export type TypedEventMap = EventMap

export default abstract class TypedEmitterBase<
  T extends TypedEventMap = Record<string, never>
> extends (EventEmitter as {
  new <T extends TypedEventMap>(): TypedEmitter<T>
})<T> {}
