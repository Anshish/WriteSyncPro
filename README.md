# WriteSyncPro 

#### [Check Depl0yment Here](https://write-sync-pro.vercel.app/)
WriteSyncPro is a collaborative document editing application with real-time synchronization. Users can create, edit, and share documents seamlessly.

## Features

- Real-time document collaboration
- Rich text editing with formatting options using [React Quill](https://quilljs.com/)
- Create and manage multiple documents
- User-friendly interface

## Technologies Used

- React for the frontend, deployed on [Vercel](https://vercel.com/)
- Node.js and Express for the backend, deployed on [Render](https://render.com/)
- PostgreSQL database provided by [Supabase](https://supabase.io/)
- Socket.io for real-time communication

## Getting Started

### Prerequisites

- Node.js installed
- PostgreSQL installed and configured
- Supabase account for the database setup
- Vercel account for frontend deployment
- Render account for backend deployment

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/writesyncpro.git
   
2. Install dependencies

   ```bash
   cd ./client
   npm install
  
   cd ./server
   npm install

3. Create env file in server directory and set required env variables

   ```bash
   PG_URL=your_supabase_postgres_connection_string

4. Run development server

   ```bash
   cd ./client
   npm start
    
   cd ./server
   npm start

5. Access the application at `http://localhost:3000`.

### Usage

1. Visit the homepage to view and create documents.
2. Click on a document to start editing in real-time.
3. Make changes, and they will be synchronized across all connected clients.

### Demo Link

[Google Drive](https://drive.google.com/file/d/1_MrS4Hn89O7x6z_1zSzt0NWJFhsF-l3P/view?usp=sharing)



