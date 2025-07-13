"use client";

import { useState } from "react";
import ChatBox from "./chatBox";
import { Button } from "@/components/ui/button";

export default function CustomerChatController({
  orderId,
}: {
  orderId: string;
}) {
  const [activeChat, setActiveChat] = useState<"OWNER" | "RIDER" | null>(null);

  return (
    <>
      {/* Chat Buttons */}
      {activeChat === null && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          <Button
            onClick={() => setActiveChat("RIDER")}
            className="rounded-full px-4 py-2 text-sm"
          >
            Chat with Rider
          </Button>
          <Button
            onClick={() => setActiveChat("OWNER")}
            className="rounded-full px-4 py-2 text-sm"
          >
            Chat with Restaurant
          </Button>
        </div>
      )}

      {/* Chat with OWNER */}
      {activeChat === "OWNER" && (
        <ChatBox
          orderId={orderId}
          role="CUSTOMER"
          withRole="OWNER"
          onClose={() => setActiveChat(null)}
        />
      )}

      {/* Chat with RIDER */}
      {activeChat === "RIDER" && (
        <ChatBox
          orderId={orderId}
          role="CUSTOMER"
          withRole="RIDER"
          onClose={() => setActiveChat(null)}
        />
      )}
    </>
  );
}
