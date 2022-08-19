import { contextBridge } from 'electron'
import api from '@rln/shared/api'

contextBridge.exposeInMainWorld('api', api)
