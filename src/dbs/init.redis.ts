// import redis from 'ioredis'

// let client: any
// const statusConnectRedis = {
//   CONNECT: 'connect',
//   END: 'end',
//   ERROR: 'error',
//   RECONNECT: 'reconnecting'
// }

// export const handleEventConnection = ({ connectionRedis }: { connectionRedis: any }) => {
//   connectionRedis.on(statusConnectRedis.CONNECT, () => {
//     console.log('connectionRedis - Connection status: connected')
//   })
//   connectionRedis.on(statusConnectRedis.END, () => {
//     console.log('connectionRedis - Connection status: disconnected')
//   })
//   connectionRedis.on(statusConnectRedis.RECONNECT, () => {
//     console.log('connectionRedis - Connection status: reconnecting')
//   })
//   connectionRedis.on(statusConnectRedis.ERROR, (err) => {
//     console.log(`connectionRedis - Connection status: error ${err}`)
//   })
// }

// export const initRedis = () => {
//   const instanceRedis = redis.createClient()
//   client.instanceConnect = instanceRedis
//   handleEventConnection({ connectionRedis: instanceRedis })
// }

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const getRedis = () => client

import redis from 'ioredis'

const statusConnectRedis = {
  CONNECT: 'connect',
  END: 'end',
  ERROR: 'error',
  RECONNECT: 'reconnecting'
}

// const REDIS_CONNECT_TIMEOUT = 10000
// const REDIS_CONNECT_MESSAGE = {
//   code: -99,
//   message: {
//     vn: 'Redis loi roi',
//     en: 'Service connection error'
//   }
// }

// const handleTimeoutError = () => {
//  const  connectionTimeout = setTimeout(() => {
//     throw new RedisErrorResponse({
//       message:REDIS_CONNECT_MESSAGE.message.vn,
//       statusCode: REDIS_CONNECT_MESSAGE.code
//     }
//   }, REDIS_CONNECT_TIMEOUT)
// }

const handleEventConnection = ({ connectionRedis }: { connectionRedis: any }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log('connectionRedis - Connection status: connected')
  })
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log('connectionRedis - Connection status: disconnected')
  })
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log('connectionRedis - Connection status: reconnecting')
  })
  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log(`connectionRedis - Connection status: error ${err}`)
  })
}

export const initRedis = () => {
  const instanceRedis = new redis({
    host: 'localhost',
    port: 6379
  })
  // Tạo đối tượng client với thuộc tính instanceConnect
  const client = { instanceConnect: instanceRedis }
  handleEventConnection({ connectionRedis: instanceRedis })
  return client
}

// Sử dụng initRedis để lấy client
const client = initRedis()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getRedis = () => client
