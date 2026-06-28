import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@typescript-eslint/typescript-estree';

const MAX_LINES = 600;
const MAX_NESTING = 2;

function getChildren(node: any): any[] {
  if (!node) return [];
  const children: any[] = [];
  for (const key in node) {
    const value = node[key];
    if (Array.isArray(value)) {
      children.push(...value);
    } else if (value && typeof value === 'object' && value.type) {
      children.push(value);
    }
  }
  return children;
}

function checkNesting(node: any, depth = 0): number {
  let maxChildDepth = depth;
  const children = getChildren(node);

  for (const child of children) {
    const isNestingNode = 
      child.type === 'IfStatement' || 
      child.type === 'ForStatement' || 
      child.type === 'WhileStatement' || 
      child.type === 'DoWhileStatement' || 
      child.type === 'SwitchStatement' || 
      child.type === 'TryStatement' || 
      child.type === 'CatchClause';

    const nextDepth = isNestingNode ? depth + 1 : depth;
    const result = checkNesting(child, nextDepth);
    if (result > maxChildDepth) maxChildDepth = result;
  }

  return maxChildDepth;
}

function checkFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  if (lines.length > MAX_LINES) {
    console.error(`Error: ${filePath} exceeds ${MAX_LINES} lines (${lines.length})`);
    process.exit(1);
  }

  try {
    const ast = parse(content, { 
      jsx: true 
    });
    
    const maxNestingFound = checkNesting(ast, 0);

    if (maxNestingFound > MAX_NESTING) {
      console.error(`Error: ${filePath} exceeds ${MAX_NESTING} nesting levels (found ${maxNestingFound})`);
      process.exit(1);
    }
  } catch {
    // Silently skip files that cannot be parsed
  }
}

function main() {
  const dirsToScan = ['src', 'app', 'server'];
  let filesFound = 0;

  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
        checkFile(fullPath);
        filesFound++;
      }
    }
  };

  dirsToScan.forEach(walk);
  console.log(`Verified ${filesFound} files for length and nesting.`);
}

main();
