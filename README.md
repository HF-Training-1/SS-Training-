# SS Training — Course Engine Upgrade (October 2026)

Upload the contents of this folder to the root of the existing GitHub Pages repository, replacing the matching files.

## What is live in this build
- Existing premium SS Training design retained.
- All 10 course cards open a structured 9-stage course pathway.
- Every stage is clickable and can be revisited.
- Knowledge checks work and must be passed before a stage can be completed.
- Reflections save in the browser and are shown in the learner portfolio.
- Progress is calculated from real completed stages (no hard-coded 42%).
- Final assessment contains 10 questions and requires 80% to pass.
- Course feedback is collected before certificate unlock.
- Certificates unlock only when the course stages, assessment and feedback requirements are complete.
- Dashboard Assessments, Tutor Support, Certificates and Portfolio buttons now work.
- Tutor requests save locally ready for the live backend connection.
- Video positions exist in every learning stage. Add approved video embed URLs to `learning-data.js` in the `video` fields.

## Important before public paid launch
This is a functional GitHub Pages course engine, but GitHub Pages is front-end hosting. Browser localStorage is not a secure learner database and will not follow a learner between devices. The next production step is to connect Appwrite Authentication + Database/Storage so accounts, progress, assessment evidence, support messages and certificates are stored server-side.

The AI Course Assistant is intentionally not given a secret API key in browser code. A live AI assistant needs a secure Appwrite Function/server endpoint so the key cannot be stolen from GitHub. The UI connection point remains in place.

## Course-hour wording
The courses are presented as 10 CPD-hour programmes. The engine records completion evidence rather than pretending that a learner spent a fixed number of hours on a page. Do not hard-code fake elapsed learning time. Your CPD policy/certificate wording should reflect how SS Training validates the advertised learning hours.
