'use client'
import React, { useRef, useEffect, useState } from 'react';

const staticMessages = [
  { id: 1, sender: 'agent', text: 'Hello! How can I help you today?' },
  { id: 2, sender: 'user', text: 'Hi! I want to know more about your services.' },
  { id: 3, sender: 'agent', text: 'Sure! We offer a range of AI solutions for businesses.' },
  { id: 4, sender: 'user', text: 'That sounds great. Can you tell me more?' },
  { id: 5, sender: 'agent', text: 'Absolutely! What would you like to know?' },
];

export default function AgentChat() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="px-4 py-3 bg-white dark:bg-neutral-800 shadow flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Agent Chat</h1>
        <span className="text-xs text-gray-400">Static Demo</span>
      </header>
      {/* Message List */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {staticMessages.map((msg) => (
          <div
            key={msg.id}
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
      {/* Input Box (disabled for static demo) */}
      <form className="px-4 py-3 bg-white dark:bg-neutral-800 flex items-center gap-2 border-t border-gray-200 dark:border-neutral-700">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message... (static demo)"
          disabled
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition disabled:opacity-50"
          disabled
        >
          Send
        </button>
      </form>
    </div>
  );
} 