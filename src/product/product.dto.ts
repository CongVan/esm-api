import { IsNotEmpty } from 'class-validator'
export class ProductDTO {
  @IsNotEmpty()
  readonly name: string
  readonly images: string
  @IsNotEmpty()
  readonly original_price: Int16Array
  @IsNotEmpty()
  readonly sell_price: Int16Array
  readonly sell_off: Int8Array
  @IsNotEmpty()
  readonly quantity: Int8Array
  readonly enable: boolean
  readonly created_by: string
}
