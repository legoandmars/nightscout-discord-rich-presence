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

const configPath = join(__dirname, 'config.yaml')
export const defaultConfig = `# Nightscout Discord Rich Prescense

# Link to your Nightscout site
siteUrl: ""

# Set to true to display your nightscout URL on the rich presence
displayNightscoutSite: false

# Values to trigger low/high alarm status
lowValue: 80
highValue: 180

# Blood sugar display units
# Valid values are 'mgdl' | 'mmol'
# Note: The alarm values will still be in mg/dl
units: "mgdl"
`

let lastConfig: yaml.ast.Document | null = null

export const loadConfig: () => Promise<IConfig> = async () => {
  const fileExists = await exists(configPath)
  const getFile = async () => {
    if (!fileExists) return defaultConfig
    try {
      return readFile(configPath, 'utf8')
    } catch (err) {
      return defaultConfig
    }
  }

  const file = await getFile()
  const document = yaml.parseDocument(file)
  lastConfig = document

  const config: IConfig = document.toJSON()
  return config
}

export const saveConfig = async (config: IConfig) => {
  if (lastConfig === null) throw new Error('Please load config before saving')

  // @ts-ignore
  const doc: yaml.ast.Document & Map<string, any> = lastConfig
  for (const [key, value] of Object.entries(config)) {
    doc.set(key, value)
  }

  const newYaml = doc.toString()
  await writeFile(configPath, newYaml)
}
