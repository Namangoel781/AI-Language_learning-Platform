AI Language Learning Platform 🌐📚

An innovative platform designed to make language learning easier and more engaging using AI-powered tools. This project leverages Node.js and Supabase for a robust backend and provides seamless authentication features, including Google OAuth.

🌟 Features

Personalized Learning: Users can choose their native language and the language they want to learn.
AI-Powered Assistance: Advanced tools to enhance vocabulary, grammar, and pronunciation learning.
Trial Access: Non-logged-in users can access a limited trial version to explore the platform.
Secure Authentication: Integrated with Google OAuth for secure user login.
Session Persistence: Smooth session tracking for seamless user experience.
Scalable Backend: Built with clean, modular architecture using controllers, middleware, routes, and models.


🚀 Technologies Used

Backend
Node.js: Backend runtime for efficient server-side logic.
Supabase: Database and authentication management.
Redis
Passport.js: Google OAuth authentication.

Frontend
React.js (or your preferred framework/library): For building a responsive, user-friendly interface.
Deployment
Hosting platform (e.g., Vercel, Heroku, AWS, or Netlify).


🛠️ Installation

Clone the Repository

git clone https://github.com/yourusername/AI-Language-Learning-Platform.git

npm install

Set Up Environment Variables
Create a .env file in the root directory and configure the following variables:

env

SUPABASE_URL=your_supabase_url  
SUPABASE_KEY=your_supabase_key  
GOOGLE_CLIENT_ID=your_google_client_id  
GOOGLE_CLIENT_SECRET=your_google_client_secret  
SESSION_SECRET=your_session_secret  
Run the Application

npm start
Access the Platform
Open your browser and navigate to http://localhost:3000.

📂 Project Structure

├── controllers/      # Contains application logic  
├── middleware/       # Middleware for request validation and authentication  
├── models/           # Database models and schema  
├── routes/           # API routes for the platform  
├── public/           # Static assets for the frontend  
├── views/            # Templates (if applicable)  
├── config/           # Configuration files (e.g., Passport)  
├── .env              # Environment variables  
├── app.js            # Main application entry point  
├── package.json      # Dependencies and scripts  


💡 How It Works

User Registration: Users sign up or log in with Google OAuth.
Language Selection: Choose a native language and a target language to learn.
Trial Version: Unauthenticated users can explore limited features.
Learning Modules: Personalized content to aid in language learning.


🧑‍💻 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.


📧 Contact

If you have any questions, feel free to reach out:

Email: dev.naman555@gmail.com

