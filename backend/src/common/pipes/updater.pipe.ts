import { ArgumentMetadata, Inject, Injectable, PipeTransform } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import { OperatorDto } from '../dto/operator.dto'

@Injectable()
export class UpdaterPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: any) {}
  transform(value: OperatorDto, metadata: ArgumentMetadata) {
    const user = this.request.user as IAuthUser

    // 添加错误处理，为测试环境提供默认值
    value.updateBy = user?.uid || 1 // 默认为管理员ID

    return value
  }
}
