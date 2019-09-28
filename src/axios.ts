import Axios from 'axios'
import { sync as readPkgSync } from 'read-pkg-up'
import log from './log'

const pkg = readPkgSync({ cwd: __dirname })
if (pkg === undefined) {
  log.error('Could not find `package.json`', 1)
  throw new Error('missing package')
}

const axios = Axios.create({
  headers: {
    'User-Agent': `${pkg.package.name}/${pkg.package.version}`,
  },
})

export default axios
