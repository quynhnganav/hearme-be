import { IsNumber, IsOptional, IsString } from "class-validator"
import { RegisterDoctorInput } from "../../../schema";

export class RegisterDoctorInputDTO implements RegisterDoctorInput {
    @IsString()
    @IsOptional()
    slogan?: string

    @IsString()
    @IsOptional()
    note?: string

    @IsNumber()
    exprience: number

    specialties: string[]
    offeres: string[]
    cvLink: string
    
}