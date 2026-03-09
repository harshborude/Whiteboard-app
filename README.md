# Collaborative Whiteboard Application

##  Overview
The Collaborative Whiteboard Application is a robust, full-stack platform designed to facilitate visual communication and real-time idea mapping. It provides users with a digital canvas where they can freely draw, add text, create shapes, and organize their thoughts.

##  The Problem It Solves
Traditional physical whiteboards are constrained by location and space. Remote teams, educators, and students often struggle to visualize and collaborate on diagrams, workflows, or mind maps efficiently over standard video calls or text chats. 

This application bridges that gap by offering a centralized, cloud-accessible whiteboard. Furthermore, it completely eliminates the barrier of isolation by introducing **Canvas Sharing**. A user can instantly send access requests to colleagues via email. Once accepted, those colleagues can view and actively edit the same canvas. It ensures everyone is on the same page—literally!

##  Tech Stack
- **Frontend**: React.js, TailwindCSS, Rough.js (for hand-drawn style graphics)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt

---

##  Installation & Setup

### Prerequisites
Before running the application, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or via MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Whiteboard-app.git
cd Whiteboard-app
```

### 2. Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory and define your environment variables:
   ```env
   PORT=3030
   MONGO_URI=mongodb://localhost:27017/whiteboard # Or your Atlas connection string
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(The server will typically run on `http://localhost:3030`)*

### 3. Frontend Setup
1. Open a new terminal window and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Frontend` directory (if required) to map your API URL:
   ```env
   REACT_APP_API_URL=http://localhost:3030
   ```
4. Start the React development server:
   ```bash
   npm start
   ```
   *(The application will open in your browser at `http://localhost:3000`)*

---

##  API Endpoints Documentation

All routes expect header `{ Authorization: "Bearer <token>" }` unless specified otherwise.

### User Authentication Endpoints (`/user`)

| Method | Endpoint | Description | Body / Payload |
| :--- | :--- | :--- | :--- |
| **POST** | `/user/register` | Registers a new user. *(No Auth required)* | `{ name, email, password }` |
| **POST** | `/user/login` | Authenticates a user and returns a JWT. *(No Auth required)* | `{ email, password }` |
| **GET**  | `/user/profile` | Retrieves the authenticated user's profile data. | *None* |

### Canvas Management Endpoints (`/canvas`)

| Method | Endpoint | Description | Body / Payload |
| :--- | :--- | :--- | :--- |
| **POST** | `/canvas/` | Creates a new empty canvas. Enforces unique names. | `{ name }` |
| **GET**  | `/canvas/` | Retrieves all canvases owned by or shared with the user. | *None* |
| **GET**  | `/canvas/load/:id` | Loads the specific data/elements of a canvas by its ID. | *None* |
| **PUT**  | `/canvas/:id` | Updates/Saves the elements drawn on the canvas. | `{ elements: [...] }` |
| **DELETE**| `/canvas/:id` | Deletes a canvas entirely. *(Restricted to Owner)* | *None* |

### Canvas Sharing Endpoints (`/canvas`)

| Method | Endpoint | Description | Body / Payload |
| :--- | :--- | :--- | :--- |
| **POST** | `/canvas/share/:id` | Sends an email request to collaborate on a canvas. | `{ targetEmail }` |
| **GET**  | `/canvas/requests` | Fetches all pending incoming share requests for the user. | *None* |
| **POST** | `/canvas/accept/:id` | Accepts a share request and grants the user edit access. | *None* |
| **POST** | `/canvas/reject/:id` | Rejects and deletes the share request for the canvas. | *None* |

---
