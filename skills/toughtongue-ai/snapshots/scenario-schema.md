<!-- Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh. -->
<!-- Source: tough-tongue-ai/www/app/docs/config/api-schemas.ts @ 0c17abd29 (2026-06-19T09:08:28-07:00) -->
<!-- Pinned at: 2026-06-19T16:23:07Z -->

# Scenario

A scenario defines the conversation structure and AI behavior. Users interact with scenarios to create sessions — running instances that record transcripts, evaluations, and metadata.

## Sample

```json
{
  "id": "689e283d8ff2b6aca6239d8b",
  "name": "Customer Support Training",
  "description": "Practice handling difficult customer inquiries",
  "user_friendly_description": "Improve your customer service skills",
  "ai_instructions": "You are a frustrated customer with a billing issue.",
  "rubrik": "Rate based on empathy, problem-solving, clarity",
  "pdf_context": null,
  "is_public": true,
  "passcode": null,
  "is_recording": true,
  "analysis_access": "default",
  "appearance": {
    "voice": "Aoede",
    "avatar_url": null,
    "language_code": "en-US"
  },
  "memory": {
    "is_memory": true
  },
  "session_analysis": {
    "admin_email": "admin@example.com",
    "is_auto_analysis": true,
    "is_auto_submit": false,
    "enable_extraction": true,
    "extraction_vars": [
      {
        "name": "sentiment",
        "description": "...",
        "type": "text"
      }
    ]
  },
  "ai_model_config": {
    "provider": "Ocean",
    "model": "medium-stable"
  },
  "tools_config": {
    "tools": {
      "timer": {
        "should_register": true,
        "add_to_system_prompt": false,
        "tool_settings": null
      },
      "end_session": {
        "should_register": true,
        "add_to_system_prompt": true,
        "tool_settings": {
          "disconnectDelaySeconds": 5
        }
      }
    }
  },
  "user_metadata": {
    "department": "sales",
    "priority": 5
  },
  "pricing": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T14:20:00Z"
}
```

## Fields

### Core

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string |  | Scenario ID — omit to create, include to update |
| `name` | string | ✓ | Display name for the scenario |
| `description` | string |  | Internal description (admin reference) |
| `ai_instructions` | string | ✓ | System instructions defining AI behavior during conversations |
| `user_friendly_description` | string |  | Public-facing description shown to users |
| `rubrik` | string |  | Evaluation criteria used when analyzing sessions |
| `pdf_context` | string |  | Additional context document (base64 encoded) |

### Access Control

| Field | Type | Required | Description |
|---|---|---|---|
| `is_public` | boolean |  | Publicly accessible (default: true) |
| `passcode` | string |  | Optional passcode protection |
| `is_recording` | boolean |  | Record conversations |
| `analysis_access` | string |  | Visibility: 'default' (run page only), 'always' (run + iframes), 'never' (hidden) |
| `user_metadata` | object |  | Filterable key-value metadata (str, int, float, bool). Filter via meta_* query params |

### Customization

| Field | Type | Required | Description |
|---|---|---|---|
| `appearance.voice` | string |  | Aoede, Charon, Fenrir, Kore, Puck |
| `appearance.avatar_url` | string |  | Custom avatar image URL |
| `appearance.language_code` | string |  | Speech language (default: "en-US") |
| `memory.is_memory` | boolean |  | Enable memory across sessions |
| `ai_model_config.provider` | string |  | "Ocean" or "Galaxy" |
| `ai_model_config.model` | string |  | medium, medium-stable, medium-nc, medium-stable-nc |

### Session Analysis

| Field | Type | Required | Description |
|---|---|---|---|
| `session_analysis.admin_email` | string |  | Email for analysis reports |
| `session_analysis.is_auto_analysis` | boolean |  | Auto-run analysis after session ends |
| `session_analysis.is_auto_submit` | boolean |  | Auto-submit without user action |
| `session_analysis.email_analysis` | boolean |  | Email analysis results to admin emails |
| `session_analysis.email_transcript` | boolean |  | Email transcript to admin emails |
| `session_analysis.multimodal_analysis` | boolean |  | Use video/audio for evaluation |
| `session_analysis.evaluation_target` | string |  | Participant to evaluate (e.g. 'Sales Rep') |
| `session_analysis.enable_extraction` | boolean |  | Auto-run variable extraction after session ends |
| `session_analysis.extraction_vars` | array |  | Variables to extract: [{name, description, type}]. Types: text, number, boolean, list, date |

### Tools

| Field | Type | Required | Description |
|---|---|---|---|
| `tools_config.tools.<name>` | object |  | Per-tool config: should_register (bool), add_to_system_prompt (bool), tool_settings (object\|null). See Tools Config object for details. |

### Timestamps

| Field | Type | Required | Description |
|---|---|---|---|
| `created_at` | datetime |  | ISO 8601 creation timestamp |
| `updated_at` | datetime |  | ISO 8601 last-update timestamp |

## Notes

List responses exclude sensitive fields (ai_instructions, pdf_context, memory, ai_model_config, tools_config). Use GET /scenarios/{id} for full details.
