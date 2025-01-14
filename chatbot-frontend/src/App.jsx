import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hi, I'm your ARC AI Chatbot! How can I assist you today?",
      sender: "bot",
    },
  ]);
  const [typing, setTyping] = useState(false); 

  const sendQuery = async () => {
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { text: query, sender: "user" }]);
    setQuery(""); 
    setTyping(true); 

    try {
      const response = await axios.post("http://127.0.0.1:5000/chat", {
        query,
      });
      setMessages((prev) => [
        ...prev,
        { text: response.data.response, sender: "bot" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Error communicating with chatbot.", sender: "bot" },
      ]);
      console.error(error);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendQuery();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg h-full flex flex-col">
        <h1 className="text-2xl font-bold text-center p-4 border-b border-gray-300">
          ARC AI Chat
        </h1>
        <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <img
                  src="https://media.istockphoto.com/id/2158683000/vector/chat-bot-vector-icon.jpg?s=612x612&w=0&k=20&c=ACzE9Oi5WsYRd3PwaJD2Kcf3DbLpIKiWqSS3vS4806A="
                  alt="Bot Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <p
                className={`inline-block px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </p>
            </div>
          ))}
          {/* Typing Indicator */}
          {typing && (
            <div className="mb-2 flex justify-start items-center">
              <img
                src="https://media.istockphoto.com/id/2158683000/vector/chat-bot-vector-icon.jpg?s=612x612&w=0&k=20&c=ACzE9Oi5WsYRd3PwaJD2Kcf3DbLpIKiWqSS3vS4806A="
                alt="Bot Avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-400"></div>
              </div>
            </div>
          )}
        </div>
        <div className="flex p-4 border-t border-gray-300">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your query..."
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={sendQuery}
            className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
