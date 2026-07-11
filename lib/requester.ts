import { GraphQLClient } from "graphql-request";
import FormData from "form-data";

// Polyfill fetch for Node.js < 18
if (typeof globalThis.fetch === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodeFetch = require("node-fetch");
  globalThis.fetch = nodeFetch.default ?? nodeFetch;
}

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

async function toBuffer(
  file: File | Blob | Buffer,
  filename?: string,
): Promise<{ buf: Buffer; name: string }> {
  if (file instanceof Buffer) {
    return { buf: file, name: filename || "file" };
  }
  // File extends Blob, so this covers both
  const arr = await (file as Blob).arrayBuffer();
  return {
    buf: Buffer.from(arr),
    name: filename || (typeof File !== "undefined" && file instanceof File ? (file as File).name : "file"),
  };
}

export async function multipartFetch<T = any>(
  document: string,
  variables: Record<string, any>,
  files: {
    variablePath: string;
    file: File | Blob | Buffer;
    filename?: string;
  }[],
): Promise<T> {
  const vars =
    typeof structuredClone === "function"
      ? structuredClone(variables)
      : JSON.parse(JSON.stringify(variables));

  // Null out file slots per GraphQL multipart spec
  for (const { variablePath } of files) {
    const parts = variablePath.replace(/^variables\./, "").split(".");
    let node: any = vars;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!node[parts[i]]) node[parts[i]] = {};
      node = node[parts[i]];
    }
    node[parts[parts.length - 1]] = null;
  }

  // Build map: { "0": ["variables.files.0"], ... }
  const map: Record<string, string[]> = {};
  files.forEach(({ variablePath }, i) => {
    map[String(i)] = [variablePath];
  });

  const form = new FormData();
  form.append(
    "operations",
    JSON.stringify({ query: document, variables: vars }),
  );
  form.append("map", JSON.stringify(map));

  for (let i = 0; i < files.length; i++) {
    const { file, filename } = files[i];
    const { buf, name } = await toBuffer(file, filename);
    form.append(String(i), buf, { filename: name });
  }

  const headers = {
    ...AUTH_HEADERS,
    ...form.getHeaders(), // correct Content-Type + boundary
  };

  const res = await fetch(GQL_ENDPOINT, {
    method: "POST",
    headers,
    body: form.getBuffer(), // exact bytes, deterministic Content-Length
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "(unreadable body)");
    throw new Error(
      `multipartFetch: HTTP ${res.status} ${res.statusText} — ${body}`,
    );
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
