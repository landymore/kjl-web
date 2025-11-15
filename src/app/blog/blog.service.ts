// src/app/blog/blog.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  published: boolean;
  tags: string[];
  description?: string;
  html?: string;
}

export interface Post {
  meta: PostMeta;
  html: SafeHtml;
}

// Safe extraction helpers
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

@Injectable({ providedIn: 'root' })
export class BlogService {
  private indexUrl = '/assets/content/posts-index.json';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    // marked@17: headerId exists at runtime, but types are outdated → cast to any
    (marked.setOptions as any)({
      gfm: true,
      headerId: true,
      mangle: true,
      smartLists: true
    });
  }

  async getAllPosts(): Promise<PostMeta[]> {
    try {
      const index: PostMeta[] = await firstValueFrom(this.http.get<PostMeta[]>(this.indexUrl));
      const isPreview = this.isPreviewMode();
      return index
        .filter(p => p.published || isPreview)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch {
      return [];
    }
  }

  async getPost(slug: string): Promise<Post | null> {
  try {
    const index: PostMeta[] = await firstValueFrom(this.http.get<PostMeta[]>(this.indexUrl));
    const post = index.find(p => p.slug === slug && (p.published || this.isPreviewMode()));

    if (!post || !post.html) return null;

    const safeHtml = this.sanitizer.bypassSecurityTrustHtml(post.html);
    return { meta: post, html: safeHtml };
  } catch {
    return null;
  }
}

  private isPreviewMode(): boolean {
    return (
      typeof location !== 'undefined' &&
      (location.hostname.includes('preview') || localStorage.getItem('draft-preview') === 'true')
    );
  }
}