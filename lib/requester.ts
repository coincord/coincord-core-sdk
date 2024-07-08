// This software and its associated documentation are the exclusive property of Coincord.
// It is provided to authorized Coincord partners and clients under the terms of the Coincord Software License.
// Unauthorized use, copying, distribution, or modification of this software is strictly prohibited.
// © Coincord 2024. All rights reserved.

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
