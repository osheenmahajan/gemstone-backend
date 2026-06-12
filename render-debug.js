import { execSync } from 'node:child_process';

console.log('--- Render debug: cwd/files ---');
console.log('cwd:', process.cwd());

try {
  console.log('dotenv resolve:', await import('dotenv').then(() => 'OK').catch(() => 'FAIL'));
} catch {
  console.log('dotenv import FAIL');
}

try {
  const pkg = JSON.parse(execSync('node -p "require(\\\"./package.json\\\").dependencies.d..."', { stdio: 'pipe', encoding: 'utf8' }).trim());
  console.log('package json check ok');
} catch {}

console.log('--- npm ls dotenv (may be large) ---');
try {
  console.log(execSync('npm ls dotenv --depth=0', { encoding: 'utf8' }));
} catch (e) {
  console.log(String(e.stdout || e.message || e));
}

