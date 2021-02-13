import 'source-map-support/register'

import isURL from 'is-url'
import prompts from 'prompts'
import { loadConfig, saveConfig, getDefaultConfig } from './config'
import { UNIT_MGDL, UNIT_MMOL } from './constants'
import log from './log'
import { fetchInfo, INightscoutData, parseData } from './nightscout'
import { rpcReady, setActivity } from './presence'

// Async Entrypoint
;(async () => {
  await rpcReady

  const loadConfigSafe = async () => {
    try {
      const c = await loadConfig()
      return c
    } catch (err) {
      log.error('Config is invalid!')
      const results = await prompts([
        {
          message: 'Would you like to re-run the setup?', 
          name: 'rerun', 
          type: 'toggle',
          active: 'yes',
          inactive: 'no',
        }])
      if(!results.rerun) process.exit(1)
      return getDefaultConfig()
    }
  }

  const [cfg, isDefault] = await loadConfigSafe()
  let config = cfg

  if (isDefault) {
    const results = await prompts([
      {
        message: 'Nightscout Site URL',
        name: 'siteUrl',
        type: 'text',
        validate: text => isURL(text),
      },
      {
        initial: 80,
        message: 'Alarm Trigger Lower Bound',
        min: 0,
        name: 'lowValue',
        type: 'number',
      },
      {
        initial: 180,
        message: 'Alarm Trigger Upper Bound',
        min: 0,
        name: 'highValue',
        type: 'number',
      },
      {
        choices: [
          {
            title: UNIT_MGDL,
            value: 'mgdl',
          },
          {
            title: UNIT_MMOL,
            value: 'mmol',
          },
        ],
        message: 'Blood Sugar Readout Units',
        name: 'units',
        type: 'select',
      },
      {
        active: 'yes',
        inactive: 'no',
        message: 'Display Nightscout Site URL button on Rich Presence',
        name: 'displayNightscoutSite',
        type: 'toggle',
      },
      {
        active: 'yes',
        inactive: 'no',
        message: 'Display GitHub Link button on Rich Presence',
        name: 'githubLink',
        type: 'toggle',
      },
    ])

    config = { ...config, ...results }
  }

  await saveConfig(config)

  const mainLoop = async () => {
    const data = (await fetchInfo(config.siteUrl)) as INightscoutData
    if (data == null) return
    const parsed = parseData(data, config)
    setActivity(parsed, config)

    console.clear()
    log.info(`Blood Sugar: ${parsed.value} (${parsed.direction})`)
    if (parsed.alert) log.error(parsed.alert.text)
  }

  mainLoop()
  setInterval(() => mainLoop(), 1000 * 15)
})()
