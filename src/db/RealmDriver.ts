import Realm from 'realm'
import connect from './connect'

export default class RealmDriver<T> {
  model: string
  db: Realm | null = null

  constructor(model: string) {
    this.model = model
  }

  async connect() {
    try {
      if (this.db == null) {
        this.db = await connect()
      }

      return this
    } catch (error) {
      console.error(`Unable to connect to db: ${error}`)
    }
  }

  /**
   * For more complex updates and queries.
   * @param callback A function to execute within the
   * Realm's write transaction. The callback will be passed
   * the Realm instance.
   */
  async write(callback: (realm: Realm) => unknown | Promise<unknown>) {
    await this.connect()

    this.db?.write(async () => {
      if (this.db != null) {
        await callback(this.db)
      }
    })
  }

  /**
   * Create an instance of <T> in the database.
   * @param initialData initial data for the model
   * @returns an instance of T, after being saved in the database.
   */
  async create(initialData: T): Promise<T> {
    await this.connect()

    return new Promise((resolve) => {
      this.db?.write(() => {
        const result = this.db?.create<T>(this.model, initialData) as T

        resolve(result)
      })
    })
  }

  async update(data: T): Promise<T | null> {
    await this.connect()

    return new Promise((resolve) => {
      this.db?.write(() => {
        const result = this.db?.create<T>(
          this.model,
          data,
          Realm.UpdateMode.Modified
        ) as T

        resolve(result)
      })
    })
  }

  async find(query: string, ...args: string[]): Promise<Realm.Results<T>> {
    await this.connect()

    return (
      this.db?.objects<T>(this.model).filtered(query, ...args) ??
      ([] as unknown as Realm.Results<T>)
    )
  }

  async findOne(query: string, ...args: string[]) {
    await this.connect()

    const result = await this.find(query, ...args)

    if (result != null && result.length > 0) {
      return result[0]
    }
  }

  async get(sortProp?: keyof T, reverse = false) {
    await this.connect()

    const data = this.db?.objects<T>(this.model)

    if (data != null && sortProp != null) {
      return data.sorted(sortProp as string, reverse)
    }

    return data
  }

  /**
   * Find an object by its id.
   * @param id id of the object to find
   * @returns a single result, or undefined
   */
  async one(id?: Realm.PrimaryKey) {
    if (id == null) {
      return
    }

    await this.connect()

    return this.db?.objectForPrimaryKey<T>(this.model, id)
  }

  /**
   * Find the first occurance of an object that matches the
   * query. Optionally sort, or reverse sort, results by property.
   * @param sortProp key of the object to sort on
   * @param reverse reverse the sort order: default false
   */
  async first(sortProp?: keyof T, reverse = false) {
    const data = await this.get(sortProp, reverse)

    return data && data.length > 0 ? (data[0] as T) : undefined
  }
}
