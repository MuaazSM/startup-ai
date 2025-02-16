# Startup Advisor - README

Welcome to **Startup Advisor**, a project designed to provide personalized, AI-powered recommendations and resources to entrepreneurs at various stages of their startup journey. This project integrates OpenAI’s language models with a robust backend to deliver actionable advice, resource links, and analysis based on a user’s startup stage, industry, and challenges.

---

## Features

- **Personalized Recommendations:**  
  Get tailored resources and advice based on your startup’s current stage and industry.

- **Chat Integration:**  
  Engage in natural conversations with our chatbot to gain insights into scaling strategies, funding opportunities, and market trends.

- **Secure User Authentication:**  
  Protect user data with JWT-based authentication. Users can register, log in, and manage their profiles.

- **Contextual Analysis:**  
  Save and retrieve previous analyses for reference. Keep track of what strategies have been recommended and their outcomes.

- **Comprehensive Logging & Error Handling:**  
  Logs are maintained for debugging, monitoring, and ensuring smooth operations. Robust error handling ensures reliability and consistent user experience.

---

## Prerequisites

- **Node.js**:  
  Make sure you have the latest stable version installed.  
  [Download Node.js](https://nodejs.org/)

- **MongoDB**:  
  A running MongoDB instance is required for user authentication, chat history, and recommendation storage.

- **Python Service (for AI):**  
  The project depends on a Python-based service for OpenAI’s language model integration. Ensure the Python service is running and accessible.

---

## Getting Started

1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/yourusername/startup-advisor.git
   cd startup-advisor
   ```

2. **Install Node Dependencies:**  
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**  
   Create a `.env` file in the root directory with the following variables:  
   ```plaintext
   MONGODB_URI=your_mongo_connection_string
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   PYTHON_SERVICE_URL=http://localhost:5000
   ```
   
4. **Run the Backend:**  
   ```bash
   npm start
   ```

5. **Run the Python Service:**  
   Follow the instructions in the Python service directory to start it.

---

## Directory Structure

- **`src/config/`**:  
  Contains database configuration and environment setup files.
  
- **`src/middleware/`**:  
  Includes validation, authentication, and error-handling middleware.

- **`src/models/`**:  
  Defines MongoDB schemas for users, analyses, and startups.

- **`src/routes/`**:  
  Implements API routes for authentication, chatbot interaction, and resource recommendations.

- **`src/utils/`**:  
  Utility functions for formatting responses, logging, and helper methods.

---

## API Endpoints

- **Authentication**  
  - `POST /auth/register`  
  - `POST /auth/login`

- **Chatbot**  
  - `POST /chat/message`  
  - `GET /chat/history`  
  - `DELETE /chat/history`

- **Resources**  
  - `GET /resources/recommendations`  
  - `GET /resources/category/:category`  
  - `POST /resources/save`  
  - `GET /resources/saved`

---

## Contribution Guidelines

If you would like to contribute to Startup Advisor, please fork the repository and submit a pull request. For any questions or issues, open an issue in this repository, and we’ll be happy to assist.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Authors
Team #B068
Muaaz Shaikh
Razeen Saiyed
Suchit Baravkar
