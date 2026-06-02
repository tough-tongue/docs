"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import NavAgentWidget from "./NavAgentWidget";
import MeetingBotWidget from "./MeetingBotWidget";

/**
 * PersistentWidgets
 *
 * Mounted above <Routes> in the root layout so the ToughTongue iframe DOM
 * (and the live voice/AI session it holds) survives all Next.js route changes.
 *
 * Admin routes do not render customer-facing widgets. On public routes,
 * NavAgentWidget stays mounted and is hidden via display:none when switching
 * to meeting-bot mode so the iframe session stays alive in the background.
 */
export function PersistentWidgets() {
  const { widgetMode } = useSession();
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <div
        data-testid="widget-slot-nav-agent"
        style={{ display: widgetMode === "nav-agent" ? "block" : "none" }}
      >
        <NavAgentWidget />
      </div>
      {widgetMode === "google-meet-agent" && <MeetingBotWidget />}
    </>
  );
}
