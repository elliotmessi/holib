import { Body, Controller, Headers, Post, UseGuards } from "@nestjs/common"
import dayjs from "dayjs"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { ApiResult } from "~/common/decorators/api-result.decorator"
import { BusinessException } from "~/common/exceptions/biz.exception"
import { ErrorEnum } from "~/constants/error-code.constant"
import { Ip } from "~/common/decorators/http.decorator"

import { UserService } from "../user/user.service"
import { RoleService } from "../system/role/role.service"

import { AuthService } from "./auth.service"
import { Public } from "./decorators/public.decorator"
import { LoginDto, RegisterDto, RefreshTokenDto } from "./dto/auth.dto"
import { LocalGuard } from "./guards/local.guard"
import { LoginToken } from "./models/auth.model"
import { CaptchaService } from "./services/captcha.service"
import { TokenService } from "./services/token.service"

@ApiTags("Auth - 认证模块")
@UseGuards(LocalGuard)
@Public()
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private captchaService: CaptchaService,
    private tokenService: TokenService,
    private roleService: RoleService
  ) {}

  @Post("login")
  @ApiOperation({ summary: "登录" })
  @ApiResult({ type: LoginToken })
  async login(@Body() dto: LoginDto, @Ip() ip: string, @Headers("user-agent") ua: string): Promise<LoginToken> {
    await this.captchaService.checkImgCaptcha(dto.captchaId, dto.verifyCode)
    const token = await this.authService.login(dto.username, dto.password, ip, ua)
    return token
  }

  @Post("register")
  @ApiOperation({ summary: "注册" })
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.userService.register(dto)
  }

  @Post("refresh")
  @ApiOperation({ summary: "刷新令牌" })
  @ApiResult({ type: Object })
  async refresh(@Body() dto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    // 查找 refreshToken 实体
    const refreshTokenEntity = await this.tokenService.getRefreshTokenEntity(dto.refreshToken)
    if (!refreshTokenEntity) {
      throw new BusinessException(ErrorEnum.INVALID_REFRESH_TOKEN)
    }

    // 检查 refreshToken 是否过期
    const now = dayjs()
    if (now.isAfter(refreshTokenEntity.expired_at)) {
      throw new BusinessException(ErrorEnum.REFRESH_TOKEN_EXPIRED)
    }

    // 获取用户信息
    const user = refreshTokenEntity.accessToken.user

    // 获取用户角色
    const roleIds = await this.roleService.getRoleIdsByUser(user.id)
    const roleValues = await this.roleService.getRoleValues(roleIds)

    // 生成新的 accessToken 和 refreshToken
    const newToken = await this.tokenService.generateAccessToken(user.id, roleValues)

    // 移除旧的 token 实体
    await refreshTokenEntity.accessToken.remove()

    return {
      accessToken: newToken.accessToken,
      refreshToken: newToken.refreshToken,
    }
  }
}
