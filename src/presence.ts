import DiscordRPC from 'discord-rpc'
import { IConfig } from './config'
import {
  RPC_CLIENT_ID,
  RPC_GITHUB_LINK,
  RPC_IMG_NIGHTSCOUT_LOGO,
  RPC_STR_DETAIL,
} from './constants'
import { IParsedData } from './nightscout'

DiscordRPC.register(RPC_CLIENT_ID)
const rpc = new DiscordRPC.Client({ transport: 'ipc' })

export const rpcReady = new Promise(resolve => {
  rpc.on('ready', () => resolve())
})

export const setActivity = (data: IParsedData, config: IConfig) => {
  const state = `${data.value} (${data.direction})`
  const buttons: any[] = []
  if (config.displayNightscoutSite) {
    buttons.push({
      label: 'More Info',
      url: config.siteUrl.replace(/http:\/\/|https:\/\/|\//gi, ''),
    })
  }
  if (config.githubLink) {
    buttons.push({ label: 'GitHub Link', url: RPC_GITHUB_LINK })
  }
  const presence = {
    details: RPC_STR_DETAIL,
    largeImageKey: RPC_IMG_NIGHTSCOUT_LOGO,
    largeImageText: state,
    smallImageKey: (data.alert && data.alert.image) || undefined,
    smallImageText: (data.alert && data.alert.text) || undefined,
    state,
  }
  // error checking for this part needs to be ignored because discord-rpc types are not updated
  // @ts-ignore
  if (buttons.length > 0) presence.buttons = buttons
  rpc.setActivity(presence)
}

rpc.login({ clientId: RPC_CLIENT_ID })
