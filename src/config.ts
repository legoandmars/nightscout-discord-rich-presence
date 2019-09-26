import { join } from 'path'
import yaml from 'yaml'
import { exists, readFile, writeFile } from './fs'

export interface IConfig {
  siteUrl: string
  displayNightscoutSite: boolean
  lowValue: number
  highValue: number
  units: 'mgdl' | 'mmol'
}

const configPath = join(process.cwd(), 'config.yaml')
export const defaultConfig = `# Nightscout Discord Rich Prescense

# Link to your Nightscout site
siteUrl: ""

# Set to true to display your nightscout URL on the rich presence
displayNightscoutSite: false

# Values to trigger low/high alarm status
lowValue: 80
highValue: 180

# Blood sugar readout units
# Valid values are 'mgdl' | 'mmol'
# Note: The alarm values will still be in mg/dl
units: "mgdl"
`

const InvalidConfigError = new Error('Invalid config!')
const validateConfig = (config: IConfig) => {
  try {
    if (typeof config.siteUrl !== 'string') return false
    if (typeof config.displayNightscoutSite !== 'boolean') return false
    if (typeof config.lowValue !== 'number') return false
    if (typeof config.highValue !== 'number') return false
    if (typeof config.units !== 'string') return false
  } catch (err) {
    return false
  }

  return true
}

let lastConfig: yaml.ast.Document | null = null

export const loadConfig: () => Promise<[IConfig, boolean]> = async () => {
  let isDefault = false

  const fileExists = await exists(configPath)
  const getFile = async () => {
    if (!fileExists) {
      isDefault = true
      return defaultConfig
    }

    try {
      return readFile(configPath, 'utf8')
    } catch (err) {
      isDefault = true
      return defaultConfig
    }
  }

  const file = await getFile()
  const document = yaml.parseDocument(file)

  const config: IConfig = document.toJSON()
  const valid = validateConfig(config)
  if (!valid) throw InvalidConfigError

  lastConfig = document
  return [config, isDefault]
}

export const saveConfig = async (config: IConfig) => {
  if (lastConfig === null) throw new Error('Please load config before saving')

  const valid = validateConfig(config)
  if (!valid) throw InvalidConfigError

  // @ts-ignore
  const doc: yaml.ast.Document & Map<string, any> = lastConfig
  for (const [key, value] of Object.entries(config)) {
    doc.set(key, value)
  }

  const newYaml = doc.toString()
  await writeFile(configPath, newYaml)
}
