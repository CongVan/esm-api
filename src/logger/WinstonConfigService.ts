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

    const myFormat = printf(({ level, message, timestamp }) => {
      const date = new Date(timestamp)
      return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()} ${level.toUpperCase()}: ${message}`
    })

    return winston.createLogger({
      format: combine(
        // winston.format.colorize(),
        timestamp(),
        myFormat
        // winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error'
        }),
        new winston.transports.File({ filename: 'logs/combined.log' })
      ]
    })
  }
}
