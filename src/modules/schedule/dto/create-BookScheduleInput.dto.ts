import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { BookScheduleInput, EnumChannelSchedule } from "../../../schema";

export class BookScheduleInputDTO implements BookScheduleInput {

    @IsString()
    idDoctor: string;
    
    @IsNumber()
    time: number;
    
    @IsOptional()
    @IsEnum(EnumChannelSchedule)
    channel?: EnumChannelSchedule;

    @IsOptional()
    @IsString()
    note?: string;

    duration: number;
    
}