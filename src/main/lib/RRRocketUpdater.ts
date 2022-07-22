import process from 'node:process'
import fetch from 'node-fetch'

const { RRROCKET_VERSION } = process.env

const urls = {
  LATEST_RELEASE:
    'https://api.github.com/repos/nickbabcock/rrrocket/releases/latest',
}

type GithubLatestReleaseResponse = {
  tag_name: string
  assets: {
    url: string
    name: string
    browser_download_url: string
  }[]
}

export const checkForUpdates = async () => {
  const results = await fetch(urls.LATEST_RELEASE)
  const data = (await results.json()) as GithubLatestReleaseResponse

  const [major, minor, patch] = data.tag_name
    .replace('v', '')
    .split('.')
    .map(Number)
  const [currentMajor, currentMinor, currentPatch] =
    RRROCKET_VERSION.split('.').map(Number)

  const isUpgradeAvailable =
    major > currentMajor || minor > currentMinor || patch > currentPatch
}
