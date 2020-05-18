import { Document } from 'mongoose'

export interface User extends Document {
  readonly _id: string
  readonly username: string
  readonly password: string
  readonly fb_access_token: string
  readonly full_name: string
  readonly avatar: string
}
