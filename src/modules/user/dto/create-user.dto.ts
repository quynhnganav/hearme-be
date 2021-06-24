import { GUserInput } from "../../../schema";

export class CreateUserInputDTO implements GUserInput {
    
    username: string
    password: string
    roles?: [string] 

}