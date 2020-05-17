import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  await app.listen(configService.get('SEVER_PORT'))
  Logger.log(`Sever running on PORT ${configService.get('SEVER_PORT')}`)
}
bootstrap()
