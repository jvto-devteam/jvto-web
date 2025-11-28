import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { knowledgeBase } from '@/data';
import { ChatMessage } from '@/types';
import MarkdownRenderer from './MarkdownRenderer';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'model',
            content: "Hello! I'm the JVTO AI Assistant. How can I help you plan your East Java adventure today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const initChat = () => {
            if (process.env.API_KEY) {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const systemInstruction = `You are a friendly and helpful tour expert for JVTO (Java Volcano Tour Operator). Your goal is to answer user questions accurately and encourage them to book a tour. ONLY use the information provided in the following knowledge base to answer questions. Do not make up information or answer questions not related to JVTO or travel in East Java. If the answer is not in the knowledge base, politely state that you don't have that information and suggest they contact JVTO directly via the 'Contact' page. Format your answers clearly using markdown for lists (using '*') and bolding (using '**'). Here is the knowledge base: ${JSON.stringify(knowledgeBase)}`;

                const newChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction,
                    },
                });
                setChat(newChat);
            }
        };
        initChat();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading || !chat) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessageStream({ message: input });
            let currentResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of response) {
                currentResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = currentResponse;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Gemini API error:", error);
            setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-primary rounded-full text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform animate-pulse-slow"
                aria-label="Open AI Chatbot"
            >
                <span className="material-symbols-outlined text-3xl">
                    {isOpen ? 'close' : 'chat'}
                </span>
            </button>

            {isOpen && (
                <div 
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                  onClick={() => setIsOpen(false)}
                ></div>
            )}
            
            <div className={`fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] max-w-md bg-white dark:bg-background-dark rounded-2xl shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="flex flex-col h-[60vh] max-h-[700px]">
                    <header className="flex justify-between items-center p-4 border-b border-ink-neutral-200 dark:border-ink-neutral-700">
                        <h3 className="text-lg font-bold text-ink-primary dark:text-white">JVTO AI Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="p-2 rounded-full text-ink-neutral-500 hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-700" aria-label="Close chat">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </header>

                    <div className="flex-grow p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <span className="material-symbols-outlined text-primary mr-2">smart_toy</span>}
                                <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-ink-neutral-50 dark:bg-ink-neutral-700 text-ink-primary dark:text-white rounded-bl-none'}`}>
                                   {msg.role === 'model' ? <MarkdownRenderer text={msg.content} /> : <p>{msg.content}</p>}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                               <span className="material-symbols-outlined text-primary mr-2">smart_toy</span>
                               <div className="max-w-xs rounded-2xl px-4 py-2 bg-ink-neutral-50 dark:bg-ink-neutral-700 rounded-bl-none">
                                   <div className="flex items-center gap-1.5">
                                       <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                       <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                       <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                                   </div>
                               </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-ink-neutral-200 dark:border-ink-neutral-700">
                        <div className="flex items-end gap-2 bg-ink-neutral-50 dark:bg-ink-neutral-700 rounded-lg p-1">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Ask about a tour..."
                                className="flex-grow bg-transparent p-2 focus:outline-none resize-none max-h-32 text-ink-primary dark:text-white"
                                rows={1}
                            />
                            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-lg flex-shrink-0 disabled:bg-opacity-50 disabled:cursor-not-allowed">
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;