import BaseService from '~/services/BaseService'

type ImportQueueServiceEvent = {
  ['replay:add']: (...files: string[]) => void
  ['replay:remove']: (...files: string[]) => void
}

export default class ImportQueueService extends BaseService<ImportQueueServiceEvent> {
  public get() {
    return this.client.importQueue.findMany()
  }

  public async remove(...files: string[]) {
    await this.client.$transaction(
      files.map((path) =>
        this.client.importQueue.delete({
          where: {
            path,
          },
        })
      )
    )

    this.emit('replay:remove', ...files)
  }

  public async add(...files: string[]) {
    const createdAt = new Date()
    const current = await this.get()
    const filtered = files.filter((file) =>
      current.every((item) => item.path !== file)
    )

    await this.client.$transaction(
      filtered.map((path) =>
        this.client.importQueue.create({
          data: {
            path,
            createdAt,
          },
        })
      )
    )

    this.emit('replay:add', ...filtered)
  }
}
