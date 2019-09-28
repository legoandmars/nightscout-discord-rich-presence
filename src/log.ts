import { green, grey, red, reset } from 'kleur'

// tslint:disable: no-console
const prefix = '❯'

export const info = (msg: string) => {
  const pre = green().bold(prefix)
  const str = reset(msg)

  console.log(`${pre} ${str}`)
}

const splitError: (err: Error) => [string, string[]] = err => {
  if (err.stack === undefined) return [err.message, []]

  const [first, ...stack] = err.stack.split('\n')
  return [first, stack]
}

export const error = (msg: string | Error, code?: number) => {
  if (typeof msg === 'string') {
    const pre = red().bold(prefix)
    const str = reset(msg)

    console.log(`${pre} ${str}`)
  } else {
    const [first, stack] = splitError(msg)

    const pre = red().bold(prefix)
    const str = reset(first)
    console.log(`${pre} ${str}`)

    for (const line of stack) {
      console.log(grey().italic(line))
    }
  }

  if (typeof code === 'number') process.exit(code)
}

const log = { info, error }
export default log
