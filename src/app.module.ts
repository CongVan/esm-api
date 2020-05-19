import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { MongooseConfigService } from './database/mongo-config-service'
import { ProductModule } from './product/product.module'
import { FacebookModule } from './facebook/facebook.module'
import { PageModule } from './page/page.module'
import { BullModule } from '@nestjs/bull'
import configuration from './config/configuration'
import { FacebookQueueConfigService } from './queues/facebook/FacebookConfigService'
import { WinstonModule } from 'nest-winston'
import { WinstonConfigService } from './logger/WinstonConfigService'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService
    }),
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
    AuthModule,
    UserModule,
    ProductModule,
    FacebookModule,
    PageModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
