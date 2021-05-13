import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable()
export class Logging implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        
        const now = Date.now();

        return next.handle().pipe(
            tap(() => {

            }),
            catchError((error) => {
                return throwError(null)
            })
        )
        
        // throw new Error("Method not implemented.");
    }

}