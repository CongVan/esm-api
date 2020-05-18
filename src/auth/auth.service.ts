import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
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
    private pageService: PageService
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
        email,
        fb_access_token: access_token,
        ...(!userId && { username: email })
      },
      { new: true, upsert: true, useFindAndModify: false }
    )

    //Fetch Pages
    const pages: any = await this.facebookService.getUserPages(access_token)
    const pagesDTO = this.pageService.addPages(
      pages.map(page => ({
        page_id: page.id,
        name,
        access_token,
        user_id: userUpdate._id
      }))
    )

    return { userUpdate, pages: pagesDTO }
  }
}
