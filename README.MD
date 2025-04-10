# Mental Health Chatbot

A mental health support web application designed to provide compassionate AI-driven assistance and resources. The platform leverages Gemini 2.5 Pro, secure authentication, and MongoDB for data storage.

## Technology Stack

- Node.js backend with Express
- MongoDB Atlas for data storage
- Google Gemini AI for conversational support
- JWT-based authentication
- Sentiment analysis for mental health contexts

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ```

4. Start the application:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/logout` - Logout user
- `GET /api/users/me` - Get current user

### Chatbot
- `POST /api/chat/message` - Send a message to the chatbot
- `GET /api/chat/history` - Get user's chat history
- `DELETE /api/chat/history` - Clear chat history

## Features

- Mental health-focused AI responses
- Sentiment analysis (neutral, positive, negative, anxiety, depression, stress)
- Crisis content detection
- Secure user authentication
- Chat history storage
- Pagination support for chat history