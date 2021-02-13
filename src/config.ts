import { join } from 'path'
import yaml from 'yaml'
import { exists, readFile, writeFile } from './fs'

export interface IConfig {
  siteUrl: string
  lowValue: number
  highValue: number
  units: 'mgdl' | 'mmol'
  displayNightscoutSite: boolean
  githubLink: boolean
}

const configPath = join(process.cwd(), 'config.yaml')
export const defaultConfig = `# Nightscout Discord Rich Prescense

# Link to your Nightscout site
siteUrl: ""

# Values to trigger low/high alarm status
lowValue: 80
highValue: 180

# Blood sugar readout units
# Valid values are 'mgdl' | 'mmol'
# Note: The alarm values will still be in mg/dl
units: "mgdl"

# Buttons
# These show up under the rich presence
# Enable/Disable these based on how you want it to look
displayNightscoutSite: false
githubLink: false
`

const InvalidConfigError = new Error('Invalid config!')
const validateConfig = (config: IConfig) => {
  try {
    if (typeof config.siteUrl !== 'string') return false
    if (typeof config.lowValue !== 'number') return false
    if (typeof config.highValue !== 'number') return false
    if (typeof config.units !== 'string') return false
    if (typeof config.displayNightscoutSite !== 'boolean') return false
    if (typeof config.githubLink !== 'boolean') return false
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

export const getDefaultConfig: () => Promise<[IConfig, boolean]> = async () => {
  const document = yaml.parseDocument(defaultConfig)
  lastConfig = document

  const config: IConfig = document.toJSON()

  return [config, true]
}
