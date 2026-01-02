"use client";

import { AppConfig } from "@/lib/config";
import { X } from "lucide-react";
import { useState } from "react";

export default function AdminTokenBanner() {
  const [isVisible, setIsVisible] = useState(AppConfig.admin.isUsingDefaultToken);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-500 text-black px-4 py-3 text-center relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 text-sm font-medium">
          ⚠️ <strong>Security Warning:</strong> You are using the default admin token (
          <code className="bg-yellow-600 px-2 py-0.5 rounded">{AppConfig.admin.defaultToken}</code>
          ). Please set a custom{" "}
          <code className="bg-yellow-600 px-2 py-0.5 rounded">ADMIN_TOKEN</code> environment
          variable for production use.
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-yellow-600 rounded transition-colors"
          aria-label="Dismiss banner"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
