import 'source-map-support/register'

import isURL from 'is-url'
import prompts from 'prompts'
import { loadConfig, saveConfig } from './config'
import log from './log'

// Async Entrypoint
;(async () => {
  const loadConfigSafe = async () => {
    try {
      const c = await loadConfig()
      return c
    } catch (err) {
      log.error('Config is invalid!', 1)
      return []
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
        active: 'yes',
        inactive: 'no',
        message: 'Display Site URL on Rich Presence',
        name: 'displayNightscoutSite',
        type: 'toggle',
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
            title: 'mg/dL',
            value: 'mgdl',
          },
          {
            title: 'mmol/L',
            value: 'mmol',
          },
        ],
        message: 'Blood Sugar Readout Units',
        name: 'units',
        type: 'select',
      },
    ])

    config = { ...config, ...results }
  }

  await saveConfig(config)
})()
