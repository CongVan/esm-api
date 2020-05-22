import {
  Injectable,
  HttpException,
  HttpStatus,
  HttpService
} from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { UserDTO } from 'src/user/user.dto'
import { JwtService } from '@nestjs/jwt'
import { FacebookService } from 'src/facebook/facebook.service'
import { FacebookDTO } from 'src/facebook/facebook.dto'
import { PageService } from 'src/page/page.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private facebookService: FacebookService,
    private pageService: PageService,
    private httpService: HttpService
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
  async loginWithFacebook(access_token, userId) {
    const fbUserInfo: FacebookDTO = await this.facebookService.getUserInfo(
      access_token
    )
    if (!fbUserInfo) {
      throw new HttpException('Access token invalid', HttpStatus.BAD_REQUEST)
    }
    const { name, id, email } = fbUserInfo

    const query = { ...(userId ? { _id: userId } : { fb_id: fbUserInfo.id }) }

    const userUpdate = await this.userService.findOneAndUpdate(
      query,
      {
        full_name: name,
        fb_id: id,
        ...(email && { email }),
        fb_access_token: access_token,
        ...(!userId && email && { username: email })
      },
      { new: true, upsert: true, useFindAndModify: false }
    )
    await this.facebookService.addJobSyncUserInfo(userUpdate)

    return { access_token: this.jwtService.sign({ user: userUpdate }) }
  }

  async loginViettelPost({ username, password }, auth: UserDTO) {
    const { data } = await this.httpService
      .post('/user/Login', { USERNAME: username, PASSWORD: password })
      .toPromise()

    const { data: userVtp } = data

    if(!userVtp) {
      throw new HttpException('Username/password invalid', HttpStatus.NOT_FOUND)
    }
    console.log(data)

    const user = await this.userService.findByIdAndUpdate(
      auth._id,
      { vtp_access_token: userVtp.token },
      { new: true, useFindAndModify: false }
    )

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return user
  }
}
