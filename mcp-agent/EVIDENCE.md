# Model Context Protocol (MCP) Working Setup & Tool Evidence

**Client**: `flyrank-mcp-client`  
**Server**: `fl04-build-in-public-mcp-server`  
**Protocol**: JSON-RPC 2.0 via `stdio` transport  
**Verification Date**: 2026-09-05T16:58:01.368Z  

---

## 1. Handshake & Tool Discovery

The MCP client established standard JSON-RPC 2.0 connection over `stdio` and discovered three model-controlled tools:
```json
[
  {
    "name": "read_git_activity",
    "description": "Reads live local git repository commits and diffs from disk. Plain chat cannot inspect local git history.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "number",
          "description": "Number of commits to inspect"
        }
      }
    }
  },
  {
    "name": "read_voice_card",
    "description": "Reads local voice card guidelines directly from filesystem. Plain chat cannot read local files.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "filePath": {
          "type": "string",
          "description": "Relative path to voice card"
        }
      }
    }
  },
  {
    "name": "verify_platform_constraints",
    "description": "Queries live external platform limits to validate post character counts and link formatting.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "platform": {
          "type": "string",
          "enum": [
            "x",
            "linkedin"
          ]
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "platform",
        "text"
      ]
    }
  }
]
```

---

## 2. Evidence: Three Tasks Chat Alone Cannot Do

### 🛠️ Task 1: Live Git Repository Inspection (`read_git_activity`)
* **Why Chat Alone Cannot Do This**: A static LLM chat interface has no access to the developer's local shell or `.git` directory. It cannot see uncommitted changes or recent commit hashes.
* **MCP Tool Output**:
```json
{
  "recentCommits": [
    "864f3fe feat(chat): implement ChefCraft AI streaming chat interface with auto-scroll, stop lifecycle, and prompt logs",
    "8dc9d41 docs: add dedicated playground/PROMPTS.md for Foundations A11y milestone",
    "d207016 feat(a11y): implement W3C APG Modal, Tabs, and Disclosure components with playground and NOTES.md"
  ],
  "modifiedFiles": [
    "?? mcp-agent/"
  ],
  "timestamp": "2026-09-05T16:58:01.366Z"
}
```

---

### 🛠️ Task 2: Filesystem Voice Card Retrieval (`read_voice_card`)
* **Why Chat Alone Cannot Do This**: A plain LLM chat window cannot open, read, or parse arbitrary local filesystem files (`voice-card.json`) on the host machine.
* **MCP Tool Output**:
```json
{
  "voice": "FlyRank Build-in-Public Voice Card",
  "tone": ["sharp", "grounded", "confident", "technical", "humble"],
  "rules": [
    "No marketing buzzwords (e.g. game-changing, revolutionary, synergy)",
    "Always state the specific technical challenge or bug encountered",
    "Quantify results where possible (time saved, lines changed, test count)",
    "Include day counter or project milestone reference"
  ],
  "platformConstraints": {
    "x_max_characters": 280,
    "linkedin_max_characters": 3000
  }
}

```

---

### 🛠️ Task 3: Live Social Platform Constraint Verification (`verify_platform_constraints`)
* **Why Chat Alone Cannot Do This**: Plain LLM token counters are notoriously inaccurate for multi-byte Unicode strings, URLs, and platform-specific truncation rules. The MCP tool performs deterministic, machine-validated constraint checks.
* **MCP Tool Output**:
```json
{
  "platform": "x",
  "characterCount": 165,
  "maxAllowed": 280,
  "compliant": true,
  "remaining": 115,
  "hasUrl": false,
  "verifiedAt": "2026-09-05T16:58:01.370Z"
}
```
