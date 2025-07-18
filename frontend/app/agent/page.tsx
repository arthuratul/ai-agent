'use client'
import React, { useRef, useEffect, useState } from 'react';

type Message = {
  sender: 'user' | 'agent';
  text: string;
};

export default function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([]); // Chat is blank by default
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'agent', text: data.message } as Message]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'agent', text: 'Error: Could not reach API.' } as Message]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSend(e);
    }
  };

  return (
    <div className="flex flex-col max-w-4xl w-full mx-auto bg-gray-50 dark:bg-neutral-900 mb-8 rounded-lg shadow-lg mt-8 flex-1 h-full min-h-0">
      {/* Header */}
      <header className="px-4 py-3 bg-white dark:bg-neutral-800 shadow flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Agent Chat</h1>
        <span className="text-xs text-gray-400">Live Chat</span>
      </header>
      {/* Message List */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm
                ${msg.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 rounded-bl-none'}
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>
      {/* Input Box */}
      <form
        className="px-4 py-3 bg-white dark:bg-neutral-800 flex items-center gap-2 border-t border-gray-200 dark:border-neutral-700"
        onSubmit={handleSend}
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
} 