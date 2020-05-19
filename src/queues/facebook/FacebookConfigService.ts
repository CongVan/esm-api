import { Injectable } from '@nestjs/common'
import { BullOptionsFactory, BullModuleOptions } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FacebookQueueConfigService implements BullOptionsFactory {
  constructor(private config: ConfigService) {}

  createBullOptions(): BullModuleOptions {
    const { host = 'localhost', port = 6379 } = this.config.get('redis')
    return {

      redis: {
        host,
        port
      }
    }
  }
}
