import React, { useEffect, useRef } from 'react';
import { FaMagic, FaGlobe, FaPaperclip, FaPaperPlane, FaBars } from "react-icons/fa";
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Prompt = ({ prompt, setPrompt, inputValue, setInputValue, onToggleSidebar }) => {
  const [, setLoading] = React.useState(false);
  const chatRef = useRef(null);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", content: trimmed };
    const loadingMessage = { role: "assistant", content: "Loading..." };

    setPrompt(prev => [...prev, userMessage, loadingMessage]);
    setInputValue('');
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/deepseekai/prompt",
        { prompt: trimmed },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setPrompt(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: res.data.assistantReply.content
        };
        return updated;
      });

    } catch (error) {
      console.error("Error:", error);
      setPrompt(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Something Went Wrong in AI Assistant"
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [prompt]);

  return (
    <div className="flex flex-col h-full">
      <button
        className="text-white mb-2 w-fit lg:hidden p-2"
        onClick={onToggleSidebar}
      >
        <FaBars size={22} />
      </button>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto" ref={chatRef}>
        {prompt.length === 0 ? (
          <div className="text-center mt-10 h-full flex flex-col items-center justify-center">
            <div className="flex justify-center items-center mb-4">
              <img className="w-16 h-16" src="/assets/icon.png" alt="Deepseek Icon" />
              <h1 className="font-bold text-2xl ml-4 text-white">Hi, I am Deepseek</h1>
            </div>
            <p className="text-white text-lg">How can I help you today?</p>
          </div>
        ) : (
          <div className="px-4 py-2 space-y-4">
            {prompt.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`${msg.role === "user" ? "bg-gray-800" : "bg-blue-100 text-gray-800"} p-3 rounded-lg max-w-[90%] sm:max-w-[80%] md:max-w-[70%]`}>
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-gray-200 rounded px-1 py-0.5 text-sm">{children}</code>
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="sticky bottom-0 bg-gray-900 pt-4 pb-6 px-4">
        <div className="w-full max-w-3xl mx-auto bg-white p-4 rounded-xl shadow">
          <div className="flex items-center space-x-3 mb-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message DeepSeek ..."
              className="flex-1 border border-gray-300 text-black rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSend}
              className="p-2 rounded-full bg-gray-800 text-white hover:bg-blue-600 transition"
            >
              <FaPaperPlane />
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
              <FaMagic className="mr-2" />
              DeepThink R1
            </button>
            <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
              <FaGlobe className="mr-2" />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prompt;