# 🎧 SoundWave — High Fidelity Audio E-Commerce Platform

SoundWave is a production-quality, full-stack audio electronics e-commerce platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Authentication, Row Level Security, and Storage)**.

The storefront specializes in reference headphones, wireless active noise-cancelling earbuds, earphones, Bluetooth acoustic monitors, and high-performance soundbars.

---

## 🌟 Key Highlights

- **Dual-Mode Persistence (Seamless Hybrid)**: Runs out-of-the-box with a high-fidelity local catalog and demo sandbox. Automatically switches to real-time Supabase PostgreSQL, Authentication, and Storage as soon as credentials are provided.
- **Strict Role-Based Security**: Customer accounts and administrative routes are separated. Admin pages (`/admin/*`) require verified administrator privileges stored securely in the database.
- **Dynamic Interactive Color Variants**: Choosing color swatches updates SKU, price, stock, and photography dynamically without full-page reloads.
- **Persistent Shopping Cart & Drawer**: Slide-over drawer with real-time tax calculation (8%), free shipping threshold ($150+), and coupon redemption (`Sonic10`, `VIP20`).
- **Resilient Checkout & Order Flow**: Generates unique tracking numbers (`SW-YYYY-XXXX`), line-item price snapshots, and dedicated order confirmation dossiers.
- **Admin Control Center**:
  - Store Overview KPIs (Total Sales, Total Orders, Active Catalog, Customers, Low-Stock alerts)
  - Catalog CRUD management with interactive variant configuration
  - Category taxonomies and cover imagery
  - Order fulfillment state management (pending, processing, shipped, delivered, cancelled) and carrier tracking
  - Customer directory and lifetime spending value (LTV)

---

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router) & React 19
- **Language**: TypeScript (strict types, zero `any` shortcuts)
- **Styling**: Tailwind CSS with custom acoustic dark palette (Deep Obsidian `#08080a`, Warm White, Charcoal Gray, Electric Orange `#ff5500`)
- **Icons**: Lucide React
- **Animations & Effects**: Framer Motion & Canvas Confetti
- **Database & Auth**: Supabase PostgreSQL, Supabase SSR Auth, and Row Level Security (RLS)

---

## 🚀 Getting Started

### 1. Installation

Clone or open the workspace and install dependencies:

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` to configure your Supabase project (optional for initial demo evaluation):

```env
# Supabase Public API credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Service Role Key (SERVER ONLY)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Public site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note**: If Supabase variables are left blank, Wave automatically boots in **Seed Mode (Local Sandbox)** with pre-populated flagships, reviews, and test accounts.

### 3. Launch Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build Validation

```bash
npm run build
npm run start
```

---

## 🗄️ Supabase Database Setup & Migrations

When you are ready to connect a live Supabase project:

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open and run [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql):
   - Sets up `profiles`, `categories`, `products`, `product_variants`, `carts`, `cart_items`, `wishlists`, `orders`, `order_items`, `reviews`, `coupons`, and `newsletter_subscribers`.
   - Configures automatic updated-at triggers and profile creation listeners on `auth.users`.
   - Enables Row Level Security (RLS) on all tables with explicit read/write policies.
4. Open and run [`supabase/seed.sql`](supabase/seed.sql) to populate standard acoustic catalog categories, flagship products, and promotional coupons.

---

## 📦 Supabase Storage Setup (Product Images)

1. Navigate to **Storage** in your Supabase dashboard.
2. Click **Create bucket**, name it `product-images`, and toggle **Public bucket** ON.
3. Apply storage policies allowing authenticated administrators to upload (`INSERT`, `UPDATE`, `DELETE`) and public visitors to read (`SELECT`). These policies are already detailed at the bottom of [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql).

---

## 🔑 Bootstrapping the First Administrator

For security, public signups default to the `customer` role. To grant administrator privileges to your user:

1. Sign up on the website at `/signup` with your admin email (e.g. `admin@soundcwave.audio`).
2. Run the following query in your Supabase **SQL Editor**:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@soundwave.audio';
```

3. Sign in at `/login`. Your account will immediately have access to the `/admin` navigation link and the full Admin Control Center.

*(In local Sandbox mode, click the **"Enter as Demo Administrator"** button on the `/admin` screen or select Demo Admin from the login screen).*

---

## 🌐 Complete Site Navigation

| Route | Description |
|---|---|
| `/` | Storefront flagship hero, featured drivers, category tiles, best sellers, testimonials, newsletter |
| `/shop` | Product catalog with live search, category tabs, price range filters, and sort options |
| `/product/[slug]` | Product details with interactive color variants, gallery, technical specs, stock verification, and related items |
| `/about` | Brand philosophy, acoustic engineering principles, mission, and industrial design standards |
| `/cart` | Full shopping cart page with promo coupons, live subtotal, and tax/shipping breakdown |
| `/checkout` | Contact details, shipping address, order review, payment method selection, and order generation |
| `/order-confirmation/[orderNumber]` | Dedicated receipt dossier with order items, shipping details, and next steps |
| `/account` | Customer profile, past order history, order status, and saved acoustic wishlist |
| `/login` | Customer/Admin authentication with friendly error validation and demo role switchers |
| `/signup` | User registration with dedicated Thank You screen |
| `/forgot-password` | Password reset request flow |
| `/admin` | Store overview KPIs (Sales, Orders, Active Products, Customers, Low-Stock alerts) |
| `/admin/products` | Catalog inventory CRUD, color variant editor, pricing, and tag management |
| `/admin/categories` | Category taxonomy management with image covers and deletion safety guards |
| `/admin/orders` | Customer order management, fulfillment status updates, and tracking numbers |
| `/admin/customers` | Customer audience directory with cumulative order count and lifetime spend (LTV) |

---

## 🔒 Security Architecture

- **Server-Side Validation**: Product prices, variant IDs, and stock levels are validated against the database during checkout to prevent browser manipulation.
- **Row Level Security (RLS)**: Public visitors can only query published active products and categories. Customers can only read and modify their own carts and orders.
- **Admin Isolation**: Sensitive CRUD operations and customer lists are locked to users with `role = 'admin'`.
- **Zero Secrets Leakage**: Service role keys are kept strictly in server environments and are never bundled into client components.

---

## 🏷️ Test Coupons (Pre-seeded)

- `SONIC10` — 10% off any order
- `VIP20` — 20% off orders over $200
- `SUMMER50` — $50 off orders over $250
