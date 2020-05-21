import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Query
} from '@nestjs/common'
import { UserDTO } from 'src/user/user.dto'
import { UserService } from 'src/user/user.service'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @Post('login/:platform')
  async login(@Body() user: UserDTO, @Param() params, @Query() query) {
    const { platform } = params
    if (platform === 'fb') {
      return await this.authService.loginWithFacebook(
        user.fb_access_token,
        query.userId
      )
    }
    return await this.authService.login(user)
  }

  @UseGuards(JwtAuthGuard)
  @Post('login-shipment/:platform')
  async loginShipment(@Body() user: UserDTO, @Param() params, @Request() req) {
    const { platform } = params
    if (platform === 'vtp') {
      return await this.authService.loginViettelPost(user, req.user)
    }
    return { data: null }
  }

  @Post('register')
  async register(@Body() userDTO: UserDTO) {
    const user = await this.userService.addUser(userDTO)
    return user
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    const { _id } = req.user
    const user = await this.userService.findUserById(_id)
    return { data: user }
  }
}
