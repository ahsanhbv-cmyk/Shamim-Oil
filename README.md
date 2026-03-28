# 🛢️ Shamim Oil Depo

A complete, production-ready website for an oil distribution business with **Admin**, **Employee**, and **Customer** portals.

![Shamim Oil Depo](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.7-purple)

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS, ShadCN UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Validation**: Zod
- **Charts**: Recharts

## ✨ Features

### 👨‍💼 Admin Portal
- **Product Management**: Add, edit, delete products with categories
- **Stock Management**: Track stock entries, supplier info, partial payments
- **Order Management**: View all orders, update status, send dispatch confirmations
- **Employee Management**: Add employees, set salaries
- **Attendance Tracking**: Mark daily attendance, view monthly summaries
- **Customer Messaging**: Reply to customer inquiries
- **Dashboard**: Overview with charts and stats

### 👷 Employee Portal
- **Profile View**: Personal information display
- **Attendance History**: View own attendance records
- **Salary Details**: Monthly salary breakdown with deductions
- **Dashboard**: Personal stats overview

### 🛒 Customer Portal
- **Product Shop**: Browse and search products
- **Shopping Cart**: Add items, update quantities
- **Order Placement**: Checkout with COD or Card payment
- **Order Tracking**: View order history and status
- **Dispatch Approval**: Approve orders before dispatch
- **Contact Admin**: Send messages and get support

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn

### 1. Clone & Install

```bash
cd "shamim oil website"
npm install
```

### 2. Environment Setup

Create a `.env` file:

```env
# Database - PostgreSQL connection string
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shamim_oil_db"

# NextAuth Configuration
NEXTAUTH_SECRET="shamim-oil-depo-super-secret-key-2024-production"
NEXTAUTH_URL="http://localhost:3000"

# Admin PIN for registration
ADMIN_PIN="7676"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Seed sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@shamimoil.com | admin123 |
| **Employee** | ali@shamimoil.com | employee123 |
| **Employee** | ahmed@shamimoil.com | employee123 |
| **Customer** | customer@example.com | customer123 |
| **Customer** | fatima@example.com | customer123 |

**Admin Registration PIN**: `7676`

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login & Register pages
│   │   ├── login/
│   │   └── register/
│   ├── admin/            # Admin portal
│   │   ├── products/
│   │   ├── stock/
│   │   ├── orders/
│   │   ├── employees/
│   │   ├── attendance/
│   │   └── messages/
│   ├── employee/         # Employee portal
│   │   ├── profile/
│   │   ├── attendance/
│   │   └── salary/
│   ├── customer/         # Customer portal
│   │   ├── shop/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── messages/
│   └── api/              # API routes
│       ├── auth/
│       ├── products/
│       ├── orders/
│       ├── stock/
│       ├── employees/
│       ├── attendance/
│       ├── cart/
│       └── messages/
├── components/
│   ├── ui/               # ShadCN components
│   ├── Sidebar.tsx
│   ├── StockChart.tsx
│   └── ...
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── validations.ts
└── types/
    └── index.ts
```

## 🎨 Theme Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Gold** | #D4AF37 | Primary accent, buttons, highlights |
| **Forest Green** | #074C2A | Brand color, sidebar, headers |
| **White** | #FFFFFF | Background, cards |

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth handlers
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products` - Update product (Admin)
- `DELETE /api/products?id=` - Delete product (Admin)

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order (Customer)
- `PUT /api/orders` - Update order status
- `DELETE /api/orders?id=` - Cancel order

### Stock
- `GET /api/stock` - List stock entries (Admin)
- `POST /api/stock` - Add stock entry (Admin)
- `POST /api/stock/payment` - Add stock payment (Admin)

### Employees
- `GET /api/employees` - List employees (Admin)
- `POST /api/employees` - Add employee (Admin)
- `DELETE /api/employees?id=` - Delete employee (Admin)

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance (Admin)

### Cart
- `GET /api/cart` - Get cart (Customer)
- `POST /api/cart` - Add to cart (Customer)
- `PUT /api/cart` - Update cart item (Customer)
- `DELETE /api/cart?itemId=` - Remove item (Customer)

### Messages
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message / Reply

## 🔧 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint

npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to DB
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio
```

## 🛡️ Security Features

- Password hashing with bcrypt (12 rounds)
- JWT-based authentication
- Role-based access control (RBAC)
- Server-side session validation
- Protected API routes
- Input validation with Zod

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Made with ❤️ for Shamim Oil Depo**

