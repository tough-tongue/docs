"use client";

import React from "react";
import { useAuth } from "@/app/auth/AuthContext";

// Constants
const TOUGH_TONGUE_SCENARIO_ID = "67f63d18f2dd89fc5d2d5e77";

export default function ToughTongueIframe() {
  const { user, loading } = useAuth();

  // Build iframe URL dynamically with user information
  const getIframeUrl = () => {
    if (loading || !user)
      return `https://app.toughtongueai.com/embed/${TOUGH_TONGUE_SCENARIO_ID}?bg=black&promptUserInfo=true`;

    const userName = user.displayName || "";
    const userEmail = user.email || "";

    return `https://app.toughtongueai.com/embed/${TOUGH_TONGUE_SCENARIO_ID}?bg=black&userName=${encodeURIComponent(
      userName
    )}&userEmail=${encodeURIComponent(userEmail)}`;
  };

  return (
    <div className="mb-8">
      <iframe
        src={getIframeUrl()}
        width="100%"
        height="700px"
        frameBorder="0"
        allow="microphone; camera; display-capture"
      ></iframe>
    </div>
  );
}
