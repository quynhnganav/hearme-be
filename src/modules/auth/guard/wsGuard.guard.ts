import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";


@Injectable()
export class WsGuard implements CanActivate {


    constructor(

    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // throw new Error("Method not implemented.");
        return true
    }

}