import { Client, Databases, ID } from 'node-appwrite';

const clean = (value, max = 2000) => {
  return String(value ?? '').trim().slice(0, max);
};

export default async ({ req, res, log, error }) => {
  try {
    log('SS Training enquiry function started');

    // -----------------------------------------
    // 1. Read request
    // -----------------------------------------
    let payload = {};

    try {
      if (req.bodyJson) {
        payload = req.bodyJson;
      } else if (req.body) {
        payload =
          typeof req.body === 'string'
            ? JSON.parse(req.body)
            : req.body;
      }
    } catch (parseError) {
      error(`Body parsing failed: ${parseError.message}`);

      return res.json(
        {
          ok: false,
          error: 'Invalid request data'
        },
        400
      );
    }

    // -----------------------------------------
    // 2. Check action
    // -----------------------------------------
    if (payload.action !== 'create') {
      return res.json(
        {
          ok: false,
          error: 'Unsupported action'
        },
        400
      );
    }

    // -----------------------------------------
    // 3. Validate enquiry
    // -----------------------------------------
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

    // -----------------------------------------
    // 4. Check Appwrite configuration
    // -----------------------------------------
    const endpoint =
      process.env.APPWRITE_FUNCTION_API_ENDPOINT;

    const projectId =
      process.env.APPWRITE_FUNCTION_PROJECT_ID;

    const databaseId =
      process.env.SS_DATABASE_ID;

    const collectionId =
      process.env.SS_ENQUIRIES_COLLECTION_ID;

    const apiKey =
      req.headers?.['x-appwrite-key'];

    log(`Endpoint available: ${Boolean(endpoint)}`);
    log(`Project ID available: ${Boolean(projectId)}`);
    log(`Database ID available: ${Boolean(databaseId)}`);
    log(`Collection ID available: ${Boolean(collectionId)}`);
    log(`Runtime API key available: ${Boolean(apiKey)}`);

    if (
      !endpoint ||
      !projectId ||
      !databaseId ||
      !collectionId ||
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

    // -----------------------------------------
    // 5. Create secure Appwrite client
    // -----------------------------------------
    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    const databases = new Databases(client);

    // -----------------------------------------
    // 6. Prepare database information
    // -----------------------------------------
    const data = {
      name,
      email,
      question,
      status: 'new',
      source: 'course-assistant',
      courseInterest: JSON.stringify(
        enquiry.courseInterest || []
      )
    };

    log('Attempting to save enquiry to Appwrite...');

    // -----------------------------------------
    // 7. Save enquiry
    // -----------------------------------------
    const document = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      data
    );

    log(`Enquiry saved successfully: ${document.$id}`);

    // -----------------------------------------
    // 8. Success
    // -----------------------------------------
    return res.json(
      {
        ok: true,
        id: document.$id,
        message: 'Enquiry received successfully.'
      },
      200
    );

  } catch (err) {
    // Give Appwrite useful diagnostic information
    error(`SS Training enquiry error: ${err?.message || String(err)}`);

    if (err?.code) {
      error(`Appwrite error code: ${err.code}`);
    }

    if (err?.type) {
      error(`Appwrite error type: ${err.type}`);
    }

    if (err?.response) {
      error(`Appwrite response: ${JSON.stringify(err.response)}`);
    }

    if (err?.cause) {
      error(`Underlying cause: ${String(err.cause)}`);
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
