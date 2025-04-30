import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons"; // Import send icon
import "./App.css";

const App: React.FC = () => {
  interface Message {
    role: string;
    content: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent, msg: string, ctx: string) => {
    e.preventDefault();
    setInputPrompt("");

    let newMessages: Message[] = [];

    if (ctx === "input" && msg) {
      newMessages = [...messages, { role: "user", content: `You: ${msg}` }];
      setMessages(newMessages);
    } else if (ctx === "action" && msg) {
      newMessages = [{ role: "user", content: `You: ${msg}` }];
      setMessages(newMessages);
    }

    if (newMessages.length === 0) return;

    const cleanedMessages = newMessages.map((message) => {
      return {
        ...message,
        content: message.content.replace("You: ", "").replace("AI: ", ""),
      };
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/retirement",
        cleanedMessages
      );

      // Parse and clean the response data
      const cleanedResponse = response.data
        .replace(/\\n/g, " ") // Replace escaped newlines with space
        .replace(/\n/g, " ") // Replace newlines with space
        .replace(/\\/g, "") // Remove backslashes
        .replace(/"/g, "") // Remove double quotes
        .replace(/'/g, "") // Remove single quotes
        .replace(/{/g, "") // Remove opening curly braces
        .replace(/}/g, ""); // Remove closing curly braces
      // .replace(/\[/g, "") // Remove opening square brackets
      // .replace(/\]/g, "") // Remove closing square brackets
      // .replace(/,/g, "") // Remove commas
      // .replace(/\\/g, " \\ ") // Replace backslashes with " \ "
      // .replace(/[^a-zA-Z0-9 ]/g, ""); // Remove all special characters except spaces

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "tool", content: `AI: ${cleanedResponse}` },
      ]);
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "tool", content: "AI: Error calculating retirement plan." },
      ]);
    }
  };

  return (
    <div className="container mt-4">
      {/* <h1 className="text-center">Ai Advisor</h1> */}

      {/* Default Retirement Planner Image */}
      <div className="text-center mb-4">
        <img
          src="retirement.png"
          alt="Retirement Planning"
          className="img-fluid rounded"
          style={{ maxHeight: "225px", objectFit: "cover" }}
        />
      </div>

      {/* Chat Display Area */}
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message?.content.startsWith("You:")
                ? "user-message"
                : "ai-message"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      {/* Action Buttons with Icons */}
      <div className="mb-3 button-group">
        <div
          className="action-button"
          onClick={(e) =>
            handleSubmit(e, "Show me a retirement plan", "action")
          }
        >
          <FontAwesomeIcon icon={faClipboardList} />
          <span> Show Retirement Plan</span>
        </div>
      </div>

      {/* Prompt Input Area */}
      <div className="d-flex">
        <textarea
          rows={1}
          style={{
            width: "100%",
            marginBottom: "20px",
            marginRight: "20px",
            padding: "10px",
            borderRadius: "5px",
            borderColor: "#ccc",
            backgroundColor: "#2c2c2c",
            color: "#ffffff",
          }}
          placeholder="Enter your prompt here..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSubmit(e, inputPrompt, "input");
          }}
        />
        <button
          className="btn btn-dark"
          style={{
            height: "52px",
            backgroundColor: "#3b82f6", // Deeper dark color
          }}
          type="button"
          onClick={(e) => handleSubmit(e, inputPrompt, "input")}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

export default App;
