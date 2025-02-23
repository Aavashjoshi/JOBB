import React, { useState, useEffect } from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./Herosection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X } from "lucide-react";

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  // Chatbot State
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  // Chatbot Response Logic
  const getBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("job")) {
      return "Check the latest jobs in the 'Latest Jobs' section!";
    } else if (lowerInput.includes("apply")) {
      return "Click on a job listing to find an 'Apply' button.";
    } else if (lowerInput.includes("resume")) {
      return "Make sure your resume is updated before applying!";
    } else if (lowerInput.includes("company")) {
      return "You can browse companies in the 'Companies' section.";
    } else if (lowerInput.includes("contact")) {
      return "Visit the 'Contact Us' page for support.";
    } else if (lowerInput.includes("salary")) {
      return "Salary details are available in the job descriptions.";
    } else if (lowerInput.includes("internship")) {
      return "Check the 'Latest Jobs' section for internship opportunities.";
    } else if (lowerInput.includes("login")) {
      return "Click on the 'Login' button at the top right corner.";
    } else if (lowerInput.includes("frontend developer")) {
      return "You can easily apply for frontend developer roles in the job section!";
    } else if (lowerInput.includes("backend developer")) {
      return "There are many backend developer job listings in the 'Latest Jobs' section.";
    } else if (lowerInput.includes("full stack")) {
      return "Full Stack Developer positions are available in the job section. Apply now!";
    } else if (lowerInput.includes("designer")) {
      return "Graphic/UI/UX Designer jobs can be found in the job listings.";
    } else if (lowerInput.includes("remote")) {
      return "Many jobs offer remote work. Check job details for more info.";
    } else if (lowerInput.includes("freelance")) {
      return "We have freelance job listings. Check the 'Latest Jobs' section.";
    } else if (lowerInput.includes("experience")) {
      return "Each job listing mentions the required experience level.";
    } else {
      return "I'm here to help! Try asking about jobs, applications, companies, or salaries.";
    }
  };

  // Handle Send Message
  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const botResponse = getBotResponse(input);

    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: "bot" }]);
    }, 500);

    setInput("");
  };

  // Handle Enter Key Press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Auto-scroll to Bottom
  useEffect(() => {
    const chatWindow = document.querySelector(".chat-messages");
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />

      {/* Floating Chatbot Button */}
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? <X /> : <MessageCircle />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 bg-white w-80 h-96 shadow-xl rounded-lg p-4 flex flex-col">
          {/* Chat Header */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Chatbot</h2>
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <span className={`px-3 py-2 rounded-lg inline-block ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex items-center mt-2">
            <input
              type="text"
              className="flex-grow border p-2 rounded-l-lg"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;