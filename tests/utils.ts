import { setImmediate } from 'timers'

export const flushPromises = () => new Promise(setImmediate)

export const flushTimeouts = () => new Promise(resolve => setTimeout(resolve, 0))
