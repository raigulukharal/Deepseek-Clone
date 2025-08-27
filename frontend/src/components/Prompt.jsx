import React, { useEffect, useRef } from 'react';
import { FaMagic, FaGlobe, FaPaperPlane, FaBars } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import { aiAPI } from '../services/aiAPI';

const Prompt = ({ prompt, setPrompt, inputValue, setInputValue, onToggleSidebar }) => {
  const [loading, setLoading] = React.useState(false);
  const chatRef = useRef(null);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", content: trimmed };
    const loadingMessage = { role: "assistant", content: "Loading..." };

    setPrompt(prev => [...prev, userMessage, loadingMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await aiAPI.sendPrompt(trimmed);

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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [prompt]);

  return (
    <div className="flex flex-col h-full">
      <button
        className="text-white mb-2 w-fit lg:hidden p-2 hover:bg-gray-700 rounded transition-colors"
        onClick={onToggleSidebar}
      >
        <FaBars size={22} />
      </button>
      <div className="flex-1 overflow-y-auto px-2" ref={chatRef}>
        {prompt.length === 0 ? (
          <div className="text-center h-full flex flex-col items-center justify-center">
            <div className="flex justify-center items-center mb-4">
              <img className="w-16 h-16" src="/assets/icon.png" alt="Deepseek Icon" />
              <h1 className="font-bold text-2xl ml-4 text-white">Hi, I am Deepseek</h1>
            </div>
            <p className="text-white text-lg">How can I help you today?</p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
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
      <div className="sticky bottom-0 bg-gray-900 pt-4 pb-6 px-4">
        <div className="w-full max-w-3xl mx-auto bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3 mb-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message DeepSeek ..."
              className="flex-1 border border-gray-300 text-black rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button 
              onClick={handleSend}
              disabled={loading || !inputValue.trim()}
              className="p-2 rounded-full bg-gray-800 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane />
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors">
              <FaMagic className="mr-2" />
              DeepThink R1
            </button>
            <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors">
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