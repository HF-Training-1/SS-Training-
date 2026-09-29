# SS Training — Master Architecture

## Three connected portals
1. Public Academy — course catalogue, course pages, pricing, enquiries, future checkout.
2. Learner VLE — learner portfolio, assessments, evidence, theory, attendance, reviews, OTJ learning and progress.
3. Company/Admin/IQA — organisation, centres/shops, users, course builder, qualification builder, assessment templates, IQA sampling, reports and audit logs.

All three should use the same backend/API and database. Do not duplicate data between portals.

## Backend target: Appwrite
Use Appwrite for Authentication, Databases, Storage, Functions and Permissions. Keep provider access behind a service/repository layer so another backend can be swapped in later.

## AI integration
Never expose provider API keys in the public GitHub build. AI calls should go through a server-side Appwrite Function or another secure API gateway. AI can assist with lesson plans, question generation, feedback drafting, resource tagging and progress summaries. Assessment decisions remain human-controlled.

## Core data model
Organisation -> Centres/Shops -> Users -> Enrolments -> Qualifications -> Units -> Learning Outcomes -> Criteria -> Assessments -> Evidence -> Assessment Decisions -> IQA Decisions.

Also: Courses -> Course Units -> Lessons -> Media -> Quizzes -> Attempts -> Completion.

## Configurability
Courses, prices, hours, descriptions, units, lesson content, quiz questions, media, assessment templates, review templates and qualification mappings must be database/content records, not hard-coded UI.

## Roles
Company Admin, Centre Admin, Tutor, Assessor, IQA, Learner, Employer/Shop Supervisor.

## Security requirements
- Role-based permissions.
- Centre/shop scoping.
- Immutable audit history for assessment/IQA decisions.
- File access via authenticated permissions, not public buckets.
- Explicit learner consent/retention controls where required.
- Backups and export capability.
