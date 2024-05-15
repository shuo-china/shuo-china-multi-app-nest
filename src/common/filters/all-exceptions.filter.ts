import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core'
import { MESSAGES } from '@nestjs/core/constants'
import { isObject } from '@nestjs/common/utils/shared.utils'
import Case from 'case'
import { isDev } from '@/common/utils/env'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private static readonly logger = new Logger('ExceptionsHandler')

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    if (!(exception instanceof HttpException)) {
      return this.handleUnknownError(exception, host, httpAdapter)
    }

    const response = host.getArgByIndex(1)
    if (!httpAdapter.isHeadersSent(response)) {
      const exceptionResponse = exception.getResponse()
      const body = isObject(exceptionResponse)
        ? this.handleHttpExceptionResponse(exceptionResponse, exception)
        : this.createBody(exception.name, exceptionResponse)

      httpAdapter.reply(response, body, exception.getStatus())
    } else {
      httpAdapter.end(response)
    }
  }

  public createBody(code: string, message: string, otherParams?: Record<string, any>) {
    const body = {
      code: Case.constant(code),
      message,
    }

    if (isObject(otherParams)) {
      Object.keys(body).forEach((k) => Reflect.deleteProperty(otherParams, k))
      Object.assign(body, otherParams)
    }

    return body
  }

  public handleHttpExceptionResponse(response: Record<string, any>, exception: HttpException) {
    const code = 'code' in response ? response.code : response.error ?? exception.name
    const message = 'message' in response ? response.message : exception.message
    return this.createBody(code, message, response)
  }

  public handleUnknownError(exception: unknown, host: ArgumentsHost, httpAdapter: AbstractHttpAdapter) {
    const response = host.getArgByIndex(1)
    if (!httpAdapter.isHeadersSent(response)) {
      let body: ReturnType<typeof this.createBody>

      if (isDev() && exception instanceof Error) {
        body = this.createBody(exception.name, exception.message, {
          stack: exception.stack,
        })
      } else {
        body = this.createBody('SERVER_ERROR', MESSAGES.UNKNOWN_EXCEPTION_MESSAGE)
      }

      httpAdapter.reply(response, body, HttpStatus.INTERNAL_SERVER_ERROR)
    } else {
      httpAdapter.end(response)
    }

    if (exception instanceof Error) {
      return AllExceptionsFilter.logger.error(exception.message, exception.stack)
    }

    return AllExceptionsFilter.logger.error(exception)
  }
}
