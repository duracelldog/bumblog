import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
    imports: [
        GraphQLModule.forRoot({
            autoSchemaFile: 'schema.gql',
            cors: {
                credentials: true,
                origin: true
            },
            context: ({req, res}) => ({req, res}),
        })
    ]
})

export class GraphqlModule {}