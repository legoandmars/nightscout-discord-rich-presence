import Axios from 'axios'
import readPkg from 'read-pkg'

const pkg = readPkg.sync()
const axios = Axios.create({
  headers: {
    'User-Agent': `${pkg.name}/${pkg.version}`,
  },
})

export default axios
