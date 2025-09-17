# ORDER MANAGER APP

This is a full-stack application developed as a test assignment. It consists of a REST API built with Node.js (Express) and a client application using React (Vite).

## Features

- ### **Backend:**

  - Entity Management: `Users`, `Products`, `Orders`.
  - Order creation within `ACID`-compliant transactions in `MongoDB`.
  - Rate limiting (10 requests/min per IP).
  - Event and error logging using `Winston`.
  - Endpoints to fetch lists of users and products.

- ### **Frontend**

  - UI for selecting a user and creating a new order.
  - Displays a list of orders for the selected user.
  - Toast notification system for success and error feedback.
  - Request optimization using debounce logic.

## Tech Stack

- **Backend**: `Node.js`, `Express`, `MongoDB`, `Mongoose`, `Winston`, `express-rate-limit`.
- **Frontend**: `React`, `Vite`, `Axios`, `react-hot-toast`.
- **Development Tools**: `ESLint`, `Nodemon`, `Faker.js`.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- `npm` or `yarn`
- **MongoDB (access to a local server or a free MongoDB Atlas account is required)**
- MongoDB GUI Client (e.g., MongoDB Compass) - recommended

### Backend Setup

1.  **Clone the repository:**

```bash
git clone <YOUR_REPOSITORY_URL>
cd <project_folder_name>/back
```

2. **Install dependencies:**

```bash
npm install
```

3.  **Create a `.env` file** in the root of the `back` folder and fill it with your own MongoDB connection credentials:

```bash
PORT=3000
MONGODB_USER=your_user
MONGODB_PASSWORD=your_password
MONGODB_URL=your_cluster_url
MONGODB_DB=order_management_app
```

4. **(Optional) Seed your database with test data:**

```bash
npm run seed
```

### Frontend Setup

1.  **Navigate to the frontend folder:**

```bash
cd ../front
```

2.  **Install dependencies:**

```bash
npm install
```

3.  **Running the Project:**

To run the application, you need to start both servers simultaneously. It is best to do this in two separate terminal windows.

1. **Start the backend server (in the first terminal, from the `back` folder):**

```bash
npm run dev
```

The server will be available at `http://localhost:3000`.

2. **Start the frontend server (in the second terminal, from the `front` folder):**

```bash
npm run dev
```

The application will be available in your browser at the address provided by Vite `http://localhost:5173`.
