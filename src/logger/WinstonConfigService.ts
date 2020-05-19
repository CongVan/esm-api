import { Injectable } from '@nestjs/common'
import { WinstonModuleOptions, WinstonModuleOptionsFactory } from 'nest-winston'
import * as winston from 'winston'
import { ConfigService } from '@nestjs/config'
import { format } from 'winston'

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(private config: ConfigService) {}

  createWinstonModuleOptions(): WinstonModuleOptions {
    const { combine, timestamp, label, printf } = format

    const myFormat = printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`
    })

    // const { host = 'localhost', port = 6379 } = this.config.get('redis')
    return winston.createLogger({
      format: combine(label({ label: 'Combine' }), timestamp(), myFormat),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/combined.log' })
      ]
    })
  }
}
