import { connect } from '~/db/client'

export type UnknownValueType = 'platform' | 'map' | 'playlist' | 'rank'

const client = connect()

export const saveUnknownValue = async (
  type: UnknownValueType,
  value: string
) => {
  const existing = await client.unknownValue.findFirst({
    where: {
      type,
      value,
    },
  })

  if (existing == null) {
    await client.unknownValue.create({
      data: {
        type,
        value,
      },
    })
  }
}
