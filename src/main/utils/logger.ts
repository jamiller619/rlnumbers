import { BrowserWindow } from 'electron'

export default function init(mainWindow: BrowserWindow) {
  const logCallback = (channel: string) => {
    return (message?: unknown, ...params: unknown[]) => {
      mainWindow.webContents.send(channel, message, ...params)
    }
  }

  const onReady = () => {
    console.log = logCallback('log:info')
    console.warn = logCallback('log:warn')
    console.error = logCallback('log:error')
  }

  mainWindow.webContents.once('dom-ready', onReady)

  return mainWindow
}
