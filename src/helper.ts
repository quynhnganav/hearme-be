import { range } from 'lodash'
import { v1 } from 'uuid'
import { Appointment } from './modules/schedule/schema/schedule.schema'
import * as moment from 'moment'

export class IDFactory {
  public static createID() {
    return v1
  }
  public static generateID() {
    return v1()
  }

  public static generateCode() {
    return `${Math.floor((Math.random()*1000)+1)}-${Math.floor((Math.random()*1000)+1)}-${Math.floor((Math.random()*1000)+1)}`
  }

}

export class TimerFactory {

  public static TimeAccept = range(1, 24).map(r => ({ from: r, to: (r+1) }))

  public static checkTimer(appointment: Appointment){
    return this.TimeAccept.some(r => (r.from == appointment.from && r.to == appointment.to))
  }

  public static timeToAppointment(time: number): Appointment {
    const date = moment(time)
    return ({
      from: date.clone().hour(),
      to: date.clone().hour(),
      date: date.startOf('day').valueOf()
    })
  }

}

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]
