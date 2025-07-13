"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Role = "CUSTOMER" | "OWNER" | "RIDER";

type Message = {
  id: string;
  content: string;
  senderId: string;
  senderRole: Role;
  createdAt: string;
};

type ChatBoxProps = {
  orderId: string;
  role: Role;
  withRole: Exclude<Role, "CUSTOMER">; // OWNER or RIDER
  onClose?: () => void; // Optional callback to close box
};

export default function ChatBox({ orderId, role, withRole, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/${orderId}?withRole=${withRole}`);
      const data = await res.json();
      setMessages(data.messages || []);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  }, [orderId, withRole]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await fetch(`/api/chat/${orderId}/message?withRole=${withRole}`, {
      method: "POST",
      body: JSON.stringify({ content: input, role }),
    });
    setInput("");
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    intervalRef.current = interval;
    return () => clearInterval(interval);
  }, [fetchMessages]);

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white shadow-xl rounded-lg border flex flex-col z-50">
      <div className="bg-gray-100 p-3 font-semibold border-b text-sm flex justify-between items-center">
        Chat with {withRole.toLowerCase()}
        {onClose && (
          <button onClick={onClose}>
            <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </button>
        )}
      </div>
      <ScrollArea className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[80%] text-sm p-2 rounded-md",
              msg.senderRole === role
                ? "bg-blue-100 self-end ml-auto text-right"
                : "bg-white text-black self-start"
            )}
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
