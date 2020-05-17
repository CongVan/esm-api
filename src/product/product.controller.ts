import {
  Controller,
  UseGuards,
  Get,
  Request,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
  Param,
  Delete,
  Query
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ProductService } from './product.service'
import { ProductDTO } from './product.dto'

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async find(@Query() query) {
    const {page} = query
    const products = await this.productService.find({page})
    return products
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async addProduct(@Body() productDTO: ProductDTO) {
    const product = await this.productService.addProduct(productDTO)
    return { data: product }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateProduct(@Body() productDTO: ProductDTO, @Param() params) {
    const product = await this.productService.updateProduct(
      params.id,
      productDTO
    )
    return { data: product }
  }

  @Delete(':id')
  async deleteProduct(@Param() params) {
    const res: boolean = await this.productService.deleteProduct(params.id)
    return { data: res }
  }
}
