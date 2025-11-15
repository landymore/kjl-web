import { Component, OnInit } from '@angular/core';
import { BlogService, PostMeta } from './blog.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  standalone: true,
  styleUrl: './blog.component.css',
  imports: [DatePipe, RouterLink]
})
export class BlogComponent implements OnInit {
  posts: PostMeta[] = [];

  constructor(private blogService: BlogService) {}

  async ngOnInit() {
    this.posts = (await this.blogService.getAllPosts())
      .filter(p => p.published || this.isPreviewMode())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  isPreviewMode(): boolean {
    return window.location.hostname.includes('preview') || 
           localStorage.getItem('draft-preview') === 'true';
  }
}