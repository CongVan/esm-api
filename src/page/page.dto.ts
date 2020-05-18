import { IsNotEmpty } from 'class-validator'
export class PageDTO {  
  readonly name: string
  readonly access_token: string
  readonly user_id: string
  readonly page_id: string
}
