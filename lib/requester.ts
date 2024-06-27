import { request, GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient(
  <string>process.env.COINCORD_CORE_HOST_URL,
  {
    headers: {
      "Client-Id": <string>process.env.COINCORD_CORE_HOST_CLIENT_ID,
      "Client-Secret": <string>process.env.COINCORD_CORE_HOST_CLIENT_SECRET,
    },
  }
);

export default graphQLClient;
