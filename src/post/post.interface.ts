import { Document } from 'mongoose'

export interface Post extends Document {
  readonly page_id: string
  readonly post_id: string
  readonly content: string
  readonly publish_time: Date
}
