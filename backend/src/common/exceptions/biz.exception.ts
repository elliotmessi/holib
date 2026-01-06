import { HttpException, HttpStatus } from '@nestjs/common'

import { ErrorEnum } from '~/constants/error-code.constant'
import { RESPONSE_SUCCESS_CODE } from '~/constants/response.constant'

export class BusinessException extends HttpException {
  private readonly errorCode: number

  constructor(error: ErrorEnum | string) {
    if (!error.includes(':')) {
      super({ code: RESPONSE_SUCCESS_CODE, message: error }, HttpStatus.OK)
      this.errorCode = RESPONSE_SUCCESS_CODE
      return
    }

    const [code, message] = error.split(':')
    const errorCodeNumber = Number(code)

    let httpStatus = HttpStatus.OK

    switch (errorCodeNumber) {
      case 1029:
      case 1024:
      case 1019:
      case 1023:
        httpStatus = HttpStatus.NOT_FOUND
        break
      case 1028:
      case 1025:
      case 1026:
      case 1027:
      case 1030:
      case 1031:
      case 1032:
      case 1033:
      case 1034:
      case 1035:
      case 1009:
      case 1010:
      case 1015:
        httpStatus = HttpStatus.CONFLICT
        break
      case 1102:
        httpStatus = HttpStatus.FORBIDDEN
        break
      case 1101:
        httpStatus = HttpStatus.UNAUTHORIZED
        break
      default:
        if (errorCodeNumber >= 500) {
          httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
        }
        break
    }

    super({ code: errorCodeNumber, message }, httpStatus)
    this.errorCode = errorCodeNumber
  }

  getErrorCode(): number {
    return this.errorCode
  }
}

export { BusinessException as BizException }
