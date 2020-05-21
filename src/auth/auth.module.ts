import { Module, HttpModule } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { ConfigService } from '@nestjs/config'
import { FacebookModule } from 'src/facebook/facebook.module'
import { PageModule } from 'src/page/page.module'

@Module({
  imports: [
    UserModule,
    PassportModule,
    FacebookModule,
    PageModule,
    HttpModule.register({
      baseURL: 'https://partner.viettelpost.vn/v2'
    }),
    HttpModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        baseURL: config.get('vtp.api_base_url')
      }),
      inject: [ConfigService]
    }),
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: { expiresIn: config.get('jwt.expired') }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
