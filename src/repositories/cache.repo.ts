import { getRedis } from '../dbs/init.redis'

const redisCache = getRedis().instanceConnect

export const setCacheIO = async ({ key, value }) => {
  if (!redisCache) {
    throw new Error('Redis client not initialized')
  }
  try {
    return await redisCache.set(key, value)
  } catch (error) {
    throw new Error(error.message)
  }
}

export const setCacheIOExpiration = async ({ key, value, expirationInSeconds }) => {
  if (!redisCache) {
    throw new Error('Redis client not initialized')
  }
  try {
    return await redisCache.set(key, value, 'EX', expirationInSeconds)
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getCacheIO = async ({ key }) => {
  if (!redisCache) {
    throw new Error('Redis client not initialized')
  }
  try {
    return await redisCache.get(key)
  } catch (error) {
    throw new Error(error.message)
  }
}
