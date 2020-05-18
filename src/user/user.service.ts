import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './user.interface'
import { UserDTO } from './user.dto'
import * as md5 from 'md5'

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findUser(username: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      username,
      password: md5(password)
    })
    return user
  }

  async findUserByQuery(query): Promise<User | null> {
    const user = await this.userModel.findOne(query)
    return user
  }

  async findUserById(id): Promise<User | null> {
    const user = await this.userModel.findById(id)
    return user
  }

  async addUser(userDTO: UserDTO): Promise<User> {
    const { username } = userDTO
    const isExistsUser = await this.userModel.findOne({ username })
    if (isExistsUser) {
      throw new HttpException('Username is exists', HttpStatus.BAD_REQUEST)
    }
    const user = await new this.userModel(userDTO)
    return user.save()
  }

  async findOneAndUpdate(query, update, options): Promise<UserDTO> | null {
    const user = await this.userModel.findOneAndUpdate(query, update, options)
    return user
  }
}
