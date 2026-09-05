/**
 * Model Context Protocol (MCP) Client Runner
 * Connects to mcpServer.js over stdio and executes the 3 required tasks.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const serverPath = path.join(__dirname, 'server.js');
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit'],
});

let currentId = 1;
const pending = new Map();
const executionLog = [];

function logEntry(type, title, data) {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] [${type}] ${title}`);
  if (data) console.log(typeof data === 'string' ? data : JSON.stringify(data, null, 2));

  executionLog.push({
    timestamp,
    type,
    title,
    data,
  });
}

// Read JSON-RPC responses from MCP server
let buffer = '';
server.stdout.on('data', (chunk) => {
  buffer += chunk.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop(); // Keep partial line

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      if (msg.id && pending.has(msg.id)) {
        const { resolve } = pending.get(msg.id);
        pending.delete(msg.id);
        resolve(msg);
      }
    } catch (e) {
      console.error('Failed to parse response:', line);
    }
  }
});

function sendRpc(method, params = {}) {
  const id = currentId++;
  const payload = {
    jsonrpc: '2.0',
    id,
    method,
    params,
  };

  logEntry('REQUEST', `${method} (ID: ${id})`, payload);

  return new Promise((resolve) => {
    pending.set(id, { resolve });
    server.stdin.write(JSON.stringify(payload) + '\n');
  });
}

async function runMcpWorkflow() {
  console.log('================================================================');
  console.log('MODEL CONTEXT PROTOCOL (MCP) CLIENT DEMONSTRATION');
  console.log('FL-04 Build-in-Public Autonomous Agent Setup');
  console.log('================================================================');

  // Step 1: Initialize Handshake
  const initRes = await sendRpc('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'flyrank-mcp-client', version: '1.0.0' },
  });
  logEntry('RESPONSE', 'initialize Result', initRes.result);

  // Step 2: Discover Available Tools
  const toolsRes = await sendRpc('tools/list', {});
  logEntry('RESPONSE', 'tools/list Result', toolsRes.result);

  // Task 1: Read local Git activity (Something chat alone cannot do)
  console.log('\n--- TASK 1: Live Git Repository Inspection ---');
  const task1Res = await sendRpc('tools/call', {
    name: 'read_git_activity',
    arguments: { limit: 3 },
  });
  logEntry('TASK_1_RESULT', 'read_git_activity Output', task1Res.result?.content?.[0]?.text);

  // Task 2: Read local Voice Card from disk (Something chat alone cannot do)
  console.log('\n--- TASK 2: Filesystem Voice Card Retrieval ---');
  const task2Res = await sendRpc('tools/call', {
    name: 'read_voice_card',
    arguments: { filePath: 'voice-card.json' },
  });
  logEntry('TASK_2_RESULT', 'read_voice_card Output', task2Res.result?.content?.[0]?.text);

  // Task 3: Verify platform constraints (Simulating live constraint engine)
  console.log('\n--- TASK 3: Live Social Platform Constraint Verification ---');
  const sampleXPost =
    'Shipped the streaming chat interface for RecipeCraft today! Handled auto-scroll decoupling and resilient stop-then-send state. 29/29 Vitest tests passing. Day 18/30.';
  const task3Res = await sendRpc('tools/call', {
    name: 'verify_platform_constraints',
    arguments: {
      platform: 'x',
      text: sampleXPost,
    },
  });
  logEntry('TASK_3_RESULT', 'verify_platform_constraints Output', task3Res.result?.content?.[0]?.text);

  server.kill();

  // Write Evidence Markdown
  const evidenceMarkdown = `# Model Context Protocol (MCP) Working Setup & Tool Evidence

**Client**: \`flyrank-mcp-client\`  
**Server**: \`fl04-build-in-public-mcp-server\`  
**Protocol**: JSON-RPC 2.0 via \`stdio\` transport  
**Verification Date**: ${new Date().toISOString()}  

---

## 1. Handshake & Tool Discovery

The MCP client established standard JSON-RPC 2.0 connection over \`stdio\` and discovered three model-controlled tools:
\`\`\`json
${JSON.stringify(toolsRes.result.tools, null, 2)}
\`\`\`

---

## 2. Evidence: Three Tasks Chat Alone Cannot Do

### 🛠️ Task 1: Live Git Repository Inspection (\`read_git_activity\`)
* **Why Chat Alone Cannot Do This**: A static LLM chat interface has no access to the developer's local shell or \`.git\` directory. It cannot see uncommitted changes or recent commit hashes.
* **MCP Tool Output**:
\`\`\`json
${task1Res.result?.content?.[0]?.text}
\`\`\`

---

### 🛠️ Task 2: Filesystem Voice Card Retrieval (\`read_voice_card\`)
* **Why Chat Alone Cannot Do This**: A plain LLM chat window cannot open, read, or parse arbitrary local filesystem files (\`voice-card.json\`) on the host machine.
* **MCP Tool Output**:
\`\`\`json
${task2Res.result?.content?.[0]?.text}
\`\`\`

---

### 🛠️ Task 3: Live Social Platform Constraint Verification (\`verify_platform_constraints\`)
* **Why Chat Alone Cannot Do This**: Plain LLM token counters are notoriously inaccurate for multi-byte Unicode strings, URLs, and platform-specific truncation rules. The MCP tool performs deterministic, machine-validated constraint checks.
* **MCP Tool Output**:
\`\`\`json
${task3Res.result?.content?.[0]?.text}
\`\`\`
`;

  fs.writeFileSync(path.join(__dirname, 'EVIDENCE.md'), evidenceMarkdown);
  console.log('\n[SUCCESS] MCP evidence written to mcp-agent/EVIDENCE.md!');
}

runMcpWorkflow().catch(console.error);
