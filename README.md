# GRAZIE

A front-end restaurant ordering website for GRAZIE.

## Run it

No build tools are required for the demo. The customer account system persists accounts in browser storage.

1. Extract the ZIP.
2. Open `index.html` in a browser.
3. For best results with browser restrictions, serve the folder from a local web server, for example:
   - VS Code + Live Server
   - Python: `python -m http.server 8000`
4. Open `http://localhost:8000`.

## Demo accounts

Customer:
- Create an account from `account.html`.
- Customer accounts are stored in the browser's `localStorage` under `dahiUsers`, so the same email/password can be used again on that browser.

Staff:
- Moderator and admin sign in through the same customer login terminal on `account.html`.
- Successful staff login automatically routes to `admin.html`.
- Moderator username: `staff`
- Moderator password: `dahi123`
- Admin username: `admin`
- Admin password: `dahi123`

## Included

- Responsive restaurant website
- Italian-inspired pasta, pizza, and all-night menu
- Shopping cart
- Pickup, delivery, and dine-in order type
- $ configurable demo sales tax
- Coupon codes:
  - WELCOME10 = 10% off
  - GRAZIE5 = $5 off $30+
  - PICKUP15 = 15% off pickup
- Customer signup/login with persistent browser-stored accounts and profile management
- Order checkout
- Table reservations
- Local order/reservation history for staff
- Moderator dashboard
- Admin dashboard with tax/name/currency settings
- Browser localStorage persistence

## Important production note

This project is a functional front-end prototype. It is NOT a secure production authentication or payment system.

For a real restaurant deployment, move authentication, passwords, roles, orders, reservations, coupons and settings to a server/database. Never store plaintext passwords in localStorage. Use hashed passwords, secure sessions/JWTs, server-side authorization and validation, HTTPS, CSRF protection, rate limiting, audit logs, and a PCI-compliant payment provider such as Stripe Checkout/Payment Element or another supported gateway.

The 8.25% tax rate is only a demo value. Configure it for the restaurant's actual tax jurisdiction.
