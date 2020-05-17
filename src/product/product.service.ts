import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PaginateModel } from 'mongoose-paginate-v2'
import { Product } from './product.interface'
import { ProductDTO } from './product.dto'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: PaginateModel<Product>,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  async find({ page = 1 }): Promise<ProductDTO[]> | null {
    const user: any = this.request.user
    const products = await this.productModel.paginate(
      { created_by: user._id },
      { page }
    )
    return products
  }

  async addProduct(productDTO: ProductDTO): Promise<ProductDTO> {
    const user: any = this.request.user
    const product = new this.productModel(productDTO)
    product.created_by = user._id

    await product.save().catch(err => {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    })

    return product
  }

  async updateProduct(
    productId: string,
    productDTO: ProductDTO
  ): Promise<ProductDTO> {
    if (!this.isOwnerProduct(productDTO.created_by)) {
      return null
    }

    const product = await this.productModel
      .findByIdAndUpdate(productId, productDTO, { new: true })
      .catch(err => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
      })

    return product
  }
  async deleteProduct(productId: string): Promise<boolean> {
    const product = await this.productModel.findById(productId)
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
    }
    if (!this.isOwnerProduct(product.created_by)) {
      return false
    }
    await product.remove().catch(err => {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    })
    return true
  }

  isOwnerProduct(produtCretedById): boolean {
    const user: any = this.request.user

    if (String(user._id) !== String(produtCretedById)) {
      throw new HttpException(
        'Not authoritative to product',
        HttpStatus.NON_AUTHORITATIVE_INFORMATION
      )
    }
    return true
  }
}
