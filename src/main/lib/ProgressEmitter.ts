import EventEmitter from 'node:events'

export default class ProgressEmitter extends EventEmitter {
  #i = 0
  #last = 0
  #eventName: string
  length: number

  constructor(length: number, eventName = 'progress') {
    super()

    this.length = length
    this.#eventName = eventName
  }

  emitProgress() {
    this.#i += 1
    const pct = Math.round((100 * this.#i) / this.length)

    if (this.#last !== pct) {
      this.emit(this.#eventName, pct)

      this.#last = pct
    }
  }
}
