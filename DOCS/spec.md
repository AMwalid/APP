# 

# \# IBNI --- Product Specification

# 

# \*\*Tagline:\*\* Crafting the Leaders of Tomorrow. Today.\\

# \*\*Name meaning:\*\* "IBNI" is an Arabic word meaning "Build," reflecting

# the mission to build future-ready learners through smart, connected

# education.

# 

# > \*\*Document basis:\*\* This specification is structured from the supplied

# > \*IBNI -- Comprehensive Startup Documentation\*. It preserves the

# > product scope and intent described there. Items not defined in that

# > source are marked \*\*TBD\*\* rather than assumed.

# 

# \## 1. Product Overview

# 

# IBNI is an all-in-one, localized educational platform for Algeria, with

# planned expansion into the wider MENA region. It connects four primary

# stakeholder groups---parents, students, teachers, and educational

# institutions---through shared educational workflows and an integrated

# educational marketplace.

# 

# The platform is intended to address: - Fragmented and largely analog

# education administration and communication. - Limited parent visibility

# into students' academic progress and school life. - Teacher workload

# caused by manual grading, attendance, reporting, and communication. -

# Institutions' limited digital presence and operational tools. -

# Students' need for personalized, engaging learning and centralized

# access to resources.

# 

# \### 1.1 Product Goals

# 

# 1\.  Give parents timely visibility into each child's attendance,

# &#x20;   behavior, performance, and school communications.

# 2\.  Reduce teachers' administrative workload and improve student/class

# &#x20;   management.

# 3\.  Give institutions digital profiles and centralized operational

# &#x20;   dashboards.

# 4\.  Improve student engagement through personalized learning tools and

# &#x20;   gamification.

# 5\.  Provide a trusted marketplace for educational products and services.

# 6\.  Deliver a mobile-first, multilingual experience adapted to Algerian

# &#x20;   curricula, payment practices, connectivity, and data-protection

# &#x20;   requirements.

# 7\.  Establish a scalable foundation for expansion into Tunisia, Egypt,

# &#x20;   Morocco, and other MENA markets.

# 

# \### 1.2 User Roles

# 

# \-   Parent

# \-   Student

# \-   Teacher

# \-   Institution administrator / representative

# \-   Marketplace seller (teacher, institution, or third-party vendor)

# \-   Platform administrator (\*\*operational role implied by platform

# &#x20;   needs; detailed permissions TBD\*\*)

# 

# \## 2. Functional Requirements

# 

# \### 2.1 Parent Experience

# 

# &#x20; -----------------------------------------------------------------------

# &#x20; ID                      Requirement             Description

# &#x20; ----------------------- ----------------------- -----------------------

# &#x20; PAR-01                  Parent dashboard        Present each child's

# &#x20;                                                 attendance, behavior,

# &#x20;                                                 academic performance,

# &#x20;                                                 and school

# &#x20;                                                 communications in one

# &#x20;                                                 view.

# 

# &#x20; PAR-02                  Notifications           Send alerts for low

# &#x20;                                                 grades, behavior flags,

# &#x20;                                                 and schedule changes.

# 

# &#x20; PAR-03                  Child profiles          Maintain a profile for

# &#x20;                                                 each child, including

# &#x20;                                                 academic history,

# &#x20;                                                 strengths, weaknesses,

# &#x20;                                                 and achievements.

# 

# &#x20; PAR-04                  School discovery        Allow parents to

# &#x20;                                                 discover schools using

# &#x20;                                                 verified institution

# &#x20;                                                 profiles.

# 

# &#x20; PAR-05                  Teacher discovery       Allow parents to

# &#x20;                                                 discover teachers

# &#x20;                                                 through verified,

# &#x20;                                                 CV-style profiles.

# 

# &#x20; PAR-06                  Direct communication    Support secure

# &#x20;                                                 communication between

# &#x20;                                                 parents and teachers or

# &#x20;                                                 school staff.

# 

# &#x20; PAR-07                  Marketplace purchases   Allow parents to buy

# &#x20;                                                 educational materials

# &#x20;                                                 and services through

# &#x20;                                                 the IBNI Store.

# 

# &#x20; PAR-08                  Service registration    Support registration

# &#x20;                         and tuition             for services and

# &#x20;                                                 tuition payments

# &#x20;                                                 through locally

# &#x20;                                                 appropriate payment

# &#x20;                                                 methods.

# 

# &#x20; PAR-09                  Premium parent features Provide advanced

# &#x20;                                                 performance analytics,

# &#x20;                                                 personalized learning

# &#x20;                                                 recommendations,

# &#x20;                                                 extended communication

# &#x20;                                                 logs, and priority

# &#x20;                                                 support through paid

# &#x20;                                                 tiers.

# &#x20; -----------------------------------------------------------------------

# 

# \### 2.2 Student Experience

# 

# &#x20; -----------------------------------------------------------------------

# &#x20; ID                      Requirement             Description

# &#x20; ----------------------- ----------------------- -----------------------

# &#x20; STU-01                  Student dashboard       Show assignments,

# &#x20;                                                 deadlines,

# &#x20;                                                 achievements, and

# &#x20;                                                 recommended next

# &#x20;                                                 learning steps.

# 

# &#x20; STU-02                  Gamification            Award badges, unlock

# &#x20;                                                 avatars, and provide

# &#x20;                                                 store discounts or

# &#x20;                                                 rewards for academic

# &#x20;                                                 progress.

# 

# &#x20; STU-03                  Learning profile        Show learning progress,

# &#x20;                                                 reading history,

# &#x20;                                                 preferred subjects, and

# &#x20;                                                 personal goals.

# 

# &#x20; STU-04                  Personalized            Use AI-driven

# &#x20;                         recommendations         recommendations for

# &#x20;                                                 localized content and

# &#x20;                                                 practice materials.

# 

# &#x20; STU-05                  Learning resources      Provide access to

# &#x20;                                                 notes, practice tests,

# &#x20;                                                 and recommended

# &#x20;                                                 learning materials.

# 

# &#x20; STU-06                  Offline learning access Support offline access

# &#x20;                                                 to selected content,

# &#x20;                                                 including downloaded

# &#x20;                                                 notes and practice

# &#x20;                                                 tests, where feasible.

# 

# &#x20; STU-07                  Career and learning     \*\*Coming Soon:\*\*

# &#x20;                         paths                   Suggest what students

# &#x20;                                                 should study next based

# &#x20;                                                 on performance,

# &#x20;                                                 national educational

# &#x20;                                                 objectives, and career

# &#x20;                                                 opportunities.

# &#x20; -----------------------------------------------------------------------

# 

# \### 2.3 Teacher Experience

# 

# &#x20; -----------------------------------------------------------------------

# &#x20; ID                      Requirement             Description

# &#x20; ----------------------- ----------------------- -----------------------

# &#x20; TCH-01                  Teacher profile         Provide a CV-style

# &#x20;                                                 profile containing

# &#x20;                                                 teaching experience,

# &#x20;                                                 specializations,

# &#x20;                                                 certifications, and

# &#x20;                                                 reviews.

# 

# &#x20; TCH-02                  Class management        Allow teachers to

# &#x20;                                                 manage classes and

# &#x20;                                                 associated student

# &#x20;                                                 data.

# 

# &#x20; TCH-03                  Student records         Track attendance,

# &#x20;                                                 grades, and behavior

# &#x20;                                                 for individual

# &#x20;                                                 students.

# 

# &#x20; TCH-04                  Reports and analytics   Generate custom reports

# &#x20;                                                 for an individual

# &#x20;                                                 student or a class to

# &#x20;                                                 help identify learning

# &#x20;                                                 gaps.

# 

# &#x20; TCH-05                  Parent communication    Allow teachers to

# &#x20;                                                 securely share updates,

# &#x20;                                                 notes, and concerns

# &#x20;                                                 with parents.

# 

# &#x20; TCH-06                  Grade calculation       Provide automatic grade

# &#x20;                                                 calculation tools.

# 

# &#x20; TCH-07                  Test generation         Provide test-generation

# &#x20;                                                 tools.

# 

# &#x20; TCH-08                  Lesson scheduling       Provide lesson

# &#x20;                                                 scheduling tools.

# 

# &#x20; TCH-09                  Free teacher account    Offer teachers a fully

# &#x20;                                                 functional free account

# &#x20;                                                 for managing classes

# &#x20;                                                 and students; premium

# &#x20;                                                 capabilities may be

# &#x20;                                                 offered through

# &#x20;                                                 institutional

# &#x20;                                                 subscriptions or

# &#x20;                                                 individual upgrades.

# &#x20; -----------------------------------------------------------------------

# 

# \### 2.4 Institution Experience

# 

# The institution audience includes schools, centers, nurseries, tutoring

# academies, and tutors.

# 

# &#x20; -----------------------------------------------------------------------

# &#x20; ID                      Requirement             Description

# &#x20; ----------------------- ----------------------- -----------------------

# &#x20; INS-01                  Institution profile     Provide a digital

# &#x20;                                                 profile with photos,

# &#x20;                                                 achievements, programs,

# &#x20;                                                 and contact

# &#x20;                                                 information.

# 

# &#x20; INS-02                  Institution             Support verified

# &#x20;                         verification            institution profiles.

# &#x20;                                                 Verification process

# &#x20;                                                 and criteria are TBD.

# 

# &#x20; INS-03                  Search and discovery    Make institutions

# &#x20;                                                 discoverable by

# &#x20;                                                 location, type,

# &#x20;                                                 specialization, and

# &#x20;                                                 language.

# 

# &#x20; INS-04                  Admin dashboard         Allow authorized

# &#x20;                                                 institution users to

# &#x20;                                                 monitor teachers,

# &#x20;                                                 students, and parents.

# 

# &#x20; INS-05                  Administration          Support management of

# &#x20;                                                 announcements, tuition,

# &#x20;                                                 and performance.

# 

# &#x20; INS-06                  Analytics               Provide data and

# &#x20;                                                 insights to track

# &#x20;                                                 engagement,

# &#x20;                                                 enrollments, and

# &#x20;                                                 operational

# &#x20;                                                 performance.

# 

# &#x20; INS-07                  Enrollment              Allow institutions to

# &#x20;                                                 accept applications

# &#x20;                                                 through the platform.

# 

# &#x20; INS-08                  Service offers          Allow institutions to

# &#x20;                                                 offer services such as

# &#x20;                                                 transportation, meals,

# &#x20;                                                 and tutoring through

# &#x20;                                                 the store.

# 

# &#x20; INS-09                  Subscription tiers      Offer institution plans

# &#x20;                                                 with enhanced

# &#x20;                                                 dashboards, analytics,

# &#x20;                                                 storage, white-label

# &#x20;                                                 branding, and technical

# &#x20;                                                 support.

# 

# &#x20; INS-10                  Premium add-ons         Support optional

# &#x20;                                                 advanced API

# &#x20;                                                 integrations, custom

# &#x20;                                                 reporting, enhanced

# &#x20;                                                 security protocols, and

# &#x20;                                                 dedicated account

# &#x20;                                                 management.

# &#x20; -----------------------------------------------------------------------

# 

# \### 2.5 Educational Store / Marketplace

# 

# The IBNI Store is integrated across the platform's user experiences.

# 

# &#x20; -----------------------------------------------------------------------

# &#x20; ID                      Requirement             Description

# &#x20; ----------------------- ----------------------- -----------------------

# &#x20; MKT-01                  Product and service     Support courses,

# &#x20;                         listings                tutoring, educational

# &#x20;                                                 tools, school supplies,

# &#x20;                                                 books, and other

# &#x20;                                                 educational services.

# 

# &#x20; MKT-02                  Seller offers           Allow teachers and

# &#x20;                                                 institutions to publish

# &#x20;                                                 offers such as private

# &#x20;                                                 sessions and summer

# &#x20;                                                 camps.

# 

# &#x20; MKT-03                  Third-party sellers     Support relevant

# &#x20;                                                 third-party educational

# &#x20;                                                 vendors.

# 

# &#x20; MKT-04                  Personalized            Recommend listings

# &#x20;                         suggestions             based on user role,

# &#x20;                                                 location, and needs.

# 

# &#x20; MKT-05                  Quality control         Provide a vetting

# &#x20;                                                 process for marketplace

# &#x20;                                                 products and services.

# &#x20;                                                 Detailed review rules

# &#x20;                                                 are TBD.

# 

# &#x20; MKT-06                  Payments                Support secure payments

# &#x20;                                                 using methods suited to

# &#x20;                                                 the Algerian market.

# 

# &#x20; MKT-07                  Receipts                Provide transaction

# &#x20;                                                 receipt tracking.

# 

# &#x20; MKT-08                  Commission model        Support a configurable

# &#x20;                                                 marketplace commission.

# &#x20;                                                 The source proposes

# &#x20;                                                 5--15%; the final rate

# &#x20;                                                 is TBD.

# 

# &#x20; MKT-09                  Advertising             Support designated,

# &#x20;                                                 non-intrusive

# &#x20;                                                 advertising placements

# &#x20;                                                 for vetted educational

# &#x20;                                                 partners.

# &#x20; -----------------------------------------------------------------------

# 

# \## 3. Communication and Notifications

# 

# \-   Support secure parent--teacher and parent--institution

# &#x20;   communication.

# \-   Support school and institution updates.

# \-   Notify parents about low grades, behavior flags, and schedule

# &#x20;   changes.

# \-   Allow teachers to send updates, notes, and concerns to parents.

# \-   Provide limited communication in the free tier and extended

# &#x20;   communication logs in premium parent tiers.

# \-   Notification channels, delivery guarantees, read receipts,

# &#x20;   attachments, moderation, and retention rules are \*\*TBD\*\*.

# 

# \## 4. Search, Discovery, and Profiles

# 

# \### 4.1 Discovery Filters

# 

# Institution and teacher discovery should support relevant filters. The

# source explicitly identifies institution search by: - Location -

# Institution type - Specialization - Language

# 

# Teacher profiles should expose: - Teaching experience -

# Specializations - Certifications - Reviews

# 

# Institution profiles should expose: - Photos - Achievements - Programs -

# Contact information

# 

# Profile verification workflows, evidence requirements, review

# moderation, and profile visibility settings are \*\*TBD\*\*.

# 

# \## 5. Localization and Educational Content

# 

# \### 5.1 Languages

# 

# \-   Arabic

# \-   French

# \-   Potentially Tamazight

# 

# The language experience should cover UI/UX elements, notifications, and

# educational content.

# 

# \### 5.2 Curriculum

# 

# Learning tools, practice tests, and AI-recommended materials should

# align with the Algerian national curriculum for primary, middle, and

# secondary education.

# 

# \### 5.3 Cultural Relevance

# 

# Gamification, avatars, rewards, and educational content should be

# culturally appropriate for Algerian students and parents.

# 

# \### 5.4 Regional Expansion

# 

# After establishing the platform in Algeria, the documented expansion

# priorities are: 1. Tunisia 2. Egypt 3. Morocco

# 

# Localization, curriculum mapping, payment support, and legal

# requirements for each expansion market are \*\*TBD\*\*.

# 

# \## 6. Pricing and Monetization

# 

# The documented business model combines freemium access, subscriptions,

# marketplace commissions, premium institutional services, and vetted

# advertising.

# 

# \### 6.1 Free Access

# 

# \-   Parents and smaller institutions: basic student tracking, limited

# &#x20;   communication, and access to free marketplace resources.

# \-   Teachers: free account for class and student management.

# 

# \### 6.2 Parent Subscriptions

# 

# Paid tiers may include: - In-depth performance analytics - Personalized

# learning recommendations - Extended communication logs - Priority

# support

# 

# \### 6.3 Institution Subscriptions

# 

# Tiered plans may include: - Enhanced administrative dashboards -

# Comprehensive student and teacher analytics - Increased content

# storage - White-label branding - Dedicated technical support

# 

# \### 6.4 Marketplace Commissions

# 

# \-   Proposed commission range: 5--15% per transaction.

# \-   Final commission rates and seller fee rules are \*\*TBD\*\*.

# 

# \### 6.5 Premium Add-ons

# 

# Potential add-ons include: - Custom institution branding - Advanced API

# integrations - Custom reporting - Enhanced security protocols -

# Dedicated account management - Bespoke training programs

# 

# \### 6.6 Advertising

# 

# \-   Ads are intended for vetted educational partners.

# \-   Placements should be non-intrusive and contextually relevant.

# \-   Potential placements include the store and relevant parent/teacher

# &#x20;   dashboard areas.

# 

# Exact prices, billing cycles, taxes, refunds, cancellations, payout

# schedules, and ad approval policies are \*\*TBD\*\*.

# 

# \## 7. Payments

# 

# The platform should integrate secure, locally appropriate payment

# methods. The source specifically names: - Edahabia card - CIB card -

# Mobile money - Potential installment plans for higher-tier institutional

# subscriptions

# 

# Payment provider selection, payment flows, settlement, refunds,

# disputes, and reconciliation are \*\*TBD\*\*.

# 

# \## 8. Non-Functional Requirements

# 

# \### 8.1 Responsive and Mobile-First

# 

# \-   Provide a responsive experience across smartphones, tablets, and

# &#x20;   desktop browsers.

# \-   Prioritize mobile usability and touch-friendly interfaces.

# \-   Optimize data usage for varying internet speeds and data costs.

# 

# \### 8.2 Connectivity and Offline Use

# 

# \-   Design for varying network conditions.

# \-   Explore offline access to selected learning resources, including

# &#x20;   downloaded notes and practice tests.

# \-   Define synchronization behavior, conflict resolution, and offline

# &#x20;   feature boundaries during technical design.

# 

# \### 8.3 Security and Privacy

# 

# The source specifies: - Industry-standard encryption protocols. -

# Multi-factor authentication. - Regular security audits. - Secure

# handling of educational and personal data. - Data localization:

# sensitive user data is intended to be stored within Algeria. -

# Compliance with Algerian data protection law, identified in the source

# as Law No. 18-07.

# 

# Detailed security controls, encryption standards, access-control model,

# audit scope, incident response, retention, consent, and legal review are

# \*\*TBD\*\*. The legal and hosting requirements should be validated with

# qualified local counsel and providers before launch.

# 

# \### 8.4 Availability and Scalability

# 

# \-   Use cloud-native infrastructure.

# \-   Support high availability and reliability.

# \-   Scale as the user base grows in Algeria and across MENA.

# \-   Use a modular architecture that allows independent development,

# &#x20;   deployment, and scaling of platform capabilities.

# 

# Availability targets, performance budgets, recovery objectives, and

# capacity targets are \*\*TBD\*\*.

# 

# \### 8.5 Data Architecture

# 

# The source proposes scalable database technologies, including NoSQL

# databases, to manage user data, learning content, and transactional

# information. The final database selection and data model are \*\*TBD\*\*.

# 

# \## 9. Suggested Technical Architecture (as stated in the source)

# 

# The documentation describes the following architectural direction,

# without prescribing specific vendors or implementation technologies:

# 

# \-   \*\*Cloud-native infrastructure:\*\* Local cloud providers or regional

# &#x20;   data centers, subject to data-localization requirements.

# \-   \*\*Mobile-first responsive clients:\*\* Smartphone, tablet, and desktop

# &#x20;   support.

# \-   \*\*Modular microservices:\*\* Independent services for areas such as

# &#x20;   user management, learning analytics, e-commerce, and communication.

# \-   \*\*AI/ML capabilities:\*\* Personalized learning paths, content

# &#x20;   recommendations, predictive student-performance analytics, and

# &#x20;   automated insights for teachers and institutions.

# \-   \*\*Security layer:\*\* Encryption, multi-factor authentication, and

# &#x20;   regular security audits.

# \-   \*\*Scalable data storage:\*\* Modern database technologies suitable for

# &#x20;   user, learning, and transaction data.

# 

# Specific programming languages, frameworks, hosting vendors, service

# boundaries, API contracts, integrations, and deployment topology are

# \*\*TBD\*\*.

# 

# \## 10. Product Prioritization

# 

# The source recommends prioritizing core functionality first: 1.

# Real-time student tracking. 2. Direct communication. 3. Educational

# Store.

# 

# Subsequent development directions include: - AI-driven personalization

# and recommendations. - Predictive analytics. - Offline learning

# capabilities. - Expanded institution management and integrations. -

# Career and learning paths (identified as coming soon). - Regional

# localization and expansion.

# 

# This is a source-derived priority direction, not a fully defined release

# plan. Release milestones, MVP acceptance criteria, and delivery dates

# are \*\*TBD\*\*.

# 

# \## 11. User Experience Requirements

# 

# \-   Clean, intuitive, easy-to-navigate interfaces for all user roles.

# \-   Simple workflows that account for varying levels of digital

# &#x20;   literacy.

# \-   Guided tours and in-app tutorials.

# \-   Mobile-first layouts and touch-friendly controls.

# \-   Efficient data usage.

# \-   Multilingual interface and content.

# \-   Culturally relevant gamification and visual design.

# \-   Accessible learning resources where connectivity is inconsistent.

# 

# Detailed design system, accessibility standard, supported

# devices/browsers, and usability acceptance criteria are \*\*TBD\*\*.

# 

# \## 12. Distribution and Access Channels

# 

# The documented distribution plan includes: - Android and iOS app stores

# (Google Play Store and Apple App Store). - Responsive web platform

# accessible through major browsers. - Direct Android APK downloads from

# the IBNI website.

# 

# App-store release requirements, supported OS versions, APK

# signing/update process, and browser support matrix are \*\*TBD\*\*.

# 

# \## 13. Operational and Growth Considerations

# 

# The source identifies the following launch and growth activities: -

# Direct institutional sales and demonstrations. - Pilot programs or free

# trials with institutions. - Engagement with the Algerian Ministry of

# National Education for possible recognition or endorsement. -

# Partnerships with educational associations, teacher unions, technology

# providers, publishers, content creators, and local businesses. - School

# workshops and training. - Parent-association engagement. - Participation

# in educational fairs, technology expos, and community events. - Social

# media, SEO/SEM, content, email, influencer, media, PR, referral,

# testimonial, and webinar campaigns.

# 

# These are go-to-market activities rather than software requirements.

# Detailed owners, budgets, targets, and timelines are \*\*TBD\*\*.

# 

# \## 14. Acceptance Criteria --- High-Level

# 

# The following criteria translate the documented capabilities into

# high-level validation statements. They do not replace detailed test

# cases.

# 

# \-   A parent can view a child's attendance, behavior, performance, and

# &#x20;   school communications from a consolidated dashboard.

# \-   A parent can receive alerts for the documented academic, behavior,

# &#x20;   and schedule events.

# \-   A parent can access separate profiles for their children.

# \-   Parents can discover teachers and institutions through profile and

# &#x20;   search experiences.

# \-   Parents and teachers can communicate through a secure in-platform

# &#x20;   channel.

# \-   A student can view assignments, deadlines, achievements, and

# &#x20;   learning recommendations.

# \-   Student progress can trigger documented gamification rewards.

# \-   A teacher can manage classes, student records, attendance, grades,

# &#x20;   and behavior.

# \-   A teacher can generate student- or class-level reports.

# \-   An institution can maintain a public-facing profile and use an

# &#x20;   administrative dashboard.

# \-   An institution can manage announcements, tuition, and performance

# &#x20;   information.

# \-   Sellers can publish eligible educational products or services in the

# &#x20;   IBNI Store.

# \-   Users can discover and purchase eligible marketplace listings using

# &#x20;   supported payment methods.

# \-   The platform can calculate marketplace commissions according to

# &#x20;   configured rates.

# \-   The product supports Arabic and French, with Tamazight identified as

# &#x20;   a potential additional language.

# \-   Core experiences are responsive across mobile, tablet, and desktop

# &#x20;   form factors.

# \-   Sensitive data hosting and processing meet the validated Algerian

# &#x20;   legal and localization requirements before production launch.

# 

# \## 15. Open Questions / TBD

# 

# The supplied documentation does not define the following implementation

# details. They should be resolved before engineering estimates and

# production delivery:

# 

# \### Accounts and Permissions

# 

# \-   What are the registration, login, identity verification, and account

# &#x20;   recovery flows?

# \-   Can one account hold multiple roles?

# \-   What are the detailed permissions for parents, students, teachers,

# &#x20;   institution staff, sellers, and platform administrators?

# \-   How are parent--child, teacher--class, and institution--user

# &#x20;   relationships established and verified?

# 

# \### Academic Model

# 

# \-   What are the supported school years, grades, subjects, terms,

# &#x20;   grading scales, and attendance states?

# \-   Which curriculum data sources and content owners will be used?

# \-   How are grades, behavior records, and attendance entered, edited,

# &#x20;   approved, and corrected?

# 

# \### Communication

# 

# \-   Which message types, attachments, and group conversations are

# &#x20;   supported?

# \-   Are read receipts, message search, moderation, blocking, and

# &#x20;   reporting required?

# \-   Which channels are used for notifications (in-app, push, email,

# &#x20;   SMS)?

# 

# \### Marketplace

# 

# \-   What listing types, categories, seller onboarding, moderation, and

# &#x20;   verification workflows are required?

# \-   How do orders, bookings, cancellations, refunds, disputes, and

# &#x20;   seller payouts work?

# \-   Are physical goods shipping and delivery managed by IBNI or by

# &#x20;   sellers?

# \-   What are the final commission rates and advertising rules?

# 

# \### AI and Gamification

# 

# \-   Which AI models or providers, if any, will be used?

# \-   What data may be used for recommendations and predictive analytics?

# \-   What safeguards, explainability, and human review are required for

# &#x20;   AI-generated insights?

# \-   What are the rules for points, badges, avatars, discounts, and

# &#x20;   reward eligibility?

# 

# \### Technical and Compliance

# 

# \-   What are the final hosting provider, architecture, database, and

# &#x20;   technology stack?

# \-   What exact data-residency and cross-border processing constraints

# &#x20;   apply?

# \-   What are the retention, deletion, consent, backup,

# &#x20;   disaster-recovery, and incident-response policies?

# \-   What are the performance, uptime, accessibility, and

# &#x20;   supported-device targets?

# 

# \### Commercial and Delivery

# 

# \-   What are the subscription plans, exact prices, billing periods, and

# &#x20;   trial rules?

# \-   What is the MVP scope and what is deferred to later releases?

# \-   What are the launch regions, pilot institutions, success metrics,

# &#x20;   and release milestones?

# 

# \## 16. References

# 

# The original documentation lists the following references:

# 

# 1\.  Algeria --- Digital Economy, trade.gov:

# &#x20;   https://www.trade.gov/country-commercial-guides/algeria-digital-economy

# 2\.  Electronic Education At The Algerian University,

# &#x20;   ilkogretim-online.org:

# &#x20;   https://ilkogretim-online.org/index.php/pub/article/download/8192/7790/15593

# 3\.  Middle East EdTech Market Size, Share, Trends \& Forecast,

# &#x20;   verifiedmarketresearch.com:

# &#x20;   https://www.verifiedmarketresearch.com/product/middle-east-edtech-market/

# 4\.  The EdTech startup landscape in the MENA region, gchumanrights.org:

# &#x20;   https://www.gchumanrights.org/preparedness/the-edtech-startup-landscape-in-the-mena-region-the-sleeping-giant/

# 5\.  Transforming Algerian Education: A Generational Perspective,

# &#x20;   ijpie.org:

# &#x20;   https://www.ijpie.org/article\_210782\_458b030b9915d31bc2a36ec25a9a2e5d.pdf

# 6\.  Reforms to Algeria's education system to expand capacity, Oxford

# &#x20;   Business Group:

# &#x20;   https://oxfordbusinessgroup.com/reports/algeria/2018-report/economy/contemporary-tutelage-transforming-the-education-system-to-expand-capacity-and-prepare-students-for-the-modern-age

# 7\.  Algeria Aims for Digital Leap in Education with 2 Million locally

# &#x20;   made tablets, wearetech.africa:

# &#x20;   https://www.wearetech.africa/actualites/fils/actualites/gestion-publique/algeria-aims-for-digital-leap-in-education-with-2-million-locally-made-tablets

# 8\.  Country Report Algeria, dwi-api.ithra.com:

# &#x20;   https://dwi-api.ithra.com/uploads/Algeria\_country\_profile\_bdb6c09692.pdf

