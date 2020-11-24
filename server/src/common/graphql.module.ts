import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Module({
    imports: [
        GraphQLModule.forRoot({
            autoSchemaFile: 'schema.gql',
            installSubscriptionHandlers: true,
            cors: {
                credentials: true,
                origin: true
            },
            context: ({req, res}) => ({req, res}),
            formatError: (err: GraphQLError) =>{
                console.error("--- GraphQL Error ---");
                console.error("Path", err.path);
                console.error("Massage", err.message);
                console.error("Code", err.extensions.code);
                console.error("Original Error", err.originalError);
                return err;
            }
        })
    ]
})

export class GraphqlModule {}