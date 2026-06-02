// Admin page constants — site map for manual nav buttons and scenario config

import { MEETING_BOT_CONFIG, NAV_AGENT_SCENARIO_ID } from "@/lib/ttai";

export const SECTIONS = [
  { label: "The Project", section: "#intro" },
  { label: "Highlights", section: "#highlights" },
  { label: "Sustainability", section: "#sustainability" },
  { label: "Grand Masters", section: "#masters" },
  { label: "Consultation", section: "#consultation" },
];

export const TOP_ROUTES = [
  { label: "Home", url: "/" },
  { label: "Properties", url: "/slides" },
];

export const PROPERTY_STORIES = [
  {
    id: "wraparound-residence",
    label: "Wraparound Residence",
    scenes: [
      { n: 1, label: "The Wraparound Residence" },
      { n: 2, label: "Open Arrival" },
      { n: 3, label: "Configuration & Areas" },
      { n: 4, label: "Light" },
      { n: 5, label: "Four Bedrooms" },
    ],
  },
  {
    id: "sky-penthouse",
    label: "Sky Penthouse",
    scenes: [
      { n: 1, label: "The Sky Penthouse" },
      { n: 2, label: "Garden in the Sky" },
      { n: 3, label: "Configuration & Areas" },
      { n: 4, label: "Double-height" },
      { n: 5, label: "Suite" },
    ],
  },
  {
    id: "amenities",
    label: "Amenities",
    scenes: [
      { n: 1, label: "The Camellias Club" },
      { n: 2, label: "Spa & Pools" },
      { n: 3, label: "Golf Courses" },
      { n: 4, label: "Specsheet" },
    ],
  },
] as const;

export const OUR_SCENARIOS = [
  { id: NAV_AGENT_SCENARIO_ID, label: "Nav Agent (iframe widget)" },
  { id: MEETING_BOT_CONFIG.scenarioId, label: "Meeting Bot (Priya)" },
] as const;
