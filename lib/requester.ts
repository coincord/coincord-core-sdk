import { request, GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient(
  `https://${<string>process.env.COINCORD_CORE_HOST_URL}/graphql`,
  {
    headers: {
      "Client-Id": <string>process.env.COINCORD_CORE_HOST_CLIENT_ID,
      "Client-Secret": <string>process.env.COINCORD_CORE_HOST_CLIENT_SECRET,
    },
  }
);

export default graphQLClient;
