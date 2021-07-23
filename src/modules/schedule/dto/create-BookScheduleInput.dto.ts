import { IsEnum, IsOptional, IsString, Validate } from "class-validator";
import { BookScheduleInput, EnumChannelSchedule } from "../../../schema";
import { Appointment } from "../schema/schedule.schema";
import { IsAppointmentConstraint } from "./appointment.dto";

export class BookScheduleInputDTO implements BookScheduleInput {

    @IsString()
    idDoctor: string;

    @Validate(IsAppointmentConstraint, {
        message: 'Sai lịch đặt'
    })
    appointment: Appointment

    @IsOptional()
    @IsEnum(EnumChannelSchedule)
    channel?: EnumChannelSchedule;

    @IsOptional()
    @IsString()
    note?: string;

}