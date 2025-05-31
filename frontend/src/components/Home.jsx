import React, { useState } from 'react';
import SideBar from './SideBar';
import Prompt from './Prompt';

const Home = () => {
    const [prompt, setPrompt] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showSidebar, setShowSidebar] = useState(false);

    const handleNewChat = () => {
        setPrompt([]);
        setInputValue("");
        setShowSidebar(false);
    };

    const closeSidebar = () => setShowSidebar(false);

    return (
        <div className='flex flex-col md:flex-row h-screen bg-gray-900 text-white overflow-hidden'>
            {/* Sidebar for large screen */}
            <div className='hidden md:block md:w-1/5 bg-gray-800 border-r border-gray-700 h-full overflow-y-auto'>
                <SideBar onNewChat={handleNewChat} />
            </div>

            {/* Sidebar for small screen */}
            {showSidebar && (
                <div className="fixed z-50 inset-0 bg-black bg-opacity-50 md:hidden">
                    <div className="w-[75%] sm:w-[60%] bg-gray-800 h-full p-4 overflow-y-auto">
                        <SideBar onNewChat={handleNewChat} closeSidebar={closeSidebar} />
                    </div>
                    <div
                        className="absolute inset-0"
                        onClick={closeSidebar}
                    />
                </div>
            )}

            {/* Prompt Section */}
            <div className='w-full md:w-4/5 h-full overflow-hidden'>
                <Prompt
                    prompt={prompt}
                    setPrompt={setPrompt}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    onToggleSidebar={() => setShowSidebar(true)}
                />
            </div>
        </div>
    );
};

export default Home;