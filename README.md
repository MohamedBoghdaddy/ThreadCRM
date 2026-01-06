# ThreadCRM

This repository contains the full-stack **ThreadCRM** application built with **Expo (React Native)** and a **Node.js/Express** backend using **MongoDB** and **Socket.IO**.

## Features

- **Mobile app** powered by Expo, using Tailwind CSS via NativeWind for modern styling.
- **Backend API** with Express, Mongoose models and JWT authentication.
- **CRM dashboard** for managing leads and viewing stats.
- **Real-time chat** using Socket.IO rooms.

## Getting started

1. Install dependencies in both `server` and `mobile`:
   ```bash
   cd server && npm install
   cd ../mobile && npm install
   ```
2. Create a `.env` file in `server` with `PORT`, `MONGO_URI` and `JWT_SECRET` variables.
3. Replace `YOUR_LOCAL_IP` in `mobile/src/api/client.ts` and `mobile/src/realtime/socket.ts` with your local machine's IP.
4. Start the backend:
   ```bash
   cd server
   npm run dev
   ```
5. Start the mobile app:
   ```bash
   cd mobile
   npx expo start
   ```

For detailed setup and features, see the source code and comments.
