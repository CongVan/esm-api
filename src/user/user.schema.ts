import * as mongoose from 'mongoose'
import * as md5 from 'md5'
import { Logger } from '@nestjs/common'

export const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    fb_access_token: { type: String },
    full_name: { type: String },
    avatar: { type: String }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
  }
)

UserSchema.pre('save', function(next) {
  const user: any = this
  user.password = md5(user.password)
  next()
})
