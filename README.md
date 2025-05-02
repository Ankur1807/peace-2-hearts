
Peace2Hearts – Stable Launch Codebase (v1.0)

Welcome to the production-ready codebase of **Peace2Hearts** – a platform offering confidential support for emotional, legal, and relational challenges through a seamless consultation and payment system.

---

🔒 Status: Frozen as of May 2025

This codebase is currently **frozen and production-stable**. All core systems have been tested, deployed, and verified.

All further changes must be made via a separate branch and pull request. No direct changes to the live version (`main` or `release`) are permitted without review.


✅ Features

- 🗓️ **Consultation Booking System
- 💳 **Integrated Razorpay Payments
- ✅ **Edge Function: Payment Verification
- 📧 **Automated Email Confirmation (User + Admin) via Resend
- 📄 **Static Thank-You Page (No dynamic booking fetch)
- 🧠 **Session Storage for Payment Recovery
- 🌐 **Responsive, accessible frontend

🔧 Tech Stack

| Technology     | Purpose                                     |
|----------------|---------------------------------------------|
| Supabase   | Database + Edge Functions                   |
| Razorpay   | Payment Processing                          |
| Resend     | Transactional Emails                        |
| Netlify    | Frontend Hosting                            |
| Hostinger  | Domain Management (DNS for peace2hearts.com)|
| React      | Frontend UI                                 |
| Vite       | Fast development tooling                    |
| TypeScript | Static typing for safety                    |
| Tailwind CSS | Styling and layout                        |
| shadcn/ui  | Component system and theming                |

---

🚀 Live Project

Production URL:[https://peace2hearts.com](https://peace2hearts.com)
- Lovable Project: [https://lovable.dev/projects/8dc52f24-133b-45c6-b152-8fda33a10903](https://lovable.dev/projects/8dc52f24-133b-45c6-b152-8fda33a10903)


💻 Local Development Setup

Step 1: Clone the repository
git clone <YOUR_GIT_URL>

Step 2: Navigate to the project
cd <YOUR_PROJECT_NAME>

Step 3: Install dependencies

Step 4: Run the development server

📂 Folder Highlights
Folder / File	Purpose
src/pages/ThankYou.tsx	Final static thank-you page (no fetch logic)
supabase/functions/verify-payment/index.ts	Edge function for payment confirmation
src/hooks/useOpenRazorpayCheckout.ts	Razorpay trigger + handler logic
src/utils/payment/services	Session management, recovery logic
send-email (edge or service)	Handles automated emails post-booking

📬 Deployment
Deployment is managed via Netlify using the main (or release) branch.
The custom domain peace2hearts.com is connected via Hostinger DNS.

🔐 Environment Variables
Make sure to add your .env file with the following:


SUPABASE_URL=
SUPABASE_ANON_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_SECRET=
RESEND_API_KEY=
Never commit your .env file to version control.

🧠 Contribution Policy
This codebase is frozen as of May 2025.
All updates must go through pull requests and follow existing project structure.

👏 Credits
Peace2Hearts core system was developed through iterative work, problem-solving, and resilience. Thanks to the collaborative effort behind the booking engine, payment flow, frontend experience, and infrastructure deployment.
