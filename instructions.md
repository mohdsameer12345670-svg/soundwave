# MASTER PROMPT: BUILD A PREMIUM AUDIO E-COMMERCE WEBSITE

Act as a senior full-stack developer, UI/UX designer, database architect, and e-commerce specialist. Build a complete, production-quality, fully functional audio electronics e-commerce website called **SoundWave**.

The store will sell headphones, wireless earbuds, earphones, Bluetooth speakers, soundbars, gaming headsets, and other audio accessories.

Do not create just a visual demo or static frontend. Build a working full-stack application with real authentication, database persistence, product management, shopping cart, order management, and a secure admin dashboard.

First inspect the existing project structure and preserve any working code. If the project is empty, initialize the appropriate application structure. Implement the website directly in the project files, run the application, test it, and fix errors before finishing.

## 1. TECHNOLOGY STACK

Use the following technologies:

- Next.js with App Router and TypeScript.
- React for reusable UI components.
- Tailwind CSS for styling.
- Framer Motion for subtle, premium animations.
- Lucide React for consistent icons.
- Supabase Authentication for customer and administrator login.
- Supabase PostgreSQL database for persistent application data.
- Supabase Storage for product images and other store assets.
- Supabase Row Level Security (RLS) for database security.
- React Hook Form and Zod for form handling and validation, where appropriate.

Use stable, mutually compatible package versions.

Use environment variables for all Supabase credentials. Create a complete `.env.example` file with the required variable names and placeholder values.

Never hardcode secrets or expose the Supabase service-role key in client-side code.

If Supabase credentials are unavailable, build the application structure and provide clear setup instructions. Do not pretend that the database, authentication, or storage is connected when it is not.
## 2. PREMIUM BRANDING AND UI DESIGN

Create a premium, modern, visually impressive audio technology brand.

Brand name: SoundWave.

Design direction:
- Premium consumer electronics aesthetic.
- Black, warm white, charcoal gray, and electric orange accent colors.
- Large editorial headings and clean typography.
- Spacious layouts, refined borders, subtle shadows, and high-quality product photography.
- Consistent spacing, responsive product grids, and polished navigation.
- Subtle hover effects, smooth transitions, and tasteful entrance animations.
- Premium buttons, clean icons, attractive badges, and elegant product cards.
- Use real product images from properly licensed sources or configured Supabase Storage assets.
- Provide graceful image fallbacks when an image is unavailable.
- Avoid generic template-like layouts, excessive gradients, excessive rounded cards, and unnecessary animations.
- Maintain excellent readability and contrast.

The website should look like a professionally designed premium electronics brand, not a beginner project.

## 3. REQUIRED PUBLIC PAGES

### A. Home Page `/`

Create an impressive storefront with:

1. Premium announcement bar for offers and promotions.
2. Responsive navigation bar with logo, Home, Shop, About, search, account, and cart.
3. Large hero section with premium headphones photography, strong headline, supporting text, and a Shop Now CTA.
4. Featured product collection.
5. Shop by category section:
   - Headphones
   - Earphones
   - Wireless Earbuds
   - Bluetooth Speakers
   - Gaming Headsets
   - Audio Accessories
6. Best sellers and new arrivals.
7. Promotional banner for special offers.
8. Brand benefits such as quality, secure checkout, and customer support.
9. Customer testimonials using clearly identified sample content until real reviews exist.
10. Newsletter subscription section, with subscriptions stored in Supabase.
11. Professional footer with navigation, contact information, policies, and social links.

All product sections must fetch their data from Supabase.

### B. Shop Page `/shop`

Build a complete product discovery and shopping experience.

Requirements:
- Responsive product grid.
- Search products by name and description.
- Filter by category, price range, availability, and relevant product attributes.
- Sort by newest, price low-to-high, price high-to-low, and popularity where reliable data exists.
- Pagination or a working Load More button.
- Product cards with product image, name, price, sale price when applicable, availability, and rating only when genuine review data exists.
- Quick view or product detail navigation.
- Wishlist functionality for authenticated customers, if implemented.
- Proper loading skeletons, empty states, and error messages.

Every product card must include:

1. Product image.
2. Product name.
3. Current price and original price when discounted.
4. Color selection control with visible color swatches.
5. A clearly visible Add to Cart button.
6. A link or button to view product details.

Color selection must be functional. Selecting a color should update the selected variant and, when configured, its associated product image and available stock.

Do not show decorative, non-functional color buttons.

Prevent adding unavailable products or variants to the cart.

### C. Product Details Page `/product/[slug]`

Build a detailed, premium product page containing:

- Large image gallery with thumbnails.
- Product title, price, discount, and availability.
- Product description and specifications.
- Available colors with interactive swatches.
- Variant-specific image, SKU, price, and stock where applicable.
- Quantity selector with stock validation.
- Add to Cart button.
- Buy Now button that takes the customer into the checkout flow.
- Delivery information and return policy.
- Related products.
- Customer reviews only when actual review data exists.

Store product and variant information in Supabase.

### D. About Page `/about`

Create a premium brand story page with:

- SoundWave brand introduction.
- Mission and vision.
- Focus on sound quality, comfort, and design.
- Brand values.
- Attractive editorial imagery.
- A CTA linking to the shop.

Do not invent claims about certifications, awards, company history, or customer numbers.

### E. Authentication Pages

Create:
- `/login`
- `/signup`
- `/forgot-password`
- `/auth/callback`

Use Supabase Authentication for registration, login, logout, password recovery, and session handling.

Support customer email/password authentication and Google OAuth when correctly configured in Supabase.

After successful signup, display a dedicated, polished Thank You screen with a message such as:

"Thank you for joining SoundWave! Your account has been created successfully."

Provide a Continue Shopping button.

If email confirmation is enabled, clearly explain that the user must verify their email before the account is fully activated. Do not falsely report that an account is fully verified.

After successful login, show a welcoming success screen or toast such as:

"Welcome back to SoundcWave!"

Then redirect customers to the intended page or account dashboard.

Show friendly validation errors for invalid credentials, duplicate email addresses, network failures, and OAuth configuration errors.

Never display a success message when authentication has failed.

### F. Customer Account Page `/account`

Create a protected customer dashboard with:
- Customer profile.
- Name and email.
- Order history.
- Order detail pages.
- Order status.
- Saved addresses, if implemented.
- Wishlist, if implemented.
- Logout functionality.

Customers must only be able to access their own private account and orders.

### G. Cart Page `/cart`

Implement a real shopping cart.

Requirements:
- Add products with their selected colors and variants.
- Update quantities.
- Remove items.
- Show product images, selected colors, unit prices, and line totals.
- Calculate subtotal and applicable discounts.
- Calculate shipping and taxes only from configured rules.
- Show the final total clearly.
- Persist the cart for returning customers and restore it after login.
- Support guest cart functionality if practical.
- Merge guest cart items safely after login.
- Validate prices, variants, stock, and quantities on the server before checkout.

Never trust prices or totals submitted by the browser.

### H. Checkout Page `/checkout`

Create a responsive checkout experience with:
- Customer contact information.
- Shipping address.
- Order summary.
- Shipping charges and discount codes, if configured.
- Secure order submission.
- Payment integration only when real provider credentials and server-side verification are configured.

Do not collect or store raw card numbers, CVVs, or other sensitive payment credentials.

If payment integration is not configured, provide an explicitly labelled development or cash-on-delivery flow only when enabled by the store administrator. Never mark an unpaid online order as paid.

After successful order placement, show an order confirmation page with the order number, purchased products, total, and next steps.

## 4. ADMIN DASHBOARD

Create a fully protected admin area using `/admin`.

The dashboard must be accessible only to users with a verified administrator role stored securely in Supabase.

Do not grant administrator privileges based on a signup form, query parameter, localStorage value, or client-side role check alone.

Include the following pages:

### Admin Overview `/admin`

- Total orders.
- Total sales based on valid order/payment statuses.
- Total customers.
- Total active products.
- Low-stock alerts.
- Recent orders.
- Sales charts based on actual database data.

Display clear empty states when no sales or orders exist.

### Product Management `/admin/products`

Administrators must be able to:
- Create products.
- Edit products.
- Delete or archive products.
- Upload product images to Supabase Storage.
- Set product name, slug, description, category, price, sale price, SKU, and stock.
- Manage available colors and product variants.
- Assign a separate image, SKU, price, and inventory to a variant when required.
- Mark products as featured, new arrivals, or best sellers.
- Control product visibility.

Use form validation and confirmation dialogs for destructive operations.

### Category Management `/admin/categories`

- Add, edit, and delete categories.
- Set category name, slug, description, and image.
- Prevent accidental deletion of categories that are still in use.

### Order Management `/admin/orders`

- View all orders.
- Search and filter orders.
- Open order details.
- View customer information required for order fulfilment.
- Update fulfilment status using allowed transitions.
- Track payment status separately from fulfilment status.
- Add tracking information when available.
- Maintain an order status history.

Never allow the admin dashboard to fabricate successful payment confirmation.

### Customer Management `/admin/customers`

- View registered customers.
- Search customers.
- View order history and spending summaries.
- Protect sensitive customer information.
- Do not expose passwords, authentication tokens, or private credentials.

### Additional Admin Features

- Inventory management.
- Discount and coupon management.
- Store settings for shipping, currency, and contact information.
- Review moderation if reviews are implemented.
- Logout and protected admin navigation.

Hide admin navigation from regular customers, but remember that hiding UI is not a security control. Enforce permissions on the server and in Supabase policies.

## 5. SUPABASE DATABASE DESIGN

Create SQL migration files in a dedicated folder such as `supabase/migrations/`.

Design a normalized relational database with suitable primary keys, foreign keys, indexes, timestamps, constraints, and update triggers.

Create tables where appropriate for:

1. `profiles`
   - User ID referencing `auth.users`.
   - Full name.
   - Email where appropriate.
   - Role: customer or admin.
   - Created and updated timestamps.

2. `categories`
   - ID.
   - Name.
   - Unique slug.
   - Description.
   - Image URL.
   - Active status.

3. `products`
   - ID.
   - Category ID.
   - Name.
   - Unique slug.
   - Description.
   - Base price.
   - Sale price.
   - Main image.
   - Product status.
   - Featured flag.
   - Created and updated timestamps.

4. `product_variants`
   - ID.
   - Product ID.
   - Color name.
   - Color hex code.
   - SKU.
   - Optional variant-specific price.
   - Optional variant-specific image.
   - Stock quantity.
   - Active status.

5. `carts` and `cart_items`, or another robust persistent cart design.

6. `wishlists` and `wishlist_items`, if wishlist functionality is implemented.

7. `orders`
   - ID.
   - Customer ID.
   - Unique order number.
   - Shipping address snapshot.
   - Subtotal.
   - Discount.
   - Shipping charge.
   - Tax.
   - Total.
   - Payment status.
   - Fulfilment status.
   - Created timestamp.

8. `order_items`
   - Order ID.
   - Product ID where available.
   - Variant ID where available.
   - Product name snapshot.
   - Selected color snapshot.
   - SKU snapshot.
   - Quantity.
   - Unit price snapshot.
   - Line total.

9. `payments` or payment references, where appropriate.

10. `reviews`, if review functionality is implemented.

11. `coupons`, if discount codes are implemented.

12. `newsletter_subscribers`, if newsletter subscriptions are implemented.

Create all necessary relationships and indexes.

Store historical order-item prices and product details as snapshots so later product edits do not change existing order records.

Create appropriate SQL functions and triggers for profile creation, timestamp maintenance, and safe inventory handling where needed.

Never rely on a public signup request to assign an administrator role. Use a secure, documented procedure to bootstrap the first administrator.

## 6. ROW LEVEL SECURITY AND APPLICATION SECURITY

Enable Row Level Security on every table that requires it.

Implement and test policies ensuring:

- Public visitors can read only active, published products and active categories.
- Authenticated customers can read and update only permitted fields in their own profiles.
- Customers can access only their own carts, wishlists, and orders.
- Customers cannot change their role to admin.
- Customers cannot modify prices, payment status, or privileged order fields.
- Only authorized administrators can manage products, categories, inventory, and store-wide settings.
- Only authorized users can access customer-management functions.
- Order creation validates the authenticated customer and current database prices.
- Inventory updates are concurrency-safe and prevent overselling.
- Supabase Storage upload and deletion policies restrict administrative image management appropriately.

Do not use service-role credentials in browser code.

Do not assume that middleware alone is sufficient for authorization. Verify permissions at the server/data-access layer and through RLS.

Protect sensitive mutations with appropriate server-side validation, authorization, and rate limiting where practical.

## 7. PRODUCT IMAGE AND STORAGE MANAGEMENT

Configure a Supabase Storage bucket for product images.

Provide SQL or setup instructions for creating the bucket and applying suitable policies.

Use image optimization and responsive image sizing.

Include attractive fallback images when product assets are missing.

Seed the store with realistic sample products across headphones, earbuds, earphones, Bluetooth speakers, and accessories.

Sample data must be added through a repeatable SQL seed file or documented seeding script. Avoid duplicate records when seeding repeatedly.

Clearly distinguish sample data from real customer orders, actual reviews, and real sales figures.

## 8. RESPONSIVE DESIGN

The entire website must work properly on:

- Mobile phones.
- Tablets.
- Laptops.
- Desktop monitors.

Requirements:
- Mobile hamburger navigation.
- Touch-friendly buttons and color swatches.
- Responsive product grids.
- Mobile-friendly filter drawers.
- Responsive product galleries.
- Accessible forms.
- Responsive admin sidebar.
- No horizontal overflow.
- Appropriate image cropping at all breakpoints.
- Accessible focus states and keyboard navigation.

Use semantic HTML and appropriate ARIA labels. Maintain sufficient color contrast.

## 9. LOADING, ERROR AND SUCCESS STATES

Every important user action must provide clear feedback.

Implement:
- Loading skeletons.
- Disabled buttons while submissions are in progress.
- Form validation messages.
- Toasts or inline feedback.
- Empty states.
- Database error handling.
- Retry actions where useful.
- Confirmation dialogs for destructive actions.
- Friendly authentication success screens.
- Order confirmation screens.

Prevent duplicate submissions and duplicate order creation.

Never show a success message before the underlying operation has succeeded.

## 10. CODE QUALITY AND PROJECT STRUCTURE

Organize the project into maintainable components, pages, server-side utilities, types, and database migrations.

Create reusable components for:
- Navbar.
- Footer.
- ProductCard.
- ProductGrid.
- ColorSelector.
- PriceDisplay.
- SearchBar.
- CartDrawer.
- QuantitySelector.
- LoadingSkeleton.
- Toast notifications.
- Form fields.
- Admin sidebar.
- Confirmation dialogs.

Use strict TypeScript types and avoid unnecessary `any` types.

Separate browser-side and server-side Supabase clients correctly.

Use server components by default where appropriate and client components only when interactivity requires them.

Avoid placeholder links, dead buttons, fake authentication, fake CRUD operations, and hardcoded product lists as the final data source.

Do not rewrite the entire project unnecessarily if an existing working implementation is already present.

## 11. REQUIRED DELIVERABLES

Finish the implementation with:

1. Complete source code for all public pages.
2. Working authentication and account flows.
3. Working shopping cart and checkout/order creation.
4. Working admin dashboard with secure CRUD operations.
5. Supabase SQL migrations and seed data.
6. RLS policies and Storage setup instructions.
7. `.env.example`.
8. A clear `README.md` explaining installation, environment setup, Supabase configuration, Google OAuth setup, admin bootstrap, database migrations, and deployment.
9. A responsive premium UI with consistent branding.
10. A list of any features that still require external credentials or additional configuration.

## 12. TESTING AND ACCEPTANCE CRITERIA

Before declaring the project complete:

- Install dependencies and run the development server.
- Run the production build.
- Resolve all build errors and TypeScript errors.
- Check for missing imports and broken routes.
- Verify navigation between all pages.
- Test signup, login, logout, password recovery, and authentication callbacks.
- Verify that the Thank You screen appears only after successful signup.
- Verify that Google OAuth works when properly configured.
- Verify that customers cannot access admin routes or admin data.
- Verify product creation, editing, image upload, and deletion as an administrator.
- Verify that changing a color selects the correct product variant.
- Verify adding, updating, and removing cart items.
- Verify that checkout uses server-validated prices and inventory.
- Verify that successful order creation produces an order confirmation.
- Verify RLS policies with both customer and administrator accounts.
- Test the layout at mobile, tablet, and desktop widths.
- Check browser console and terminal output for errors.

Do not claim that external integrations work unless they have actually been configured and tested.

## 13. EXECUTION INSTRUCTIONS

Work autonomously through the implementation in logical phases:

Phase 1: Inspect the project and establish the design system.

Phase 2: Build the public storefront and responsive navigation.

Phase 3: Implement Supabase schema, authentication, Storage, and RLS.

Phase 4: Implement products, variants, color selection, search, filtering, and cart.

Phase 5: Implement checkout, order management, and customer account pages.

Phase 6: Implement the secure admin dashboard and CRUD functionality.

Phase 7: Add success screens, loading states, error handling, and responsive refinements.

Phase 8: Run production builds and functional tests, fix discovered problems, and document setup.

Do not stop after producing a plan, mockup, or initial homepage. Continue implementing the actual project files.

If you encounter missing credentials, ask only for the specific configuration needed while continuing work on features that can be completed without those credentials.

At the end, provide:
- A summary of completed features.
- The exact command to start the application.
- The environment variables that need to be configured.
- The Supabase setup steps.
- The steps to create the first secure administrator.
- Any outstanding issues or integrations requiring real credentials.

**Final objective:** Deliver a premium, responsive, secure, database-backed audio e-commerce website that is ready for real configuration and deployment, rather than merely a visual prototype.