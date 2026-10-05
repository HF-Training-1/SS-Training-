import { Client, TablesDB, ID } from 'node-appwrite';

const clean = (value, max = 2000) =>
  String(value ?? '').trim().slice(0, max);

export default async ({ req, res, log, error }) => {
  try {
    log('SS Training enquiry function started');

    // 1. Read JSON sent from website
    let payload = {};

    try {
      payload = req.bodyJson || {};

      if (!payload || typeof payload !== 'object') {
        payload = {};
      }
    } catch (err) {
      error(`Body parsing failed: ${err.message}`);

      return res.json(
        {
          ok: false,
          error: 'Invalid request data'
        },
        400
      );
    }

    // 2. Check request action
    if (payload.action !== 'create') {
      return res.json(
        {
          ok: false,
          error: 'Unsupported action'
        },
        400
      );
    }

    // 3. Clean and validate enquiry
    const enquiry = payload.enquiry || {};

    const name = clean(enquiry.name, 120);
    const email = clean(enquiry.email, 180).toLowerCase();
    const question = clean(enquiry.question, 4000);

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailIsValid || question.length < 3) {
      return res.json(
        {
          ok: false,
          error: 'Please enter a valid name, email and question.'
        },
        400
      );
    }

    // 4. Appwrite settings
    const endpoint =
      process.env.APPWRITE_FUNCTION_API_ENDPOINT;

    const projectId =
      process.env.APPWRITE_FUNCTION_PROJECT_ID;

    const databaseId =
      process.env.SS_DATABASE_ID;

    const tableId =
      process.env.SS_ENQUIRIES_COLLECTION_ID;

    const apiKey =
      req.headers?.['x-appwrite-key'];

    log(`Endpoint available: ${Boolean(endpoint)}`);
    log(`Project ID available: ${Boolean(projectId)}`);
    log(`Database ID available: ${Boolean(databaseId)}`);
    log(`Enquiries table ID available: ${Boolean(tableId)}`);
    log(`Runtime API key available: ${Boolean(apiKey)}`);

    if (
      !endpoint ||
      !projectId ||
      !databaseId ||
      !tableId ||
      !apiKey
    ) {
      error('One or more required Appwrite values are missing.');

      return res.json(
        {
          ok: false,
          error: 'Server configuration is incomplete.'
        },
        500
      );
    }

    // 5. Secure Appwrite server connection
    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    const tablesDB = new TablesDB(client);

    // 6. Data matching your Enquiries table
    const data = {
      name,
      email,
      question,
      status: 'new'
    };

    log('Attempting to create enquiry row...');

    // 7. Save enquiry
    const row = await tablesDB.createRow({
      databaseId,
      tableId,
      rowId: ID.unique(),
      data
    });

    log(`Enquiry saved successfully: ${row.$id}`);

    // 8. Success response
    return res.json(
      {
        ok: true,
        id: row.$id,
        message: 'Enquiry received successfully.'
      },
      200
    );

  } catch (err) {
    error(
      `SS Training enquiry error: ${
        err?.message || String(err)
      }`
    );

    if (err?.code) {
      error(`Appwrite error code: ${err.code}`);
    }

    if (err?.type) {
      error(`Appwrite error type: ${err.type}`);
    }

    if (err?.response) {
      error(
        `Appwrite response: ${JSON.stringify(err.response)}`
      );
    }

    if (err?.cause) {
      error(
        `Underlying cause: ${
          err.cause?.message || String(err.cause)
        }`
      );
    }

    return res.json(
      {
        ok: false,
        error: 'Unable to save enquiry at the moment.'
      },
      500
    );
  }
};
