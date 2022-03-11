import Realm from 'realm'

export default abstract class Base<T extends Base<T>> {
  readonly _id: Realm.BSON.ObjectId
  readonly id: string

  constructor(data: Partial<T> = {}) {
    const { _id, id, ...rest } = data

    this._id =
      _id ??
      (id && Realm.BSON.ObjectId.createFromHexString(id)) ??
      new Realm.BSON.ObjectId()
    this.id = id ?? this._id.toHexString()

    Object.assign(this, rest)
  }
}
