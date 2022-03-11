import Repository from '~/db/Repository'
import Player from './Player'

export type SavePlayerResults = {
  newPlayers: Player[]
  existingPlayers: Player[]
}

export default class PlayerRepository extends Repository('Player')<Player> {
  async savePlayers(players: Player[]): Promise<SavePlayerResults> {
    const result: SavePlayerResults = {
      newPlayers: [],
      existingPlayers: [],
    }

    for await (const player of players) {
      const existing = await this.find(player.onlineId, player.name)

      if (existing != null) {
        result.existingPlayers.push(existing)
      } else {
        const newPlayer = await this.db.create(player)

        if (newPlayer != null) {
          result.newPlayers.push(newPlayer)
        }
      }
    }

    return result
  }

  /**
   * Finds a player by their onlineId first, name is a fallback.
   * @param onlineId
   * @param name
   * @returns
   */
  async find(onlineId?: string, name?: string) {
    if (onlineId != null) {
      const result = await this.db.findOne(`onlineId == "$0"`, onlineId)

      if (result != null) {
        return result
      }

      if (name != null) {
        return this.db.findOne(`name == "$0"`, name)
      }
    }
  }
}
