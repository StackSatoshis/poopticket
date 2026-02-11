# **App Name**: PoopTicket

## Core Features:

- Ticket Search: Allows users to search for citations using citation number and last name by querying Firestore with security considerations.
- Ticket Details Display: Displays complete ticket details including a Citation HTML view, payment status, and outstanding days, with appropriate sanitization to prevent XSS.
- Payment Processing: Processes payments using Stripe and PayPal, integrating react-stripe-js and @paypal/react-paypal-js for payment elements, ensuring PCI compliance and secure transaction handling.
- Admin Authentication: Admin authentication via an open standard to manage tickets, enforcing strong password policies and multi-factor authentication.
- Data Table: List all tickets with their ID, Name, Date, Days Overdue, and Status, facilitating admin management with role-based access control.
- Payment Intent Creation: Cloud Function (using Express) creates Stripe Payment Intents, securing client secrets and validating all inputs to prevent injection attacks.
- Notification Logger: Provides the option to 'Resend Notification' via manual override; logs to the console (placeholder for future expansion), ensuring no sensitive information is logged.

## Style Guidelines:

- Primary color: Forest Green (#2D5A27) for headers and primary buttons, conveying authority and trust.
- Background color: Off-white (#F2F2F2), offering a neutral and clean backdrop.
- Accent color: Slate Gray (#333333) for text and borders, ensuring readability and a professional feel.
- Font: 'Inter' sans-serif, offering a modern, machined, neutral appearance for headers and body text. Note: currently only Google Fonts are supported.
- Simple, line-based icons to represent ticket statuses and actions.
- Clean and modular layout using Tailwind CSS, designed to support future migration to a containerized environment.
- Subtle transitions and feedback animations on user interactions, such as form submissions and status updates.