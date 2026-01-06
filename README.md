# ThreadCRM

ThreadCRM is a full‑stack customer relationship management (CRM) and real‑time chat application built with **Expo (React Native)** on the front end and **Node.js/Express** on the back end.  It uses **MongoDB** as its data store and integrates Socket.IO for bi‑directional, real‑time messaging.

This repository contains two top‑level folders:

* `mobile` – the Expo/React Native client application.
* `server` – the Express API and Socket.IO server.

The project is designed to be simple to run in development while remaining production‑ready.  Styling on the mobile client uses **Tailwind CSS** via the [NativeWind](https://www.nativewind.dev/) package, giving the UI a modern, consistent aesthetic with minimal code.  On the back end, common middlewares such as **helmet** and **morgan** are enabled to improve security and observability, and a lightweight error‑handling middleware standardises JSON error responses.

## Features

- **User authentication** – register and sign in with JWT‑based tokens stored securely on device.
- **Dashboard** – view CRM statistics (total leads, hot leads and most recent leads) and manage leads.
- **Chat system** – create threads and send messages in real time via Socket.IO.
- **Responsive UI** – styled with Tailwind CSS via NativeWind for consistent spacing, typography and colours.
- **Production‑ready server** – includes security headers via Helmet, request logging with Morgan, error handling and modular route/controller structure.

## Getting Started

You will need [Node.js](https://nodejs.org/) and [Expo CLI](https://docs.expo.dev/get-started/installation/) installed.  MongoDB is provided via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or your own local MongoDB instance.

### 1. Clone the repository

```bash
git clone https://github.com/MohamedBoghdaddy/ThreadCRM.git
cd ThreadCRM
```

### 2. Install dependencies

Install dependencies in both the server and mobile folders:

```bash
cd server
npm install

cd ../mobile
npm install
```

### 3. Set up environment variables

Create a `.env` file in the `server` directory based on `.env.example` and set your MongoDB connection string and JWT secret:

```env
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/threadcrm
JWT_SECRET=your_jwt_secret
```

### 4. Run the server

From the `server` directory, start the API and Socket.IO server:

```bash
npm run dev
```

The server will listen on the port defined in your `.env` (default `4000`).

### 5. Run the mobile app

From the `mobile` directory, start the Expo development server:

```bash
npx expo start
```

Follow the instructions in the terminal to launch the app on your simulator or physical device.  Make sure to replace `YOUR_LOCAL_IP` in `mobile/src/api/client.ts` and `mobile/src/realtime/socket.ts` with the IP address of your development machine so that the app can talk to the API.

## Directory Structure

```text
expo-crm-chat/
├─ mobile/              # Expo / React Native client
│  ├─ app/              # Expo Router pages (screens)
│  ├─ src/              # API clients, stores, socket wrappers
│  ├─ tailwind.config.js# Tailwind CSS configuration for NativeWind
│  ├─ babel.config.js   # Babel configuration enabling NativeWind
│  └─ package.json      # Mobile dependencies and scripts
├─ server/              # Express API and Socket.IO server
│  ├─ src/              # Application source code
│  │  ├─ controllers/   # Request controllers (business logic)
│  │  ├─ middleware/    # JWT auth and error handling
│  │  ├─ models/        # Mongoose schemas
│  │  ├─ routes/        # Express routes
│  │  ├─ config/        # Database connection helper
│  │  ├─ socket.js      # Socket.IO event handlers
│  │  └─ index.js       # App startup script
│  └─ package.json      # Server dependencies and scripts
└─ README.md            # Project overview and setup guide
```

## Contributing

Contributions are welcome!  Feel free to open issues for bugs or feature requests, and submit pull requests for improvements.

## License

This project is licensed under the **MIT License**.  See [LICENSE](LICENSE) for more information.
