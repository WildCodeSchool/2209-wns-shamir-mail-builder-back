import { ApolloServer } from "apollo-server";
import { dataSource } from "./tools/utils";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/userResolver";
import * as dotenv from "dotenv";

const port = 5000;

const start = async (): Promise<void> => {
    await dataSource.initialize();
    const schema = await buildSchema({
      resolvers: [UserResolver], 
    })
    const server = new ApolloServer({
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      schema
    });
    try {
      const { url } :{url: string} = await server.listen({ port });
      console.log(`Server ready at ${url}`)
    } catch (e) {
      console.error('Error starting the server');
    }
};

void start();