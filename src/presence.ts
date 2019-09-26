import DiscordRPC from 'discord-rpc'
import { RPC_CLIENT_ID } from './constants'

DiscordRPC.register(RPC_CLIENT_ID)
const rpc = new DiscordRPC.Client({ transport: 'ipc' })

export const rpcReady = new Promise(resolve => {
  rpc.on('ready', () => resolve())
})

rpc.login({ clientId: RPC_CLIENT_ID })
