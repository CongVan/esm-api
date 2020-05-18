import { Document } from 'mongoose'

export interface Page extends Document {
  readonly name: string
  readonly access_token: string
  readonly page_id: string
  readonly user_id: string
}
