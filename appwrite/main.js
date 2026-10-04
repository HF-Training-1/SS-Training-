import { Client, Databases, ID } from 'node-appwrite';

const clean = (v, max=2000) => String(v ?? '').trim().slice(0,max);
export default async ({ req, res, log, error }) => {
  try {
    const payload = req.bodyJson || JSON.parse(req.body || '{}');
    if (payload.action !== 'create') return res.json({ok:false,error:'Unsupported action'},400);
    const e = payload.enquiry || {};
    const name=clean(e.name,120), email=clean(e.email,180).toLowerCase(), question=clean(e.question,4000);
    if(!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || question.length<3) return res.json({ok:false,error:'Invalid enquiry'},400);

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key']);
    const db = new Databases(client);
    const doc = await db.createDocument(
      process.env.SS_DATABASE_ID,
      process.env.SS_ENQUIRIES_COLLECTION_ID,
      ID.unique(),
      {name,email,question,status:'new',source:'course-assistant',courseInterest:JSON.stringify(e.courseInterest||[]),createdAt:new Date().toISOString()}
    );
    return res.json({ok:true,id:doc.$id});
  } catch (err) {
    error(String(err));
    return res.json({ok:false,error:'Unable to save enquiry'},500);
  }
};
