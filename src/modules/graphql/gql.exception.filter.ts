import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { Error } from 'mongoose'

@Catch(ApolloError)
export class ApolloErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    throw exception
  }
}

/**
 * TODO check hoạt động của exception filter
 */
@Catch(Error.ValidationError)
export class DocumentValidationErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(
      '🚀 ~ file: gql.exception.filter.ts ~ line 27 ~ DocumentValidationErrorFilter ~ exception',
      exception
    )
    throw new ApolloError(exception)
  }
}
