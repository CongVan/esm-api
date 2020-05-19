import { Injectable } from '@nestjs/common'
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    const { host, port, user, pass, name: database } = this.configService.get(
      'database'
    )
    const uri = `mongodb://${user}:${pass}@${host}:${port}/${database}?authSource=admin`
    console.log(uri);
    
    return {
      uri,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000
    }
  }
}
