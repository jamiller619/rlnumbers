import RealmDriver from './RealmDriver'

export default function Repository(model: string) {
  return class Repository<T> {
    db: RealmDriver<T> = new RealmDriver<T>(model)
  }
}
