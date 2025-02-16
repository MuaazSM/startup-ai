// src/App.jsx
import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { role: "user", content: input };
      setMessages([...messages, userMessage]);

      // Simulate chatbot response (replace with actual API call)
      const botMessage = { role: "bot", content: "Hello! How can I help you today?" };
      setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);

      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Chatbot</h1>
      </header>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.role === "user" ? "user" : "bot"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
