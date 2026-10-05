import { Client, Databases, ID } from 'node-appwrite';

const clean = (v, max = 2000) =>
  String(v ?? '').trim().slice(0, max);

export default async ({ req, res, log, error }) => {
  try {
    // Read the information sent from the SS Training website
    const payload =
      req.bodyJson ||
      JSON.parse(req.body || '{}');

    // Only allow enquiry creation
    if (payload.action !== 'create') {
      return res.json(
        {
          ok: false,
          error: 'Unsupported action'
        },
        400
      );
    }

    const enquiry = payload.enquiry || {};

    // Clean and validate the enquiry information
    const name = clean(enquiry.name, 120);
    const email = clean(enquiry.email, 180).toLowerCase();
    const question = clean(enquiry.question, 4000);

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailIsValid || question.length < 3) {
      return res.json(
        {
          ok: false,
          error: 'Invalid enquiry'
        },
        400
      );
    }

    // Connect securely to Appwrite
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key']);

    const db = new Databases(client);

    // Save the enquiry
    const doc = await db.createDocument(
      process.env.SS_DATABASE_ID,
      process.env.SS_ENQUIRIES_COLLECTION_ID,
      ID.unique(),
      {
        name: name,
        email: email,
        question: question,
        status: 'new',
        source: 'course-assistant',
        courseInterest: JSON.stringify(
          enquiry.courseInterest || []
        )
      }
    );

    // Tell the website the enquiry was saved successfully
    return res.json({
      ok: true,
      id: doc.$id
    });

  } catch (err) {
    error(String(err));

    return res.json(
      {
        ok: false,
        error: 'Unable to save enquiry'
      },
      500
    );
  }
};
