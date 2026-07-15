# 🐾 Animal Rescue Request Board (MERN Stack)

A full-stack app where people can report injured or stranded animals with a location
and photo. NGOs/volunteers can browse open requests, claim them, and update status
through the rescue lifecycle.

## Tech Stack
- **Frontend:** React (Create React App), Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **File uploads:** Multer (stores photos in `backend/uploads`)

## Project Structure
```
animal-rescue-board/
├── backend/
│   ├── config/db.js
│   ├── controllers/rescueController.js
│   ├── middleware/upload.js
│   ├── models/RescueRequest.js
│   ├── routes/rescueRoutes.js
│   ├── uploads/            # uploaded photos (gitignored)
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── api/api.js
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── RequestForm.js
    │   │   ├── RequestList.js
    │   │   └── RequestCard.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── .env.example
    └── package.json
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend
```bash
cd backend
cp .env.example .env     # edit MONGO_URI if needed
npm install
npm run dev              # starts on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm start                 # starts on http://localhost:3000
```

## API Endpoints

| Method | Endpoint                     | Description                          |
|--------|-------------------------------|---------------------------------------|
| POST   | /api/requests                 | Create a new rescue request (photo upload via `photo` field) |
| GET    | /api/requests                 | Get all requests (optional `?status=` filter) |
| GET    | /api/requests/:id              | Get a single request |
| PUT    | /api/requests/:id              | Edit request details |
| PATCH  | /api/requests/:id/claim        | Claim a request (volunteer/NGO assigns self) |
| PATCH  | /api/requests/:id/status        | Update status (pending → claimed → in-progress → rescued → closed) |
| DELETE | /api/requests/:id              | Delete a request |

## Data Model
```js
{
  animalType: String,
  description: String,
  reporterName: String,
  contactNumber: String,
  location: { address: String, lat: Number, lng: Number },
  photoUrl: String,
  status: "pending" | "claimed" | "in-progress" | "rescued" | "closed",
  claimedBy: { name, organization, contactNumber },
  urgency: "low" | "medium" | "high" | "critical",
  createdAt, updatedAt
}
```

## Possible Extensions
- Auth (JWT) so only logged-in NGOs/volunteers can claim requests
- Google Maps integration to visualize requests on a map
- Push/SMS notifications to nearby volunteers when a new request is posted
- Image storage on S3/Cloudinary instead of local disk
