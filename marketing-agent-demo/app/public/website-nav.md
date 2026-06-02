# The Camellias — Agent Navigation Guide

This is the single source of truth for the embedded ToughTongue AI navigation
agent. The agent receives this file as dynamic context and should use these
routes, anchors, and intent rules when guiding a visitor.

Important naming rule: the public experience calls these pages **Properties** or
**Property Stories**. The route remains `/slides` for backward compatibility
with existing scenario tools and shared links.

---

## Site Areas

| Area                   | Path        | Use when                                            |
| ---------------------- | ----------- | --------------------------------------------------- |
| Landing page           | `/`         | Start, project story, highlights, designers, CTA    |
| Properties collection  | `/slides`   | Let the visitor choose a residence or amenity story |
| Property story viewer  | `/slides/…` | Full-screen guided property scenes                  |
| Admin navigation panel | `/admin`    | Internal testing only                               |

---

## Landing Page Anchors

| Visitor-facing label | Command                            | What it shows                                  |
| -------------------- | ---------------------------------- | ---------------------------------------------- |
| The Project          | `{ "section": "#intro" }`          | Project positioning, architecture, DLF context |
| Highlights           | `{ "section": "#highlights" }`     | Address, residence scale, landscape            |
| Sustainability       | `{ "section": "#sustainability" }` | LEED Platinum and green-building pillars       |
| Grand Masters        | `{ "section": "#masters" }`        | Architecture, interiors, landscape, wellness   |
| Properties           | `{ "url": "/slides" }`             | Property story index                           |
| Consultation         | `{ "section": "#consultation" }`   | Private briefing CTA with Priya                |

---

## Property Stories

### Collection Index

Use `{ "url": "/slides" }` when the visitor asks to see all properties,
residence options, apartments, penthouses, amenities, or the full presentation.

### Canonical Property Routes

| Property story       | URL base                       | Scenes | Best use                                          |
| -------------------- | ------------------------------ | ------ | ------------------------------------------------- |
| Wraparound Residence | `/slides/wraparound-residence` | 5      | 4-BHK corner residence, golf views, family living |
| Sky Penthouse        | `/slides/sky-penthouse`        | 5      | Penthouse, terrace entertaining, high vantage     |
| Amenities and Club   | `/slides/amenities`            | 4      | Clubhouse, wellness, golf, lifestyle              |

## Scene Index

### Wraparound Residence

| Scene | URL                              | Headline                            |
| ----- | -------------------------------- | ----------------------------------- |
| 1     | `/slides/wraparound-residence/1` | The Wraparound Residence            |
| 2     | `/slides/wraparound-residence/2` | An open arrival, a private wing     |
| 3     | `/slides/wraparound-residence/3` | Configuration & Areas               |
| 4     | `/slides/wraparound-residence/4` | Light, gathered along the long edge |
| 5     | `/slides/wraparound-residence/5` | Four bedrooms. Four moods           |

### Sky Penthouse

| Scene | URL                       | Headline                            |
| ----- | ------------------------- | ----------------------------------- |
| 1     | `/slides/sky-penthouse/1` | The Sky Penthouse                   |
| 2     | `/slides/sky-penthouse/2` | A garden in the sky                 |
| 3     | `/slides/sky-penthouse/3` | Configuration & Areas               |
| 4     | `/slides/sky-penthouse/4` | Double-height. Single horizon       |
| 5     | `/slides/sky-penthouse/5` | A suite with three windows of light |

### Amenities and Club

| Scene | URL                   | Headline                                        |
| ----- | --------------------- | ----------------------------------------------- |
| 1     | `/slides/amenities/1` | The Camellias Club                              |
| 2     | `/slides/amenities/2` | Spa, pools and a fitness studio above the trees |
| 3     | `/slides/amenities/3` | Two championship courses, one drive away        |
| 4     | `/slides/amenities/4` | A short list, kept short                        |

---

## Navigation Decisions

| Visitor intent                        | Recommended command                                                                     |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| "Tell me about the project"           | `{ "section": "#intro" }`                                                               |
| "What makes it special?"              | `{ "section": "#highlights" }`                                                          |
| "Show me the apartments / residences" | `{ "url": "/slides/wraparound-residence/1" }`                                           |
| "Show me the penthouse"               | `{ "url": "/slides/sky-penthouse/1" }`                                                  |
| "What are the amenities?"             | `{ "url": "/slides/amenities/1" }`                                                      |
| "Show floor plan / area / specs"      | `{ "url": "/slides/wraparound-residence/3" }` or `{ "url": "/slides/sky-penthouse/3" }` |
| "Is it sustainable / LEED?"           | `{ "section": "#sustainability" }`                                                      |
| "Who designed it?"                    | `{ "section": "#masters" }`                                                             |
| "Book a visit / call / consultation"  | `{ "section": "#consultation" }`                                                        |
| "Show all properties"                 | `{ "url": "/slides" }`                                                                  |
| "Go home"                             | `{ "url": "/" }`                                                                        |

---

## Command Protocol

The agent should call the configured ToughTongue AI custom function endpoint:

```json
{ "session_code": "ABCD", "url": "/slides/sky-penthouse/1" }
```

or:

```json
{ "session_code": "ABCD", "section": "#highlights" }
```

The full deployed endpoint path is `/api/agent-navigate`.
