import Realm from 'realm'
import { PlayerSchema } from '~/player/Player'
import { PlayerStatsSchema } from '~/player/PlayerStats'
import { ReplaySchema } from '~/replays/Replay'

const ref: { current: null | Realm } = Object.seal({
  current: null,
})

export default async function connect() {
  try {
    if (ref.current == null || ref.current?.isClosed) {
      ref.current = await Realm.open({
        path: 'rlnumbers.realm',
        schema: [ReplaySchema, PlayerSchema, PlayerStatsSchema],
      })
    }
  } catch (err) {
    console.error(`Unable to connect: ${(err as Error)?.message}`)
  }

  return ref.current as Realm
}
