const directoryMap = {
  win32: '%HOME%/Documents/My Games/Rocket League/TAGame/Demos',
  darwin: '%HOME%/Library/Application Support/Rocket League/TAGame/Demos',
  linux: '%HOME%/.local/share/Rocket League/TAGame/Demos',
} as Record<NodeJS.Platform, string>

export default directoryMap
