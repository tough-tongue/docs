<!-- Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh. -->
<!-- Source: tough-tongue-ai/www/app/docs/config/api-schemas.ts @ 0c17abd29 (2026-06-19T09:08:28-07:00) -->
<!-- Pinned at: 2026-06-19T16:23:07Z -->

# Session

A session is a running or completed instance of a scenario. Each user interaction is recorded; transcripts, evaluation results, and extracted variables are available once the session is completed and processed.

## Sample

```json
{
  "id": "67c551e8aa4a6a7575d33955",
  "scenario_id": "679c838ec41cfcb298fd9ace",
  "scenario_name": "Laughter Therapy",
  "created_at": "2025-03-03T06:53:28.035Z",
  "completed_at": "2025-03-03T06:54:14.346Z",
  "status": "completed",
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "duration": 450.5,
  "duration_minutes": 7.51,
  "transcript_url": "https://...amazonaws.com/sessions/.../transcript.txt",
  "evaluation_results": {
    "final_score": 7.4,
    "overall_score": "8/10",
    "strengths": "Excellent active listening",
    "weaknesses": "Could improve solution presentation",
    "report_card": [
      {
        "topic": "Communication",
        "score": 7.5,
        "note": "Clear and professional",
        "weight": 30
      }
    ]
  },
  "improvement_results": {
    "improvement_areas": "Solution presentation, follow-up",
    "action_items": "1. Present solutions step-by-step\n2. Confirm satisfaction",
    "resources": "- Customer Support Guide: [link]"
  },
  "extraction_results": {
    "sentiment": "positive",
    "pain_points": [
      "pricing"
    ]
  },
  "analytics_url": "https://app.toughtongueai.com/analysis/67c551...",
  "user_metadata": {
    "department": "sales",
    "priority": 5
  }
}
```

## Fields

### Identity

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string |  | Unique session identifier |
| `scenario_id` | string |  | Parent scenario ID |
| `scenario_name` | string |  | Cached scenario name at time of session |

### Lifecycle

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string |  | pending, in_progress, completed, failed |
| `created_at` | datetime |  | Session creation timestamp |
| `completed_at` | datetime |  | Session completion timestamp (null if not completed) |
| `duration` | number |  | Session duration in seconds |
| `duration_minutes` | number |  | Session duration in minutes (V2 endpoints only) |

### User Info

| Field | Type | Required | Description |
|---|---|---|---|
| `user_name` | string |  | Name of the user who ran the session |
| `user_email` | string |  | Email of the user (filterable via user_email param) |
| `user_metadata` | object |  | Inherited from scenario at session creation |

### Results

| Field | Type | Required | Description |
|---|---|---|---|
| `transcript_url` | string |  | Signed S3 URL to the conversation transcript |
| `evaluation_results` | object |  | Final score, strengths, weaknesses, report_card, detailed_feedback |
| `improvement_results` | object |  | Improvement areas, action items, resources |
| `extraction_results` | object |  | Structured data extracted per scenario.session_analysis.extraction_vars |
| `analytics_url` | string |  | Direct link to the session analysis page |

### Report Card

| Field | Type | Required | Description |
|---|---|---|---|
| `report_card[].topic` | string |  | Evaluation topic |
| `report_card[].score` | number |  | Score for the topic (0-10) |
| `report_card[].note` | string |  | Qualitative note for the topic |
| `report_card[].weight` | number |  | Weight of the topic in the final score |

