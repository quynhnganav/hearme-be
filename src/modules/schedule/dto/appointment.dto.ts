import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator'

import { Appointment } from '../schema/schedule.schema'
import { TimerFactory } from "../../../helper";
import * as moment from 'moment'

@ValidatorConstraint({ name: 'isAppointment', async: false })
export class IsAppointmentConstraint implements ValidatorConstraintInterface {
    validate(
        value: Appointment
    ): boolean | Promise<boolean> {
        return TimerFactory.checkTimer(value) && moment(value.date).startOf('day').add(value.from, 'hour').valueOf() >= moment().valueOf() 
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} don't Appointment`
    }
}
