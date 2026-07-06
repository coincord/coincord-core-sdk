// This software and its associated documentation are the exclusive property of Ezrah.
// It is provided to authorized Ezrah partners and clients under the terms of the Ezrah Software License.
// Unauthorized use, copying, distribution, or modification of this software is strictly prohibited.
// © Coincord 2024. All rights reserved.

import { GraphQLClient } from "graphql-request";

const GQL_ENDPOINT = `https://${process.env.COINCORD_CORE_HOST_URL}/graphql`;

const AUTH_HEADERS = {
  "Client-Id": process.env.COINCORD_CORE_HOST_CLIENT_ID as string,
  "Client-Secret": process.env.COINCORD_CORE_HOST_CLIENT_SECRET as string,
  "x-api-key": process.env.COINCORD_CORE_HOST_CLIENT_SECRET as string,
  "apollo-require-preflight": "1",
};

const graphQLClient = new GraphQLClient(GQL_ENDPOINT, {
  headers: AUTH_HEADERS,
});

/**
 * Sends a GraphQL mutation as a multipart/form-data request following the
 * GraphQL multipart request spec. Used for mutations that include file uploads.
 *
 * files — array of { variablePath, file } where variablePath is the dot-notation
 * path into variables where the file sits (e.g. "variables.files.0").
 */
export async function multipartFetch<T = any>(
  document: string,
  variables: Record<string, any>,
  files: { variablePath: string; file: File | Blob }[],
): Promise<T> {
  // Deep-clone variables so we can null out file slots without mutating the caller's object
  const vars = JSON.parse(JSON.stringify(variables));

  // Per spec, file variable slots must be null in operations
  for (const { variablePath } of files) {
    const parts = variablePath.replace(/^variables\./, "").split(".");
    let node: any = vars;
    for (let i = 0; i < parts.length - 1; i++) {
      node = node[parts[i]];
    }
    node[parts[parts.length - 1]] = null;
  }

  // Build map: { "0": ["variables.files.0"], "1": ["variables.files.1"], ... }
  const map: Record<string, string[]> = {};
  files.forEach(({ variablePath }, i) => {
    map[String(i)] = [variablePath];
  });

  const form = new FormData();
  form.append("operations", JSON.stringify({ query: document, variables: vars }));
  form.append("map", JSON.stringify(map));
  files.forEach(({ file }, i) => {
    form.append(String(i), file);
  });

  const res = await fetch(GQL_ENDPOINT, {
    method: "POST",
    // Do NOT set Content-Type — the browser/Node sets it with the correct boundary
    headers: AUTH_HEADERS,
    body: form,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "(unreadable body)");
    throw new Error(`multipartFetch: HTTP ${res.status} ${res.statusText} — ${body}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  if (json.data === undefined) {
    throw new Error(
      `multipartFetch: no data field in GraphQL response — ${JSON.stringify(json)}`,
    );
  }
  return json.data as T;
}

export default graphQLClient;
