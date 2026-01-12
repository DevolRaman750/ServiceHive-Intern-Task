# 🚀 GigFlow - Freelance Marketplace Platform

A mini-freelance marketplace where **Clients** can post jobs (Gigs) and **Freelancers** can apply for them (Bids). Built with modern web technologies featuring real-time notifications and atomic hiring logic.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socketdotio&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Feature Checklist](#-feature-checklist)

---

## ✨ Features

### 🔐 Authentication
- Secure Sign-up and Login with JWT
- HttpOnly cookie-based authentication
- Fluid roles: Any user can post jobs (Client) or bid on jobs (Freelancer)

### 📝 Gig Management
- Browse all open gigs in a public feed
- Search gigs by title
- Post new jobs with Title, Description, and Budget
- View gig details with owner information

### 💼 Bidding System
- Freelancers can submit bids with message and price
- Gig owners can view all bids on their posted jobs
- Bid status tracking (pending, hired, rejected)

### ⚡ Atomic Hiring Logic
- **One-click hire**: Client clicks "Hire" on a specific bid
- **Atomic updates**: Gig status changes from `open` → `assigned`
- **Auto-reject**: All other bids automatically marked as `rejected`
- **Race-condition safe**: Uses MongoDB's `findOneAndUpdate` with status condition

### 🔔 Real-Time Notifications
- Socket.IO integration for live updates
- Bell icon with unread notification badge
- Notification dashboard for all alerts
- Instant "You've been hired!" notifications

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + Vite |
| **Styling** | Tailwind CSS (Clay-morphism design) |
| **State Management** | Redux Toolkit |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT with HttpOnly Cookies |
| **Real-Time** | Socket.IO |
| **Notifications** | React-Toastify |

---

## 📁 Project Structure

```
GigFlow/
├── client/                     # React Frontend
│   ├── public/
│   │   └── asset/images/icon/  # Icons (notification bell)
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Axios instance with credentials
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation with notification bell
│   │   │   ├── BidForm.jsx     # Bid submission form
│   │   │   └── BidList.jsx     # Bids display with hire button
│   │   ├── context/
│   │   │   ├── SocketContext.jsx       # Socket.IO provider
│   │   │   └── NotificationContext.jsx # Notification state
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Gig listing with search
│   │   │   ├── GigDetails.jsx  # Single gig view
│   │   │   ├── CreateGig.jsx   # Post new gig form
│   │   │   ├── MyBids.jsx      # Freelancer's bid history
│   │   │   ├── Notifications.jsx # Notification dashboard
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── store/
│   │   │   ├── store.js        # Redux store
│   │   │   └── authSlice.js    # Auth state management
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                     # Express Backend
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── models/
│   │   ├── User.js             # User schema with password hashing
│   │   ├── Gig.js              # Gig schema
│   │   └── Bid.js              # Bid schema
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── gigRoutes.js        # Gig CRUD endpoints
│   │   └── bidRoutes.js        # Bid & Hire endpoints
│   ├── server.js               # Express + Socket.IO setup
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/gigflow.git
cd gigflow
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in `/server`:
```env
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_key
PORT=5000
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login & set HttpOnly cookie |
| `POST` | `/api/auth/logout` | Logout & clear cookie |

### Gigs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/gigs` | Fetch all open gigs (supports `?search=`) |
| `GET` | `/api/gigs/:id` | Get single gig details |
| `POST` | `/api/gigs` | Create new gig (Protected) |

### Bids
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/bids` | Submit bid for a gig (Protected) |
| `GET` | `/api/bids/my-bids` | Get logged-in user's bids (Protected) |
| `GET` | `/api/bids/:gigId` | Get all bids for a gig (Owner only) |
| `PATCH` | `/api/bids/:bidId/hire` | Hire freelancer - Atomic update (Owner only) |

---

## 🗄 Database Schema

### User
```javascript
{
  name: String,           // Required
  email: String,          // Required, Unique
  password: String,       // Required, Auto-hashed
  createdAt: Date,
  updatedAt: Date
}
```

### Gig
```javascript
{
  title: String,          // Required
  description: String,    // Required
  budget: Number,         // Required
  status: String,         // 'open' | 'assigned' | 'completed'
  ownerId: ObjectId,      // Ref: User
  hiredFreelancerId: ObjectId,  // Ref: User (after hiring)
  createdAt: Date,
  updatedAt: Date
}
```

### Bid
```javascript
{
  gigId: ObjectId,        // Ref: Gig
  freelancerId: ObjectId, // Ref: User
  message: String,        // Required
  price: Number,          // Required
  status: String,         // 'pending' | 'hired' | 'rejected'
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✅ Feature Checklist

### A. User Authentication
- [x] Secure Sign-up with password hashing (bcrypt)
- [x] Secure Login with JWT
- [x] HttpOnly cookie authentication
- [x] Fluid roles: Users can both post gigs and bid

### B. Gig Management (CRUD)
- [x] Browse Gigs: Public feed showing all "Open" jobs
- [x] Search/Filter: Search jobs by title
- [x] Job Posting: Form for logged-in users (Title, Description, Budget)
- [x] View Gig Details: Single gig page with owner info

### C. The "Hiring" Logic (Crucial)
- [x] **Bidding**: Freelancer submits Bid (message + price)
- [x] **Review**: Client sees list of all Bids on their gig
- [x] **Hiring**: Client clicks "Hire" button on specific Bid
  - [x] Gig status changes from `open` → `assigned`
  - [x] Chosen Bid status becomes `hired`
  - [x] All other Bids auto-marked as `rejected`
- [x] **Atomic Updates**: Race-condition safe using `findOneAndUpdate`

> ⚠️ **Note on MongoDB Transactions**: Multi-document transactions are **not available** on MongoDB Atlas Free Tier (M0) as it requires a replica set. This project uses atomic `findOneAndUpdate` operations instead, which provides race-condition safety for the hiring logic without needing transactions.

### D. API Architecture
- [x] `POST /api/auth/register` - Register new user
- [x] `POST /api/auth/login` - Login & set HttpOnly Cookie
- [x] `GET /api/gigs` - Fetch all open gigs (with search)
- [x] `POST /api/gigs` - Create new job post
- [x] `POST /api/bids` - Submit bid for a gig
- [x] `GET /api/bids/:gigId` - Get all bids for gig (Owner only)
- [x] `PATCH /api/bids/:bidId/hire` - Atomic hire logic

### E. Bonus Features Implemented
- [x] Real-time notifications with Socket.IO
- [x] Notification bell with unread badge
- [x] Notification dashboard page
- [x] Toast notifications on hire
- [x] My Bids page for freelancers
- [x] Clay-morphism UI design
- [x] Responsive layout

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **HttpOnly Cookies**: Prevents XSS attacks
- **Protected Routes**: Middleware verification
- **Owner-only Access**: Bid viewing restricted to gig owners
- **Self-bid Prevention**: Users cannot bid on their own gigs

---

## 🎨 UI/UX Highlights

- **Clay-morphism Design**: Soft, 3D-like UI elements
- **Responsive Layout**: Works on all screen sizes
- **Status Indicators**: Color-coded badges for gig/bid status
- **Real-time Updates**: Instant notifications without refresh
- **Confirmation Dialogs**: Prevent accidental hires

---

## 👨‍💻 Author

**Raman Tripathi**


---

