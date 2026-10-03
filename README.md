# SS Training — Finishing Upgrade v3

This package preserves the existing SS Training premium design and upgrades the learning/assessment engine.

## What changed
- All 10 courses retain their existing titles/prices and now use deeper professional reasoning content.
- Every module knowledge check has 4 plausible options.
- Written professional evidence requires 120+ words and blocks paste.
- Final assessment draws 15 questions from a 20-question bank, randomises questions and answers, requires 80%, and removes course navigation while active.
- Assessment integrity logs copy/cut/paste/right-click and focus/tab events.
- Public course pages are payment-gated: unpaid visitors see **Enrol now — £price**, not Open Course.
- No live payment is faked. Production purchase unlocking must come from a server-confirmed Stripe payment tied to the learner's Appwrite account.
- `?preview=1` enables admin preview mode so you can test/unlock courses before Stripe is connected.
- Video slots remain ready for approved SS Training videos.
- AI remains a secure server-side connection point; no AI secret is placed in GitHub.

## GitHub upload
Replace the matching files/folders in the repository with this package. Make sure `course-content/`, `learning-data.js`, `app.js`, `styles.css`, `courses.json`, and `index.html` are all present.

## Test checklist
1. Open a course while NOT using preview mode: it should show **Enrol now** and should not open learning.
2. Add `?preview=1` to the site URL, open a course and use the preview unlock button.
3. Complete a module: four options should appear and the reflection should require 120+ words.
4. On the last module, start the final assessment. Course navigation should disappear.
5. Try paste/right-click and change browser tab; the assessment should log integrity events.
6. Submit all 15 questions and verify the score.
7. Confirm the premium visual design remains unchanged.

## Production connections still required
- Appwrite real authentication and per-user course entitlement/progress storage.
- Stripe Checkout + server-side webhook/Appwrite Function to grant entitlements after confirmed payment.
- Approved SS Training video URLs/files.
- Server-side AI tutor/marker.
- Production certificate record and verification.

Do not place Stripe secret keys, AI API keys or Appwrite server API keys in this public GitHub repository.
