import { CheckPayloadPropFunc } from '../types'

export function propOneOf(args: any[]): CheckPayloadPropFunc {
  return (payload: any, prop: string) => args.includes(payload[prop])
}

export function propIsNotEqual(arg: any): CheckPayloadPropFunc {
  return (payload: any, prop: string) => payload[prop] !== arg
}

export function propIsNotEqualOneOf(arg: any[]): CheckPayloadPropFunc {
  return (payload: any, prop: string) => !arg.includes(payload[prop])
}
