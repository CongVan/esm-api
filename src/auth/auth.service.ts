import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { UserDTO } from 'src/user/user.dto'
import { JwtService } from '@nestjs/jwt'
import { FacebookService } from 'src/facebook/facebook.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private facebookService: FacebookService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUser(username, password)
    return user
  }

  async login(user: UserDTO) {
    const { username, password } = user
    const u = await this.userService.findUser(username, password)

    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign({ user: u })
    }
  }
  async loginWithFacebook(access_token) {
    const fbUserInfo = await this.facebookService.getUserInfo(access_token)
    return fbUserInfo
  }
}
