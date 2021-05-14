import { IsBoolean, IsOptional, IsString } from "class-validator";
import { GUserInput } from "src/schema";

export class UpdateUserInputDTO implements GUserInput {

    @IsOptional()
    @IsString()
    username?: string;
    
    @IsOptional()
    @IsString()
    password?: string;
    
    @IsOptional()
    @IsString()
    firstName?: string;
    
    @IsOptional()
    @IsString()
    lastName?: string;
    
    @IsOptional()
    @IsString()
    email?: string;
    
    @IsOptional()
    permissions?: string[];
    
    @IsOptional()
    @IsBoolean()
    isLocked?: boolean;
    
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

}