import { ApolloServer } from "apollo-server-express";
import { Express } from "express";
import { values } from "lodash";
import { ObjectId } from "mongodb";
import { buildSchemaSync } from "type-graphql";

import * as resolvers from "./resolvers";
import { authChecker, buildContext, ObjectIdScalar } from "./utils";

const apolloServer = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: values(resolvers),
    authChecker,
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    globalMiddlewares: [],
  }),
  playground: {
    settings: {
      "request.credentials": "include",
    },
  },
  context: ({ req }) => buildContext({ req }),
});

export const apollo = (app: Express) => {
  apolloServer.applyMiddleware({
    app,
    path: "/api/graphql",
  });
};
