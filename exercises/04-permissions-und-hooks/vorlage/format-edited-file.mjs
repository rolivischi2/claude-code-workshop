#!/usr/bin/env node
// PostToolUse hook (Edit|Write): formats ONLY the file Claude just edited.
// Runs the same on macOS and Windows (Node, no shell script). Wired up in .claude/settings.json.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const isWindows = process.platform === 'win32';
const input = JSON.parse(readFileSync(0, 'utf8'));
const projectDir = process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();

/** Spotless matches -DspotlessFiles as a regex against absolute paths, with OS separators. */
function spotlessRegex(pathInBackend) {
  const escaped = pathInBackend.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').split('/').join('[\\\\/]');
  return `.*[\\\\/]${escaped}`;
}

/**
 * Decides how to format one file.
 *
 * @param {string} relPath path relative to the project root, always with "/" (e.g. "app/backend/src/.../Foo.java")
 * @returns {{cwd: string, command: string, args: string[]} | null}
 *   cwd is relative to the project root; null means "leave this file alone".
 *
 * Available tools:
 *   - Java (app/backend):  mvnw (./mvnw, on Windows mvnw.cmd) with
 *       -q spotless:apply -DspotlessFiles=<spotlessRegex(path inside app/backend)>
 *   - Frontend (app/frontend): npx (on Windows npx.cmd) prettier --write <path inside app/frontend>
 *
 * Only app code is formatted. Everything else (docs, .claude/, rag/) is left alone on purpose:
 * Prettier would happily reflow German exercise markdown and generate noisy diffs.
 * The JVM start of Spotless (~2-4 s) is accepted for .java files; it is still far cheaper
 * than a model turn spent on formatting.
 */
const FRONTEND_EXTENSIONS = /\.(ts|html|css|scss|json)$/;

function formatterFor(relPath) {
  if (relPath.startsWith('app/backend/src/') && relPath.endsWith('.java')) {
    const inBackend = relPath.slice('app/backend/'.length);
    return {
      cwd: 'app/backend',
      command: isWindows ? 'mvnw.cmd' : './mvnw',
      args: ['-q', 'spotless:apply', `-DspotlessFiles=${spotlessRegex(inBackend)}`],
    };
  }
  if (relPath.startsWith('app/frontend/') && FRONTEND_EXTENSIONS.test(relPath)) {
    return {
      cwd: 'app/frontend',
      command: isWindows ? 'npx.cmd' : 'npx',
      args: ['prettier', '--write', relPath.slice('app/frontend/'.length)],
    };
  }
  return null;
}

const filePath = input.tool_input?.file_path;
if (!filePath) process.exit(0);
const relPath = path.relative(projectDir, path.resolve(projectDir, filePath)).split(path.sep).join('/');

const plan = formatterFor(relPath);
if (!plan) process.exit(0);

// .cmd files (mvnw.cmd, npx.cmd) can only be started through a shell on Windows.
const result = spawnSync(plan.command, plan.args, {
  cwd: path.join(projectDir, plan.cwd),
  encoding: 'utf8',
  shell: isWindows,
  timeout: 60_000,
});

if (result.status !== 0) {
  // Exit 2 in PostToolUse shows stderr to Claude (the edit already happened), so it can react,
  // e.g. fix a syntax error that made the formatter fail.
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim().split('\n').slice(-10).join('\n');
  console.error(`Formatting ${relPath} failed:\n${output || result.error?.message || 'unknown error'}`);
  process.exit(2);
}
process.exit(0);
