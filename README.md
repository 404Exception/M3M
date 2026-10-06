# M3M Properties — Luxury Real Estate & Portfolio Management Portal

An ultra-luxury, full-stack real-estate portal and executive management system dedicated to **M3M India** iconic developments across prime Gurugram corridors (*Golf Course Extension Road, Southern Peripheral Road, Dwarka Expressway, Golf Course Road, and New Gurugram*).

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Node.js Express**, **Prisma ORM**, and **PostgreSQL** (with raw DB fallback support).

---

## 📑 Table of Contents

- [1. Brand Overview & Portfolios](#1-brand-overview--portfolios)
  - [The M3M Portfolio Architecture (34 Projects)](#the-m3m-portfolio-architecture-34-projects)
  - [End-User (Investor / Buyer) Journey](#end-user-investor--buyer-journey)
  - [Executive Portal Workflow](#executive-portal-workflow)
- [2. Technical Architecture & Flows](#2-technical-architecture--flows)
  - [System Architecture Diagram](#system-architecture-diagram)
  - [Data & Request Lifecycle](#data--request-lifecycle)
  - [Tech Stack](#tech-stack)
- [3. Database Schema & Data Models](#3-database-schema--data-models)
- [4. API Reference](#4-api-reference)
  - [Public Endpoints](#public-endpoints)
  - [Admin Protected Endpoints](#admin-protected-endpoints)
- [5. Environment Variables](#5-environment-variables)
- [6. Getting Started & Development](#6-getting-started--development)
  - [Step-by-Step Installation](#step-by-step-installation)
  - [Database Seeding & Studio](#database-seeding--studio)
  - [Available Scripts](#available-scripts)
- [7. Project Directory Structure](#7-project-directory-structure)

---

## 1. Brand Overview & Portfolios

### The M3M Portfolio Architecture (34 Projects)

The platform is structured into four distinct development categories:

#### 1. Residential Portfolios (15 Projects)
- **M3M Altitude** — Ultra-luxury sky mansions on Golf Course Extn Rd
- **M3M Golf Hills** — Golf-themed residences on Golf Course Extn Rd
- **M3M Antalya Hills** — Low-rise luxury floors on SPR, Sector 79
- **M3M OPUS** — Signature luxury tower residences on Golf Course Extn Rd
- **M3M Soulitude** — Boutique low-rise boutique floors on SPR, Sector 89
- **M3M Fairway West** — Ultra-luxury golf suites on Golf Course Extn Rd
- **M3M Skycity** — High-rise urban residences on Golf Course Extn Rd
- **M3M Polo Suites** — Polo-themed equestrian penthouses on Golf Course Extn Rd
- **M3M Merlin** — Singapore-style luxury high-rise on Golf Course Extn Rd
- **M3M Latitude** — Iconic rooftop crystal tower on Golf Course Extn Rd
- **M3M Woodshire** — Serene green residential enclave on Dwarka Expressway
- **M3M Marina** — Waterfront-inspired resort living in Sector 68, Sohna Rd
- **M3M St. Andrews** — Private golf suites on Golf Course Extn Rd
- **M3M SkySuites** — Ultra-luxury rooftop penthouses on Golf Course Extn Rd
- **M3M Panorama Suites** — Panoramic golf view residences on Golf Course Extn Rd

#### 2. Retail Portfolios (14 Projects)
- **M3M Jewel** — Flagship ultra-luxury high-street on MG Road
- **M3M Urbana** — California-style high-street retail on Golf Course Extn Rd
- **M3M Broadway** — Multi-faceted commercial hub on Golf Course Extn Rd
- **M3M 65th Avenue** — Grand luxury retail avenue on Golf Course Extn Rd
- **M3M Prive73** — High-street retail and gourmet boulevard on SPR, Sector 73
- **M3M Paragon57** — Open-air boutique commercial plaza on Golf Course Extn Rd
- **M3M Route65** — High-street retail destination on Golf Course Extn Rd
- **M3M Atrium57** — Triple-height retail promenade on Golf Course Extn Rd
- **M3M Corner Walk** — Corner commercial boulevard on Golf Course Extn Rd
- **M3M Cosmopolitan** — Trendy retail and dining destination on Golf Course Extn Rd
- **M3M Tee Point** — Dual-tower retail & commercial complex on Golf Course Extn Rd
- **M3M IFC** — International Financial Center luxury retail on Golf Course Extn Rd
- **M3M 84Market** — Thriving neighborhood retail destination in Sector 84
- **M3M Innovation Park** — Future-ready commercial & tech campus on Golf Course Extn Rd

#### 3. Office Portfolios (4 Projects)
- **M3M Jewel** — Grade-A corporate suites & executive offices on MG Road
- **M3M Tee Point** — Grade-A modern workspace towers on Golf Course Extn Rd
- **M3M CFC** — Corporate Financial Center grade-A corporate suites on SPR
- **M3M IFC** — LEED Gold-rated international financial corporate suites on Golf Course Extn Rd

#### 4. Serviced Apartments (1 Project)
- **M3M 57Suites** — 5-star hospitality serviced suites on Golf Course Extn Rd

---

### End-User (Investor / Buyer) Journey

```mermaid
flowchart TD
    A[Visitor Lands on M3M Homepage] --> B{Browse by Category or Corridor}
    B -->|Category Filter| C[Residential / Retail / Office / Serviced Apartments]
    B -->|Prime Corridor| D[Golf Course Extn Rd, SPR, Dwarka Exp, MG Road]
    B -->|Research & Insights| E[Market Intelligence & Investment Reports]
    
    C --> F[Project Listing & Showcase]
    D --> F
    
    F --> G[Project Details Page]
    G --> H[Inspect Unit Typologies & Super Area]
    G --> I[View High-Res Renders & Aerial Video Tour]
    G --> J[View Google Maps Pin & Corridor Frontage]
    
    H & I & J --> K{Call to Action}
    K -->|Private Concierge| L[Instant VIP Telephone Concierge]
    K -->|Instant Brochure| M[WhatsApp Kit with Pre-filled Project Title]
    K -->|Experion Center| N[Schedule Private Lounge Walkthrough]
```

---

### Executive Portal Workflow

```mermaid
flowchart TD
    A[Executive Login] --> B[JWT Authentication]
    B --> C[M3M Executive Dashboard]
    
    C --> D[Manage 34 Flagship Projects]
    C --> E[Manage Prime Corridors]
    C --> F[Manage Market Intelligence / Blogs]
    C --> G[Global Concierge & System Settings]
    
    D --> D1[Add / Edit Project Specifications]
    D1 --> D2[Upload Renders & Walkthrough Video URLs]
    D1 --> D3[Set Category: Residential, Retail, Office, Serviced Apartments]
    D1 --> D4[Configure Unit Typologies, Super Area & Pricing]
```

---

## 2. Technical Architecture & Flows

### System Architecture Diagram

```mermaid
graph TB
    subgraph Client ["Client Layer (Browser)"]
        ReactApp["React 19 SPA (Vite + Tailwind CSS v4)"]
        Router["React Router v7 (Public & Executive Routes)"]
        APIClient["API Service Layer (src/services/api.ts)"]
    end

    subgraph Server ["Backend Layer (Node.js + Express)"]
        ExpressApp["Express Application (server.ts)"]
        AuthMid["JWT Authentication Middleware"]
        UploadMid["Multer Storage Engine (/public/uploads)"]
        PublicRoutes["Public Router (/api/public/*)"]
        AdminRoutes["Admin Router (/api/admin/*)"]
        DataRepo["Data Repository (dataRepository.ts)"]
    end

    subgraph Data ["Data Layer"]
        Prisma["Prisma ORM Client"]
        Postgres[(PostgreSQL Database)]
        JSONFallback[("data/db.json Fallback Storage")]
        FileSystem[("Local Uploads (/public/uploads)")]
    end

    ReactApp --> Router
    Router --> APIClient
    APIClient -->|HTTP / JSON / FormData| ExpressApp

    ExpressApp --> PublicRoutes
    ExpressApp --> AuthMid --> AdminRoutes
    ExpressApp --> UploadMid --> FileSystem

    PublicRoutes --> DataRepo
    AdminRoutes --> DataRepo
    DataRepo --> Prisma
    DataRepo -.-> JSONFallback
    Prisma --> Postgres
```

---

### Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | React 19, TypeScript | Modern luxury architectural UI component architecture |
| **Styling** | Tailwind CSS v4 | Obsidian slate (`#0b0f19`), Champagne gold (`#d4af37`), Platinum cards |
| **Routing** | React Router v7 | Client-side routing with protected executive portal layouts |
| **Icons & UI** | Lucide React, Motion | Ultra-refined icons and luxury animations |
| **Backend** | Node.js, Express, TypeScript | RESTful API server with multi-category querying |
| **Database & ORM** | PostgreSQL, Prisma ORM, JSON fallback | Relational database schema with file-based persistence fallback |
| **Security** | JWT, bcryptjs | Stateless auth tokens and password hashing |
| **Tooling** | Vite, esbuild | Instant HMR and fast production bundling |

---

## 3. Database Schema & Data Models

Defined in [`prisma/schema.prisma`](file:///c:/Projects/M3M/prisma/schema.prisma) and represented in [`data/db.json`](file:///c:/Projects/M3M/data/db.json):

```mermaid
erDiagram
    Location ||--o{ Site : "has many"
    Site ||--o{ SiteImage : "has many"
    Site ||--o{ PlotSize : "has many"

    Location {
        string id PK
        string name
        string slug UK
        string city
        string state
        string imageUrl
        boolean isActive
    }

    Site {
        string id PK
        string locationId FK
        string name
        string slug UK
        string address
        string description
        string googleMapsUrl
        float latitude
        float longitude
        string siteType "Residential | Retail | Office | Serviced Apartments"
        string startingPrice
        string features
        string locationAdvantages
        string videoUrl
        string status
        boolean isPublished
    }

    SiteImage {
        string id PK
        string siteId FK
        string imageUrl
        boolean isCover
        int displayOrder
    }

    PlotSize {
        string id PK
        string siteId FK
        string plotSize "Unit Typology"
        string area "Super / Carpet Area"
        string price
        string status
    }

    BlogPost {
        string id PK
        string title
        string slug UK
        string excerpt
        string content
        string coverImage
        string author
        string category
        string readTime
        string tags
        boolean isPublished
    }
```

---

## 4. API Reference

### Public Endpoints (`/api/*`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Returns all 4 development categories with live project counts |
| `GET` | `/api/locations` | List prime corridors with published project counts |
| `GET` | `/api/locations/:slug/sites` | Get corridor details and its published developments |
| `GET` | `/api/sites` | Filter & search published projects (`siteType`/`category`, `location`, `status`, `search`) |
| `GET` | `/api/sites/:slug` | Get full details of an M3M project by slug |
| `GET` | `/api/blogs` | Get published market intelligence & research reports |
| `GET` | `/api/blogs/categories` | Get unique categories of published intelligence |
| `GET` | `/api/blogs/:slug` | Get article content and markdown by slug |
| `GET` | `/api/settings` | Get concierge contact information and Experion lounge details |

---

### Admin Protected Endpoints (`/api/admin/*`)
*Requires `Authorization: Bearer <token>` header.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/admin/auth/login` | Authenticate executive with email/password |
| `GET` | `/api/admin/auth/me` | Verify JWT and return current executive user |
| `POST` | `/api/admin/auth/change-password` | Change current executive account password |
| `GET` | `/api/admin/dashboard` | Aggregated metrics across categories and corridors |
| `GET` | `/api/admin/sites` | List all projects (filtered by category/location) |
| `POST` | `/api/admin/sites` | Create a new project with renders & unit inventory |
| `GET` | `/api/admin/sites/:id` | Get project details by ID |
| `PUT` | `/api/admin/sites/:id` | Update project, unit configurations, and renders |
| `DELETE` | `/api/admin/sites/:id` | Delete project record |
| `POST` | `/api/admin/upload` | Upload image file (returns `/uploads/...` URL) |

---

## 5. Environment Variables

Create a `.env` file in the root directory:

```env
# ----------------------------------------
# DATABASE & SERVER CONFIGURATION
# ----------------------------------------
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/m3m_db?schema=public"
JWT_SECRET="m3m_luxury_jwt_secure_key_2025"

# ----------------------------------------
# PUBLIC CONCIERGE & EXPERION CENTER SETTINGS
# ----------------------------------------
VITE_DEFAULT_PHONE_NUMBER="+91 99999 88888"
VITE_DEFAULT_WHATSAPP_NUMBER="+91 99999 88888"
VITE_CONTACT_EMAIL="concierge@m3mproperties.in"
VITE_OFFICE_ADDRESS="M3M Experion Centre, Golf Course Extension Road, Sector 65, Gurugram, Haryana - 122018"
```

---

## 6. Getting Started & Development

### Step-by-Step Installation

1. **Install project dependencies**:
   ```bash
   npm install
   ```

2. **Seed initial database with all 34 M3M projects**:
   ```bash
   npm run db:seed
   ```
   > **Default Executive Credentials**:
   > - **Email**: `admin@deendayalawaas.com`
   > - **Password**: `Admin@123`

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   - Public Website: **`http://localhost:3000`**
   - Executive Portal: **`http://localhost:3000/admin`**

---

### Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Express & Vite development server with auto-reloading (`tsx watch`) |
| `npm run build` | Builds client assets with Vite and bundles server with esbuild into `dist/` |
| `npm run start` | Runs the production-compiled server (`dist/server.cjs`) |
| `npm run lint` | Runs TypeScript type checking without emitting files (`tsc --noEmit`) |
| `npm run db:seed` | Seeds all 34 M3M developments across 4 categories and executive settings |
| `npm run db:push` | Synchronizes Prisma schema directly with the PostgreSQL database |
| `npm run db:studio` | Launches visual Prisma Studio interface in browser |

---

## 7. Project Directory Structure

```text
M3M/
├── backend/
│   └── src/
│       ├── db/
│       │   └── prisma.ts            # Prisma client instance & DB health check
│       ├── middleware/
│       │   └── auth.ts              # JWT verification middleware
│       ├── repositories/
│       │   └── dataRepository.ts    # Direct Prisma & JSON fallback repository operations
│       ├── routes/
│       │   ├── adminRoutes.ts       # Protected executive API routes
│       │   └── publicRoutes.ts      # Public visitor API routes
│       ├── scripts/
│       │   └── seedDatabase.ts      # Database seeding script
│       ├── utils/
│       │   └── storage.ts           # Multer disk upload configuration
│       └── types.ts                 # Backend data interfaces
├── data/
│   └── db.json                      # Seeded database with 34 M3M projects across 4 categories
├── prisma/
│   └── schema.prisma                # Database schema & entity definitions
├── public/
│   └── uploads/                     # Uploaded property renders and video banners
├── src/
│   ├── admin/                       # Executive Portal Pages & Components
│   │   ├── AdminBlogFormPage.tsx    # Market report editor & publisher
│   │   ├── AdminBlogsListPage.tsx   # Market reports management table
│   │   ├── AdminDashboardPage.tsx   # Executive metrics and analytics
│   │   ├── AdminLayout.tsx          # Executive sidebar and protected route wrapper
│   │   ├── AdminLocationsPage.tsx   # Prime corridor manager
│   │   ├── AdminLoginPage.tsx       # Executive authentication screen
│   │   ├── AdminSettingsPage.tsx    # Concierge & Experion Center settings
│   │   ├── AdminSiteFormPage.tsx    # Project & Unit inventory editor
│   │   └── AdminSitesListPage.tsx   # Filterable 34-project inventory table
│   ├── components/                  # Shared UI components (Navbar, Footer, SiteCard, SEO)
│   ├── pages/                       # Public Website Pages
│   │   ├── HomePage.tsx             # Luxury landing hero, 4-category switcher, corridor cards
│   │   ├── LocationsPage.tsx        # Prime corridor explorer & category filter
│   │   ├── SiteListingPage.tsx      # Filterable portfolio listing
│   │   ├── SiteDetailsPage.tsx      # Detailed project showcase, unit specs, video walkthrough
│   │   ├── BlogsPage.tsx            # Market intelligence & investment insights
│   │   ├── BlogDetailsPage.tsx      # Analysis report view
│   │   ├── ContactPage.tsx          # VIP Experion Center booking & concierge details
│   │   └── AboutPage.tsx            # M3M brand legacy & 4 development pillars
│   ├── services/
│   │   └── api.ts                   # Centralized frontend API client
│   ├── App.tsx                      # App root with routing table
│   ├── index.css                    # Tailwind CSS imports & luxury design tokens
│   ├── main.tsx                     # React client entry point
│   └── types.ts                     # Frontend TypeScript interfaces
├── .env                             # Environment variables
├── package.json                     # Scripts & project dependencies
├── server.ts                        # Express server entry point
├── tsconfig.json                    # TypeScript compiler configuration
└── vite.config.ts                   # Vite configuration
```
