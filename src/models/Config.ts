import RealmDriver from '~/db/RealmDriver'

const repo = new RealmDriver<Config>('Config')

export const ConfigSchema = {
  name: 'Config',
  properties: {
    paths: 'string[]',
  },
}

type Config = {
  paths: string[]
}

export const getPaths = async () => {
  const config = await repo.first()

  return config?.paths
}

export const setPaths = async (paths: string[]) => {
  const hasConfig = (await getPaths()) != null
  const method = hasConfig ? 'update' : 'create'

  return repo[method]({ paths })
}
