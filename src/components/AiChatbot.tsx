'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WhatsAppIcon, ChatBotIcon, UpworkIcon, LinkedInIcon } from '@/components/Icons';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
};

export function AiChatbot({
  whatsappNumber = '+8801700000000',
  whatsappPrompt = 'Hi Muyeed, I visited your website and would like to discuss a digital marketing project.'
}: {
  whatsappNumber?: string;
  whatsappPrompt?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hi! I'm Muyeed's AI assistant. Ask me about AI SEO, Google Ads, Meta Ads, WordPress, or case studies. I keep answers short and to the point!",
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const cleanPhone = whatsappNumber.replace(/[^0-9+]/g, '');
  const encodedPrompt = encodeURIComponent(whatsappPrompt);
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodedPrompt}`;

  async function handleSend(textToSend?: string) {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          sessionId: sessionIdRef.current,
          history: messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });

      const data = await res.json();
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || "I'm available to help with AI SEO, Google Ads, Meta Ads, or WordPress. Feel free to contact Muyeed directly on WhatsApp!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: "I had a moment of connection delay. You can reach Muyeed directly on WhatsApp right now!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chatbotWrapper">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          className="chatbotFloatingTrigger"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI chat assistant and WhatsApp communication"
          type="button"
        >
          <span className="chatbotTriggerPulse" aria-hidden="true" />
          <span className="chatbotTriggerIcon">
            <ChatBotIcon size={22} />
          </span>
          <span className="chatbotTriggerText">Ask AI / WhatsApp</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbotWindow" role="dialog" aria-modal="true" aria-label="Muyeed Sifat AI Chatbot">
          {/* Header */}
          <div className="chatbotHeader">
            <div className="chatbotHeaderUser">
              <div className="chatbotAvatarBox">
                <span className="chatbotAvatarM">M</span>
                <span className="chatbotStatusDot" aria-label="Online" />
              </div>
              <div className="chatbotHeaderTitles">
                <strong>Muyeed Assistant</strong>
                <span className="chatbotStatusText">Gemini AI • Online</span>
              </div>
            </div>

            <div className="chatbotHeaderActions">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="chatbotWhatsappHeaderBtn"
                title="Chat directly on WhatsApp"
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp</span>
              </a>

              <button
                className="chatbotCloseBtn"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                type="button"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Direct WhatsApp Callout Banner */}
          <div className="chatbotDirectBanner">
            <span>Want to speak to Muyeed directly?</span>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="chatbotBannerLink">
              <WhatsAppIcon size={14} /> Open WhatsApp
            </a>
          </div>

          {/* Messages Body */}
          <div className="chatbotMessages">
            {messages.map((m) => (
              <div key={m.id} className={`chatBubbleWrap ${m.sender === 'user' ? 'bubbleUser' : 'bubbleBot'}`}>
                <div className="chatBubble">
                  <p>{m.text}</p>
                </div>
                <span className="chatBubbleTime">{m.time}</span>
              </div>
            ))}

            {loading && (
              <div className="chatBubbleWrap bubbleBot">
                <div className="chatBubble typingIndicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="chatbotQuickChips">
            <button
              type="button"
              className="quickChip"
              onClick={() => handleSend('What services do you offer?')}
            >
              Services
            </button>
            <button
              type="button"
              className="quickChip"
              onClick={() => handleSend('What results have you achieved?')}
            >
              Results
            </button>
            <button
              type="button"
              className="quickChip"
              onClick={() => handleSend('Can I hire you on Upwork or LinkedIn?')}
            >
              Upwork & LinkedIn
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="quickChip chipWhatsapp"
            >
              <WhatsAppIcon size={12} /> WhatsApp
            </a>
          </div>

          {/* Input Footer */}
          <form
            className="chatbotInputArea"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or propose a project…"
              aria-label="Your message"
              disabled={loading}
            />
            <button
              type="submit"
              className="chatbotSendBtn"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>

          {/* Social Profiles Footer */}
          <div className="chatbotFooterLinks">
            <a href="https://www.upwork.com/freelancers/~01ceafed69d95ddfae" target="_blank" rel="noopener noreferrer">
              <UpworkIcon size={13} /> Upwork
            </a>
            <span>•</span>
            <a href="https://www.linkedin.com/in/muyeedsifat/" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon size={13} /> LinkedIn
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
