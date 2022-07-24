import { Playlist, Rank } from '../enums'
import { MMRRankMap } from '../maps'

describe('MMR Rank Map', () => {
  it('should return Silver, Div 1 for 282 MMR in Duel', () => {
    const result = MMRRankMap(Playlist.DUEL, 282)

    expect(result.rank).toBe(Rank.SILVER)
    expect(result.division).toBe(1)
  })

  it('should return Bronze, Div 1 for 0 MMR in Standard', () => {
    const result = MMRRankMap(Playlist.STANDARD, 0)

    expect(result.rank).toBe(Rank.BRONZE)
    expect(result.division).toBe(1)
  })

  it('should return SSL for 1900 MMR in Doubles', () => {
    const result = MMRRankMap(Playlist.DOUBLES, 1900)

    expect(result.rank).toBe(Rank.SSL)
    expect(result.division).toBeUndefined()
  })

  it('should return Platinum, Div 2 for 715 MMR in Standard', () => {
    const result = MMRRankMap(Playlist.STANDARD, 715)

    expect(result.rank).toBe(Rank.PLATINUM)
    expect(result.division).toBe(2)
  })
})
