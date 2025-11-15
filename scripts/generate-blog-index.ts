// scripts/generate-blog-index.ts
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

// Create a fake DOM for DOMPurify
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window as any;
global.document = dom.window.document;
global.Node = dom.window.Node;

// Now DOMPurify works
import DOMPurify from 'dompurify';
const purify = DOMPurify(dom.window);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  published: boolean;
  tags: string[];
  description?: string;
  html: string;
}

function getString(data: Record<string, any>, key: string, fallback: string): string {
  const value = data[key];
  return typeof value === 'string' ? value : fallback;
}

function getStringOptional(data: Record<string, any>, key: string): string | undefined {
  const value = data[key];
  return typeof value === 'string' ? value : undefined;
}

function getStringArray(data: Record<string, any>, key: string): string[] {
  const value = data[key];
  return Array.isArray(value) && value.every(v => typeof v === 'string') ? value : [];
}

const postsDir = path.join(__dirname, '../src/assets/content/posts');
const outFile = path.join(__dirname, '../src/assets/content/posts-index.json');

async function run() {
  const files = await glob('*.md', { cwd: postsDir });

  if (files.length === 0) {
    console.warn('No .md files found — creating empty index.');
    fs.writeFileSync(outFile, JSON.stringify([], null, 2));
    return;
  }

  const index: PostMeta[] = files.map(file => {
    const slug = file.replace(/\.md$/, '');
    const fullPath = path.join(postsDir, file);
    const src = fs.readFileSync(fullPath, 'utf8');
    const parsed = matter(src);

    const rawHtml = marked(parsed.content);
    const cleanHtml = purify.sanitize(rawHtml as string);

    return {
      slug,
      title: getString(parsed.data, 'title', 'Untitled'),
      date: getString(parsed.data, 'date', new Date().toISOString().split('T')[0]),
      published: Boolean(parsed.data['published'] ?? true),
      tags: getStringArray(parsed.data, 'tags'),
      description: getStringOptional(parsed.data, 'description'),
      html: cleanHtml
    };
  });

  fs.writeFileSync(outFile, JSON.stringify(index, null, 2));
  console.log(`Generated posts-index.json with ${index.length} posts`);
}

run().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});