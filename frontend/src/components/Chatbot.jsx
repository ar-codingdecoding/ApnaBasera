import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { BeatLoader } from 'react-spinners'; 

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm ApnaBot. How can I assist you with finding a property or listing one today?", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (inputValue.trim() === '' || isLoading) return;

        const userMessage = { text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        
        setMessages(prev => [...prev, { text: '', sender: 'ai', isLoading: true }]);

        try {
            const response = await fetch('https://apnabasera-backend.onrender.com/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputValue }),
            });

            if (!response.body) return;
            
            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
            let aiResponseText = '';
            
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                
                const lines = value.split('\n\n');
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const json = JSON.parse(line.substring(5));
                        aiResponseText += json.text;
                       
                        setMessages(prev => {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1] = { text: aiResponseText, sender: 'ai' };
                            return newMessages;
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch AI response:', error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { text: 'Sorry, I am having trouble connecting. Please try again later.', sender: 'ai' };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-4 sm:right-6 w-80 sm:w-96 bg-white rounded-lg shadow-2xl transition-all duration-300 z-50 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                {/* Header */}
                <div className="bg-custom-navy text-white p-3 rounded-t-lg flex justify-between items-center">
                    <h3 className="font-semibold">ApnaBasera Helper</h3>
                    <button onClick={() => setIsOpen(false)} className="hover:text-indigo-200">
                        <X size={20} />
                    </button>
                </div>
                
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                {msg.isLoading ? <BeatLoader size={8} color="#4f46e5" /> : msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ask a question..."
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-custom-navy text-white p-2 rounded-lg flex-shrink-0 hover:bg-indigo-700 disabled:bg-indigo-400" disabled={isLoading}>
                            <Send size={20} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Floating Chat Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-custom-navy text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-transform hover:scale-110 z-50"
                aria-label="Toggle chat"
            >
                <MessageCircle size={32} />
            </button>
        </>
    );
};

export default Chatbot;
