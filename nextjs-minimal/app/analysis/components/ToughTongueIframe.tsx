"use client";

import React from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { buildEmbedUrl } from "@/lib/toughtongue";

// Language analysis scenario (different from personality test)
const LANGUAGE_ANALYSIS_SCENARIO_ID = "67f63d18f2dd89fc5d2d5e77";

export default function ToughTongueIframe() {
  const { currentUser, loading, getUserName, getUserEmail } = useAuth();

  const iframeUrl = buildEmbedUrl({
    scenarioId: LANGUAGE_ANALYSIS_SCENARIO_ID,
    background: "black",
    userName: currentUser ? getUserName() : undefined,
    userEmail: currentUser ? getUserEmail() : undefined,
    promptUserInfo: !currentUser || loading,
  });

  return (
    <div className="mb-8">
      <iframe
        src={iframeUrl}
        width="100%"
        height="700px"
        frameBorder="0"
        allow="microphone; camera; display-capture"
        className="rounded-lg border border-border shadow-lg shadow-teal-500/5"
      />
    </div>
  );
}
