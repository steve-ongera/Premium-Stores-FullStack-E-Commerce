# Premium Stores FullStack E-Commerce Platform

A production-ready e-commerce application built with **Node.js (Express)**, **React**, and **PostgreSQL**.

---

##  Project Structure

```
ecommerce/
├── README.md
├── .gitignore
├── docker-compose.yml              # PostgreSQL + pgAdmin + app containers
│
├── backend/                        # Node.js + Express API
│   ├── package.json
│   ├── .env.example
│   ├── server.js                   # Entry point
│   │
│   ├── config/
│   │   ├── db.js                   # PostgreSQL connection (pg pool)
│   │   └── cloudinary.js           # Image uploads config
│   │
│   ├── middleware/
│   │   ├── auth.js                 # JWT verify middleware
│   │   ├── isAdmin.js              # Admin role guard
│   │   ├── errorHandler.js         # Global error handler
│   │   ├── rateLimiter.js          # express-rate-limit
│   │   └── upload.js               # Multer file upload
│   │
│   ├── routes/
│   │   ├── auth.routes.js          # /api/auth
│   │   ├── user.routes.js          # /api/users
│   │   ├── product.routes.js       # /api/products
│   │   ├── category.routes.js      # /api/categories
│   │   ├── order.routes.js         # /api/orders
│   │   ├── cart.routes.js          # /api/cart
│   │   ├── review.routes.js        # /api/reviews
│   │   ├── payment.routes.js       # /api/payments
│   │   ├── coupon.routes.js        # /api/coupons
│   │   └── admin.routes.js         # /api/admin
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── order.controller.js
│   │   ├── cart.controller.js
│   │   ├── review.controller.js
│   │   ├── payment.controller.js
│   │   ├── coupon.controller.js
│   │   └── admin.controller.js
│   │
│   ├── models/                     # Raw SQL query functions (no ORM)
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── category.model.js
│   │   ├── order.model.js
│   │   ├── orderItem.model.js
│   │   ├── cart.model.js
│   │   ├── review.model.js
│   │   ├── coupon.model.js
│   │   └── payment.model.js
│   │
│   ├── db/
│   │   ├── migrations/
│   │   │   ├── 001_create_users.sql
│   │   │   ├── 002_create_categories.sql
│   │   │   ├── 003_create_products.sql
│   │   │   ├── 004_create_product_images.sql
│   │   │   ├── 005_create_cart.sql
│   │   │   ├── 006_create_orders.sql
│   │   │   ├── 007_create_order_items.sql
│   │   │   ├── 008_create_reviews.sql
│   │   │   ├── 009_create_coupons.sql
│   │   │   └── 010_create_payments.sql
│   │   └── seed.js                 # Seed demo data
│   │
│   └── utils/
│       ├── jwt.js                  # Sign / verify tokens
│       ├── email.js                # Nodemailer helpers
│       ├── pagination.js           # Reusable paginator
│       └── slugify.js
│
└── frontend/                       # React + Vite
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env.example
    │
    ├── public/
    │   └── assets/
    │
    └── src/
        ├── main.jsx                # ReactDOM root
        ├── App.jsx                 # Routes definition
        │
        ├── api/                    # Axios instances & API calls
        │   ├── axiosInstance.js    # Base URL + interceptors
        │   ├── auth.api.js
        │   ├── product.api.js
        │   ├── order.api.js
        │   ├── cart.api.js
        │   └── admin.api.js
        │
        ├── store/                  # Redux Toolkit slices
        │   ├── index.js            # configureStore
        │   ├── authSlice.js
        │   ├── cartSlice.js
        │   ├── productSlice.js
        │   └── orderSlice.js
        │
        ├── hooks/                  # Custom React hooks
        │   ├── useAuth.js
        │   ├── useCart.js
        │   └── usePagination.js
        │
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx
        │   │   ├── Footer.jsx
        │   │   ├── Sidebar.jsx
        │   │   └── AdminLayout.jsx
        │   ├── ui/
        │   │   ├── Button.jsx
        │   │   ├── Input.jsx
        │   │   ├── Modal.jsx
        │   │   ├── Toast.jsx
        │   │   ├── Spinner.jsx
        │   │   ├── Badge.jsx
        │   │   ├── StarRating.jsx
        │   │   └── Pagination.jsx
        │   ├── product/
        │   │   ├── ProductCard.jsx
        │   │   ├── ProductGrid.jsx
        │   │   ├── ProductFilters.jsx
        │   │   ├── ProductImageGallery.jsx
        │   │   └── RelatedProducts.jsx
        │   ├── cart/
        │   │   ├── CartDrawer.jsx
        │   │   ├── CartItem.jsx
        │   │   └── CartSummary.jsx
        │   ├── checkout/
        │   │   ├── AddressForm.jsx
        │   │   ├── PaymentForm.jsx
        │   │   └── OrderSummary.jsx
        │   └── admin/
        │       ├── StatsCard.jsx
        │       ├── SalesChart.jsx
        │       ├── RecentOrders.jsx
        │       └── DataTable.jsx
        │
        └── pages/
            ├── Home.jsx
            ├── Shop.jsx
            ├── ProductDetail.jsx
            ├── Cart.jsx
            ├── Checkout.jsx
            ├── OrderSuccess.jsx
            ├── OrderHistory.jsx
            ├── Profile.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── ForgotPassword.jsx
            └── admin/
                ├── Dashboard.jsx
                ├── Products.jsx
                ├── Orders.jsx
                ├── Customers.jsx
                ├── Categories.jsx
                └── Coupons.jsx
```

---

##  Database Schema (PostgreSQL)

```sql
users           -- id, name, email, password_hash, role, avatar, created_at
categories      -- id, name, slug, parent_id, image_url
products        -- id, name, slug, description, price, stock, category_id, ...
product_images  -- id, product_id, url, is_primary
cart            -- id, user_id
cart_items      -- id, cart_id, product_id, quantity
orders          -- id, user_id, status, total, shipping_address, ...
order_items     -- id, order_id, product_id, quantity, unit_price
reviews         -- id, user_id, product_id, rating, comment
coupons         -- id, code, discount_type, value, min_order, expires_at
payments        -- id, order_id, provider, status, transaction_id
```

---

##  API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| POST | `/api/auth/logout` | Invalidate token |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset with token |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List (filter, sort, paginate) |
| GET | `/api/products/:id` | Single product |
| GET | `/api/products/search?q=` | Full-text search |
| POST | `/api/products` | Create (admin) |
| PUT | `/api/products/:id` | Update (admin) |
| DELETE | `/api/products/:id` | Delete (admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart/items` | Add item |
| PUT | `/api/cart/items/:id` | Update quantity |
| DELETE | `/api/cart/items/:id` | Remove item |
| DELETE | `/api/cart` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | User order history |
| GET | `/api/orders/:id` | Order detail |
| PUT | `/api/orders/:id/cancel` | Cancel order |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Stats & metrics |
| GET | `/api/admin/orders` | All orders |
| PUT | `/api/admin/orders/:id/status` | Update status |
| GET | `/api/admin/customers` | All users |

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Redux Toolkit, React Router v6 |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (raw `pg` driver) |
| Auth | JWT (access + refresh tokens) |
| Payments | Stripe |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer + SendGrid |
| Containerization | Docker + Docker Compose |

---

##  Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14  *(or Docker)*
- npm / yarn

### 1. Clone & Install

```bash
git clone https://github.com/yourname/ecommerce.git
cd ecommerce

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Environment Variables

**backend/.env**
```env
PORT=5000
NODE_ENV=development

# PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxx
EMAIL_FROM=no-reply@yourstore.com

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run Migrations & Seed

```bash
cd backend
npm run migrate     # Runs all SQL files in db/migrations/
npm run seed        # Seeds demo products, categories, admin user
```

### 4. Start Development Servers

```bash
# Terminal 1 — backend
cd backend && npm run dev     # nodemon on port 5000

# Terminal 2 — frontend
cd frontend && npm run dev    # Vite on port 5173
```

### 5. (Optional) Docker Compose

```bash
docker-compose up -d          # Spins up Postgres + pgAdmin
```

---

##  Key Design Decisions

| Decision | Reason |
|----------|--------|
| Raw `pg` driver (no ORM) | Full SQL control, easier optimization, no magic |
| JWT access + refresh tokens | Short-lived access (15m) + silent refresh via httpOnly cookie |
| Redux Toolkit for cart | Persists to localStorage; syncs with server on login |
| Vite over CRA | 10× faster HMR, native ESM |
| Migrations as plain `.sql` files | Portable, auditable, no extra tooling needed |

---

##  NPM Scripts

### Backend
```bash
npm run dev        # Start with nodemon
npm run start      # Production start
npm run migrate    # Run DB migrations
npm run seed       # Seed demo data
npm run lint       # ESLint
```

### Frontend
```bash
npm run dev        # Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint
```

---

##  Development Roadmap

- [x] Project scaffold & README
- [ ] Database migrations
- [ ] Auth (register/login/JWT)
- [ ] Products CRUD + image upload
- [ ] Categories & filters
- [ ] Cart (guest + authenticated)
- [ ] Checkout + Stripe integration
- [ ] Order management
- [ ] Reviews & ratings
- [ ] Coupons & discounts
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Unit & integration tests
- [ ] Docker production setup
- [ ] CI/CD pipeline

---

##  Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feat/amazing-feature`
5. Open a PR

---

##  License

MIT © 2026