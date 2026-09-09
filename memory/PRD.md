# PRD — Степпе Тэйбл (Mongolian Food Delivery)

## Original Problem Statement
Mongolian food delivery website with: menu (Пицца, Махан, Куриц, Сэт, Ундаа categories), shopping cart, bank transfer payment info collection, phone number, delivery address, bank details (bank name, account holder), 20-60 min delivery, order confirmation page. Design system: deep brown #3D2817, gold #E8A76A, warm red #C85C4A, cream #F5F1ED, dark text #5A4A42; Poppins headings, Inter body; mobile-first.

## Architecture
- Backend: FastAPI (`/app/backend/server.py`) — GET /api/menu (seeded into MongoDB on startup), POST /api/orders (server-side total calculation, order number MH-xxxxxx), GET /api/orders/{id}
- Frontend: React SPA, state-driven pages (menu → cart → checkout → success), cart persisted in localStorage
- DB: MongoDB via MONGO_URL/DB_NAME, collections: `menu`, `orders`

## User Personas
- Customer ordering Mongolian food for delivery, paying by bank transfer

## Core Requirements (static)
- Menu with categories + search
- Cart with quantity controls
- Checkout: phone, address, bank name, account holder, notes
- Delivery: 20-60 minutes
- Success/confirmation page

## Implemented (2026-06)
- 12-item menu seeded in MongoDB with images, portions, prices
- Category filtering + live search
- Cart with add/remove/quantity, localStorage persistence, total
- Checkout form with validation, Mongolian bank list, order submission to backend
- Server-side order total + order number; success page with full order recap
- Responsive design per provided design system

## Backlog
- P1: Order status tracking by phone number, order history
- P2: Admin view of orders, real online payment (QPay), delivery zone fee

## Next Tasks
- Verify E2E test results; iterate on user feedback
