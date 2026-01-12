# GigFlow - Copilot Instructions

## Project Overview
GigFlow is a freelance marketplace with a React/Vite frontend and Express/MongoDB backend. Users can post gigs (clients) and bid on them (freelancers).

## Architecture

### Monorepo Structure
```
/client   → React 19 + Vite + Redux Toolkit + Tailwind CSS
/server   → Express.js + Mongoose (MongoDB)
```

### Data Flow
1. **Authentication**: Cookie-based JWT tokens (`httpOnly`, stored via `res.cookie`)
2. **API Communication**: Axios instance at `client/src/api/axios.js` with `withCredentials: true`
3. **State Management**: Redux Toolkit for auth only (`authSlice.js`); component-local state for data fetching

### Core Domain Models (server/models/)
- **User**: `name`, `email`, `password` (auto-hashed via pre-save middleware)
- **Gig**: `title`, `description`, `budget`, `status` (open|assigned|completed), `ownerId`, `hiredFreelancerId`
- **Bid**: `gigId`, `freelancerId`, `message`, `price`, `status` (pending|hired|rejected)

## Developer Workflows

### Running Locally
```bash
# Terminal 1 - Backend (requires MONGO_URI and JWT_SECRET in .env)
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```
Server runs on `:5000`, client on `:5173`. CORS is preconfigured for this setup.

### Environment Variables (server/.env)
```
MONGO_URI=<mongodb-connection-string>
JWT_SECRET=<your-secret>
PORT=5000
```

## Code Patterns & Conventions

### Backend Route Pattern
All routes follow: validation → business logic → response
```javascript
// Protected routes use: router.post('/', protect, async (req, res) => {...})
// Auth middleware attaches user: req.user._id
```

### Atomic Operations
The hire endpoint (`PATCH /api/bids/:bidId/hire`) uses `findOneAndUpdate` with status condition to prevent race conditions:
```javascript
await Gig.findOneAndUpdate(
    { _id: bid.gigId, status: 'open' },  // Only if still open
    { status: 'assigned', hiredFreelancerId: bid.freelancerId },
    { new: true }
);
```

### Frontend Component Pattern
- Pages fetch data in `useEffect`, store in local state
- API calls use the shared `api` instance from `src/api/axios.js`
- Styling uses Tailwind with custom clay-morphism classes (`clay-card`, `clay-btn`, `clay-input`)

### Authentication Flow
1. Login/Register → Server sets `token` cookie → Response returns user object
2. Client dispatches `loginSuccess(user)` to Redux
3. Protected API calls auto-include cookie via `withCredentials: true`
4. Logout clears cookie server-side and dispatches `logout()` action

## Key Files Reference
| Purpose | File |
|---------|------|
| API routes mounting | `server/server.js` |
| Auth middleware | `server/middleware/authMiddleware.js` |
| Axios config | `client/src/api/axios.js` |
| Redux store | `client/src/store/store.js` |
| Route definitions | `client/src/App.jsx` |

## Important Notes
- No transactions: MongoDB operations are non-transactional; atomic updates handle concurrency
- Gig owners cannot bid on their own gigs (validated in `POST /api/bids`)
- Bids are auto-rejected when another bid is hired (bulk `updateMany` in hire endpoint)
