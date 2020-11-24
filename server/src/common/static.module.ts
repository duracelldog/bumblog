import { Module } from "@nestjs/common";
import { ServeStaticModule } from '@nestjs/serve-static'
import { resolve } from 'path';
console.log('sfdfsdsdf', resolve('./public'))
@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: resolve('../client/build'),
            exclude: ["/graphql"]
        }),
        ServeStaticModule.forRoot({
            rootPath: resolve('./public'),
            serveRoot: resolve('/public'),
        }),
    ]
})

export class StaticModule {}
