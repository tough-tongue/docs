export const CUSTOM_FUNCTION_SCHEMA = {
  type: "object",
  description:
    "Navigate the visitor's browser. Use 'url' for page routes or 'section' for anchor scroll. Always include the session_code from your instructions.",
  properties: {
    session_code: {
      type: "string",
      description:
        "The visitor's 4-character session code. This is provided to the agent as {{ session_code }}. Include it exactly as provided.",
      minLength: 4,
      maxLength: 4,
      pattern: "^[A-Z]{4}$",
    },
    url: {
      type: "string",
      description:
        "React route path to navigate to. Examples: /, /slides, /slides/wraparound-residence/1, /slides/sky-penthouse/3, /slides/amenities/2",
      pattern: "^/[^/]?.*$",
    },
    section: {
      type: "string",
      description:
        "CSS anchor to scroll to on the landing page. Examples: #intro, #highlights, #sustainability, #masters, #consultation",
      pattern: "^#[A-Za-z][A-Za-z0-9_-]*$",
    },
  },
  required: ["session_code"],
  anyOf: [{ required: ["url"] }, { required: ["section"] }],
  additionalProperties: false,
} as const;
