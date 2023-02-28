import { ApolloServer } from "apollo-server";
import { dataSource } from "./utils";
import { buildSchema } from "type-graphql";
import authService from "../services/authService";
import { UserResolver } from "../resolvers/userResolver";
import { StripeResolver } from "../resolvers/StripeResolver";
import { SubscriptionResolver } from "../resolvers/SubscriptionResolver";

async function createServer(): Promise<ApolloServer> {
    await dataSource.initialize();
    const schema = await buildSchema({
      resolvers: [UserResolver, StripeResolver, SubscriptionResolver],
      authChecker: ({ context }) => {
        console.log("CONTEXT", context);

        if (context.user === undefined) {
            return false;
          }
          return false;
      },
    });
    return new ApolloServer({
      schema,
      context: ({ req }) => {
        if (
          req?.headers.authorization === undefined ||
          process.env.JWT_SECRET_KEY === undefined
        ) {
          return {};
        } else {
          try {
            const bearer = req.headers.authorization.split("Bearer ")[1];
            const userPayload = authService.verifyToken(bearer);
            console.log(userPayload)
  
            return { user: userPayload };
          } catch (e) {
            console.log(e);
            return {};
          }
        }
      },
    });
  }

  export default createServer;
