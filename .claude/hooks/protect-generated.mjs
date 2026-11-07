#!/usr/bin/env node
// PreToolUse hook (Edit|Write): blocks edits to generated code.
// Exit code 2 blocks the tool call; the stderr text is shown to Claude as the reason.
import { readFileSync } from 'node:fs';
import path from 'node:path';

const PROTECTED = 'app/frontend/src/generated/';

const input = JSON.parse(readFileSync(0, 'utf8'));
const filePath = input.tool_input?.file_path;
if (!filePath) process.exit(0);

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();
const relative = path.relative(projectDir, path.resolve(projectDir, filePath)).split(path.sep).join('/');

if (relative.startsWith(PROTECTED)) {
  console.error(
    `Blocked: ${relative} is generated from the backend OpenAPI spec and must not be edited by hand. ` +
      'Change the backend DTOs instead and regenerate the client.',
  );
  process.exit(2);
}
process.exit(0);
