import axios from './axios'
import { IConfig } from './config'
import {
  ARROW_DOUBLE_DOWN,
  ARROW_DOUBLE_UP,
  ARROW_FLAT,
  ARROW_FORTY_FIVE_DOWN,
  ARROW_FORTY_FIVE_UP,
  ARROW_NONE,
  ARROW_NOT_COMPUTABLE,
  ARROW_RATE_OUT_OF_RANGE,
  ARROW_SINGLE_DOWN,
  ARROW_SINGLE_UP,
  MULTIPLIER_MMOL,
  RPC_IMG_HIGH,
  RPC_IMG_LOW,
  RPC_STR_HIGH_ALERT,
  RPC_STR_LOW_ALERT,
  UNIT_MGDL,
  UNIT_MMOL,
} from './constants'
import log from './log'

export interface INightscoutData {
  _id: string
  device: string
  dateString: string
  sgv: number
  delta: number
  direction: string
  type: string
  filtered: number
  unfiltered: number
  rssi: number
  noise: number
  systime: string
}

export const fetchInfo = async (baseURL: string) => {
  try {
    const resp = await axios.get<INightscoutData[]>(
      '/api/v1/entries.json?count=1',
      { baseURL }
    )

    return resp.data[0]
  } catch (err) {
    console.clear()
    log.error('Could not contact Nightscout server!')
    log.error("Either your internet is down, or your site's URL is incorrect.")
    log.error('Please check `siteUrl` in your config.')

    return null
  }
}

export const mgdlToMmol = (mgdl: number) => mgdl / MULTIPLIER_MMOL
export const mmolToMgdl = (mmol: number) => mmol * MULTIPLIER_MMOL

export const directionArrow = (direction: string) => {
  const dir = direction.toUpperCase()
  switch (dir) {
    case 'NONE':
      return ARROW_NONE
    case 'DOUBLEUP':
      return ARROW_DOUBLE_UP
    case 'SINGLEUP':
      return ARROW_SINGLE_UP
    case 'FORTYFIVEUP':
      return ARROW_FORTY_FIVE_UP
    case 'FLAT':
      return ARROW_FLAT
    case 'FORTYFIVEDOWN':
      return ARROW_FORTY_FIVE_DOWN
    case 'SINGLEDOWN':
      return ARROW_SINGLE_DOWN
    case 'DOUBLEDOWN':
      return ARROW_DOUBLE_DOWN
    case 'NOT COMPUTABLE':
      return ARROW_NOT_COMPUTABLE
    case 'RATE OUT OF RANGE':
      return ARROW_RATE_OUT_OF_RANGE
    default:
      return ''
  }
}

export const humanUnits = (unit: IConfig['units']) =>
  unit === 'mgdl' ? UNIT_MGDL : UNIT_MMOL

export interface IParsedData {
  value: string
  direction: string

  alert?: IAlert
}

interface IAlert {
  type: 'low' | 'high'

  text: string
  image: string
}

export const parseData = (data: INightscoutData, config: IConfig) => {
  const isMmol = config.units === 'mmol'
  const lowerBound = isMmol ? mgdlToMmol(config.lowValue) : config.lowValue
  const upperBound = isMmol ? mgdlToMmol(config.highValue) : config.highValue

  const rawUnits = isMmol ? mgdlToMmol(data.sgv) : data.sgv
  const units = rawUnits.toFixed(0)

  const parsed: IParsedData = {
    direction: directionArrow(data.direction),
    value: isMmol ? `${units} ${UNIT_MMOL}` : `${units} ${UNIT_MGDL}`,
  }

  if (rawUnits <= lowerBound) {
    parsed.alert = {
      image: RPC_IMG_LOW,
      text: RPC_STR_LOW_ALERT,
      type: 'low',
    }
  } else if (rawUnits >= upperBound) {
    parsed.alert = {
      image: RPC_IMG_HIGH,
      text: RPC_STR_HIGH_ALERT,
      type: 'high',
    }
  }

  return parsed
}
