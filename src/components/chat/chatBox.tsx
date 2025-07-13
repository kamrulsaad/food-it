"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

type Message = {
  id: string;
  content: string;
  role: "CUSTOMER" | "OWNER" | "RIDER";
  senderId: string;
  createdAt: string;
};

export default function ChatBox({
  orderId,
  role,
}: {
  orderId: string;
  role: "CUSTOMER" | "OWNER" | "RIDER";
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/${orderId}`);
      const data = await res.json();
      setMessages(data.messages || []);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Fetching messages failed", err);
    }
  }, [orderId]);

  const ensureChatExists = async () => {
    try {
      await fetch(`/api/chat/${orderId}`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Failed to ensure chat exists:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    await ensureChatExists(); // 🔁 make sure chat is created first

    await fetch(`/api/chat/${orderId}/message`, {
      method: "POST",
      body: JSON.stringify({ content: input, role }),
    });

    setInput("");
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();

    intervalRef.current = setInterval(fetchMessages, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchMessages]);

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white shadow-lg rounded-lg border flex flex-col z-50">
      <div className="bg-gray-100 p-3 font-medium border-b">Chat</div>
      <ScrollArea className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`text-sm p-2 rounded-md ${
              msg.role === role
                ? "bg-blue-100 self-end ml-12 text-right"
                : "bg-gray-100 self-start mr-12"
            }`}
          >
            {msg.content}
            <div className="text-xs text-gray-400 mt-1">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </ScrollArea>
      <div className="p-2 border-t flex gap-2">
        <Textarea
          className="flex-1 resize-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="Type your message..."
        />
        <Button onClick={sendMessage} size="sm">
          Send
        </Button>
      </div>
    </div>
  );
}
