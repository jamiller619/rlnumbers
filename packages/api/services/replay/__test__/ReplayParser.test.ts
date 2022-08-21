import ReplayParser from '../ReplayParser'
import fileNames from './fileNames'

const results = fileNames.map(ReplayParser.parseFileName)

describe('ReplayParser.parseFileName', () => {
  it('should return a win, Jimbo Slottts, and Ranked Standard for replay[0]', () => {
    const result = results[0]

    expect(result.win).toBe(true)
    expect(result.owner).toBe('Jimbo Slottts')
    expect(result.playlist).toBe('Ranked Standard')
  })

  it('should return a loss, Jimbo Slottts, and undefined for replay[16]', () => {
    const result = results[16]

    expect(result.win).toBe(false)
    expect(result.owner).toBe('Jimbo Slottts')
    expect(result.playlist).toBe(undefined)
  })

  it('should return a loss, Ludwig van Alday, and Casual Standard for replay[35]', () => {
    const result = results[35]

    expect(result.win).toBe(false)
    expect(result.owner).toBe('Ludwig van Alday')
    expect(result.playlist).toBe('Casual Standard')
  })
})
