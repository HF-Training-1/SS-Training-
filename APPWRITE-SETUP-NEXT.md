# SS Training — secure backend next setup

This build prepares the website for central enquiry storage without exposing an API key in GitHub.

## 1. Appwrite database
Create one database for SS Training and an `enquiries` collection with these string fields:
- `name` 120
- `email` 180
- `question` 4000
- `status` 30
- `source` 60
- `courseInterest` 500
- `createdAt` 40

Do **not** give the public website direct create/read/update permissions on this collection. The Appwrite Function writes to it server-side.

## 2. Deploy the enquiry function
Deploy `appwrite-functions/enquiry-api` as a Node function. Give the function permission to execute for visitors, but keep database access server-side. Add these function variables:
- `SS_DATABASE_ID`
- `SS_ENQUIRIES_COLLECTION_ID`

Appwrite supplies the function endpoint/project context and dynamic function key at runtime.

## 3. Connect the public website
Open `appwrite-config.js` and fill in only:
- `projectId`
- `enquiryFunctionId`

The endpoint is already set to the Frankfurt Appwrite Cloud endpoint used by this project. These IDs are public connection identifiers; never add an API key, payment secret, or AI secret to GitHub.

## 4. Admin enquiries
The current Admin > Enquiries screen proves the workflow locally. The production version should list/update the central Appwrite collection only after real Appwrite admin authentication is connected. Do not treat browser localStorage as the final admin database.

## 5. Course entitlements before payments
Before Stripe/payment goes live, move `entitlements`, learner identity, progress and certificate records from localStorage into Appwrite. The server-side entitlement record should be the authority for which individual course a learner owns. A completed course remains available for review and certificate access; every other course remains locked until separately purchased/assigned.

## 6. Browser Back button
This build now writes page navigation into browser history. Chrome/Safari/phone Back can return through SS Training pages instead of requiring only the on-screen Back buttons.
