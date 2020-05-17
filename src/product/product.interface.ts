import { Document } from 'mongoose'

export interface Product extends Document {
  readonly name: string
  readonly images: string
  readonly original_price: Int16Array
  readonly sell_price: Int16Array
  readonly sell_off: Int8Array
  readonly quantity: Int8Array
  readonly enable: boolean
  created_by: string
}
