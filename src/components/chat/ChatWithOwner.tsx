"use client";

import { useState } from "react";
import ChatBox from "./chatBox";
import { Button } from "../ui/button";
import { MessageCircle } from "lucide-react";

type Role = "CUSTOMER" | "OWNER";

export default function ChatWithOwner({
  orderId,
  role,
  visible,
  onOpen,
}: {
  orderId: string;
  role: Role;
  visible?: boolean;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    if (!open) {
      onOpen?.(); // Notify others to close
    }
    setOpen(!open);
  };

  if (!visible && role === "CUSTOMER") return null;

  return (
    <>
      {role === "CUSTOMER" && !open && (
        <Button
          onClick={handleToggle}
          className="fixed bottom-16 right-4 z-40 rounded-full px-4 py-2 text-sm"
        >
          Chat with Restaurant
        </Button>
      )}

      {role === "OWNER" && (
        <Button
          onClick={handleToggle}
          className="fixed bottom-4 right-4 z-50 rounded-full p-3"
        >
          <MessageCircle className="w-5 h-5" />
          Chat with Customer
        </Button>
      )}

      {open && (
        <ChatBox
          orderId={orderId}
          role={role}
          withRole="OWNER"
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
