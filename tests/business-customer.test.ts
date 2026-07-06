// This software and its associated documentation are the exclusive property of Coincord.
// It is provided to authorized Coincord partners and clients under the terms of the Coincord Software License.
// Unauthorized use, copying, distribution, or modification of this software is strictly prohibited.
// © Coincord 2024. All rights reserved.

// ─── Mock requester before any imports that trigger it ───────────────────────

const mockGraphqlRequest = jest.fn();
const mockMultipartFetch = jest.fn();

jest.mock("../lib/requester", () => ({
  __esModule: true,
  default: { request: mockGraphqlRequest },
  multipartFetch: mockMultipartFetch,
}));

// ─── Imports ─────────────────────────────────────────────────────────────────

import CoincordCoreWallet from "../lib";
import type { BusinessCustomerInput } from "../lib";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const BASE_BUSINESS_DATA: Omit<BusinessCustomerInput, "documents"> = {
  business_name: "Acme Ltd",
  business_bvn: "22222222226",
  industry: "TECHNOLOGY",
  registration_type: "LLC",
  country: "NG",
  date_of_registration: "2010-06-01",
  description: "A test business",
  rc_tin: "RC123456",
  addressCountry: "NG",
  addressState: "Lagos",
  addressLine: "36 Araromi Street",
  addressCity: "Yaba",
  addressPostal: "100001",
  phone: "07012345678",
  contact: {
    phoneNumber: "07012345678",
    emailGeneral: "acme@example.com",
  },
  officers: [],
};

const MOCK_RESULT = {
  id: "bc-1",
  business_name: "Acme Ltd",
  anchor_reference_id: "anchor-cst-123",
  created_at: "2026-01-01T00:00:00.000Z",
};

function makeBlob(content = "mock file content"): Blob {
  // Buffer is used here as a Blob stand-in since Blob is not available in
  // older Node.js versions. multipartFetch is mocked so the value is never
  // processed — we only need reference equality in assertions.
  return Buffer.from(content) as unknown as Blob;
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe("CoincordCoreWallet — createBusinessCustomer", () => {
  let sdk: CoincordCoreWallet;

  beforeEach(() => {
    jest.clearAllMocks();
    sdk = new CoincordCoreWallet();
  });

  it("uses graphqlClient.request (JSON) when no documents are provided", async () => {
    mockGraphqlRequest.mockResolvedValue({
      createBusinessCustomer: MOCK_RESULT,
    });

    const result = await sdk.createBusinessCustomer({ ...BASE_BUSINESS_DATA });

    expect(mockGraphqlRequest).toHaveBeenCalledTimes(1);
    expect(mockMultipartFetch).not.toHaveBeenCalled();

    // documents and files should be null in the JSON call
    const [, variables] = mockGraphqlRequest.mock.calls[0];
    expect(variables.documents).toBeNull();
    expect(variables.files).toBeNull();
    expect(variables.business_data).not.toHaveProperty("documents");

    expect(result).toEqual(MOCK_RESULT);
  });

  it("uses multipartFetch when documents with files are provided", async () => {
    mockMultipartFetch.mockResolvedValue({
      createBusinessCustomer: MOCK_RESULT,
    });

    const file0 = makeBlob("cert content");
    const file1 = makeBlob("cac3 content");

    const result = await sdk.createBusinessCustomer({
      ...BASE_BUSINESS_DATA,
      documents: [
        { type: "CERTIFICATE_OF_INCORPORATION", file: file0 },
        { type: "FORM_CAC_3", file: file1 },
      ],
    });

    expect(mockMultipartFetch).toHaveBeenCalledTimes(1);
    expect(mockGraphqlRequest).not.toHaveBeenCalled();

    const [, variables, files] = mockMultipartFetch.mock.calls[0];

    // business_data must NOT contain documents
    expect(variables.business_data).not.toHaveProperty("documents");

    // documents arg carries only the type
    expect(variables.documents).toEqual([
      { type: "CERTIFICATE_OF_INCORPORATION" },
      { type: "FORM_CAC_3" },
    ]);

    // files entries are index-matched to documents
    expect(files).toHaveLength(2);
    expect(files[0]).toEqual({ variablePath: "variables.files.0", file: file0 });
    expect(files[1]).toEqual({ variablePath: "variables.files.1", file: file1 });

    expect(result).toEqual(MOCK_RESULT);
  });

  it("uses graphqlClient.request when documents array is empty", async () => {
    mockGraphqlRequest.mockResolvedValue({
      createBusinessCustomer: MOCK_RESULT,
    });

    await sdk.createBusinessCustomer({ ...BASE_BUSINESS_DATA, documents: [] });

    expect(mockGraphqlRequest).toHaveBeenCalledTimes(1);
    expect(mockMultipartFetch).not.toHaveBeenCalled();
  });
});

describe("CoincordCoreWallet — resubmitBusinessCustomerDocument", () => {
  let sdk: CoincordCoreWallet;

  beforeEach(() => {
    jest.clearAllMocks();
    sdk = new CoincordCoreWallet();
  });

  it("always uses multipartFetch with the correct variable path", async () => {
    mockMultipartFetch.mockResolvedValue({
      resubmitBusinessCustomerDocument: true,
    });

    const file = makeBlob("replacement doc");

    const result = await sdk.resubmitBusinessCustomerDocument({
      business_customer_id: "bc-1",
      type: "CERTIFICATE_OF_INCORPORATION",
      file,
    });

    expect(mockMultipartFetch).toHaveBeenCalledTimes(1);
    expect(mockGraphqlRequest).not.toHaveBeenCalled();

    const [, variables, files] = mockMultipartFetch.mock.calls[0];

    // file slot must be null in variables (per multipart spec)
    expect(variables.file).toBeNull();
    expect(variables.business_customer_id).toBe("bc-1");
    expect(variables.type).toBe("CERTIFICATE_OF_INCORPORATION");

    // single file entry at the correct path
    expect(files).toHaveLength(1);
    expect(files[0]).toEqual({ variablePath: "variables.file", file });

    expect(result).toBe(true);
  });
});
