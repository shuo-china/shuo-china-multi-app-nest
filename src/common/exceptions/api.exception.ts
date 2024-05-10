import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common'

interface ApiExceptionResponse {
  message: string
  code?: string
  [key: string]: any
}

export class ApiException extends HttpException {
  constructor(response: ApiExceptionResponse | string, status: number, options?: HttpExceptionOptions) {
    if (typeof response === 'string') {
      response = {
        message: response,
      }
    }
    if (!('code' in response)) {
      response.code = HttpStatus[status] || ApiException.name
    }
    super(response, status, options)
  }
}
