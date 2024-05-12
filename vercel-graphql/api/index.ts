import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql, GraphQLSchema } from "graphql";
import { NextApiRequest, NextApiResponse } from "next";

const typeDefs = `
    type Query {
        users: [User!]!
    }

    type User {
        id: ID!
        name: String
    }
`;

const resolvers = {
  Query: {
    users: () => [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
    ],
  },

  User: {
    id: (user: { id: number }) => user.id,
    name: (user: { name: string }) => user.name,
  },
};

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  const { query, variables, operationName } = body;

  const result = await graphql({
    schema,
    source: query,
    variableValues: variables,
    operationName,
  });

  res.status(200).json(result);
};
