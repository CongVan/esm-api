import * as mongoose from 'mongoose'
import * as md5 from 'md5'
import { Logger } from '@nestjs/common'

export const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    fb_access_token: { type: String },
    vtp_access_token: { type: String },
    fb_id: { type: String, unique: true },
    full_name: { type: String },
    avatar: { type: String },
    email: { type: String }
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
mongoose.set('useCreateIndex', true)
