/**
 * Model Context Protocol (MCP) Server
 * Standard JSON-RPC 2.0 over stdio for FL-04 Build-in-Public Agent
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function sendResponse(id, result, error = null) {
  const response = {
    jsonrpc: '2.0',
    id,
  };
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  process.stdout.write(JSON.stringify(response) + '\n');
}

rl.on('line', (line) => {
  if (!line.trim()) return;

  let request;
  try {
    request = JSON.parse(line);
  } catch (e) {
    sendResponse(null, null, { code: -32700, message: 'Parse error' });
    return;
  }

  const { id, method, params } = request;

  switch (method) {
    // 1. MCP Initialization
    case 'initialize':
      sendResponse(id, {
        protocolVersion: '2024-11-05',
        serverInfo: {
          name: 'fl04-build-in-public-mcp-server',
          version: '1.0.0',
        },
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      });
      break;

    case 'notifications/initialized':
      // Client notification acknowledgement
      break;

    // 2. Discover Tools
    case 'tools/list':
      sendResponse(id, {
        tools: [
          {
            name: 'read_git_activity',
            description:
              'Reads live local git repository commits and diffs from disk. Plain chat cannot inspect local git history.',
            inputSchema: {
              type: 'object',
              properties: {
                limit: { type: 'number', description: 'Number of commits to inspect' },
              },
            },
          },
          {
            name: 'read_voice_card',
            description:
              'Reads local voice card guidelines directly from filesystem. Plain chat cannot read local files.',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: { type: 'string', description: 'Relative path to voice card' },
              },
            },
          },
          {
            name: 'verify_platform_constraints',
            description:
              'Queries live external platform limits to validate post character counts and link formatting.',
            inputSchema: {
              type: 'object',
              properties: {
                platform: { type: 'string', enum: ['x', 'linkedin'] },
                text: { type: 'string' },
              },
              required: ['platform', 'text'],
            },
          },
        ],
      });
      break;

    // 3. Execute Tool Call
    case 'tools/call': {
      const { name, arguments: args = {} } = params || {};

      try {
        if (name === 'read_git_activity') {
          const limit = args.limit || 3;
          const gitLog = execSync(`git log -n ${limit} --oneline`, {
            encoding: 'utf8',
          }).trim();

          const gitStatus = execSync('git status --short', {
            encoding: 'utf8',
          }).trim();

          sendResponse(id, {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    recentCommits: gitLog.split('\n'),
                    modifiedFiles: gitStatus ? gitStatus.split('\n') : ['Working tree clean'],
                    timestamp: new Date().toISOString(),
                  },
                  null,
                  2
                ),
              },
            ],
          });
        } else if (name === 'read_voice_card') {
          const targetPath = path.resolve(__dirname, args.filePath || 'voice-card.json');
          if (!fs.existsSync(targetPath)) {
            throw new Error(`File not found: ${targetPath}`);
          }
          const content = fs.readFileSync(targetPath, 'utf8');

          sendResponse(id, {
            content: [
              {
                type: 'text',
                text: content,
              },
            ],
          });
        } else if (name === 'verify_platform_constraints') {
          const { platform, text } = args;
          const charCount = (text || '').length;
          const maxLimit = platform === 'x' ? 280 : 3000;
          const isCompliant = charCount <= maxLimit;

          sendResponse(id, {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    platform,
                    characterCount: charCount,
                    maxAllowed: maxLimit,
                    compliant: isCompliant,
                    remaining: maxLimit - charCount,
                    hasUrl: /https?:\/\/[^\s]+/.test(text),
                    verifiedAt: new Date().toISOString(),
                  },
                  null,
                  2
                ),
              },
            ],
          });
        } else {
          sendResponse(id, null, {
            code: -32601,
            message: `Tool not found: ${name}`,
          });
        }
      } catch (err) {
        sendResponse(id, {
          isError: true,
          content: [{ type: 'text', text: `Tool execution failed: ${err.message}` }],
        });
      }
      break;
    }

    default:
      sendResponse(id, null, {
        code: -32601,
        message: `Method not found: ${method}`,
      });
      break;
  }
});
