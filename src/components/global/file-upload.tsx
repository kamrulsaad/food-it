"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

interface FileUploadProps {
  onChange: (url: string) => void;
  value?: string;
}

export default function FileUpload({ onChange, value }: FileUploadProps) {
  if (value) {
    return (
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="relative w-40 h-40">
          <Image
            src={value}
            className="object-contain"
            fill
            alt="Uploaded image"
          />
        </div>
        <Button
          onClick={() => onChange("")}
          variant="ghost"
          type="button"
          className="flex items-center gap-2 cursor-pointer"
        >
          <X aria-hidden className="h-4 w-4" />
          Remove Image
        </Button>
      </div>
    );
  }

  return (
    <UploadDropzone
      appearance={{
        button: "bg-primary px-4 hover:bg-orange-600 cursor-pointer",
      }}
      className="cursor-pointer transition-all duration-300"
      endpoint={"menuItem"}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url ?? "");
      }}
      onUploadError={(err) => {
        console.error(err);
        alert("Upload failed");
      }}
    />
  );
}
