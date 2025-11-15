import { Component, OnInit } from '@angular/core';
import { BlogService, Post } from '../blog.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  standalone: true,
  imports: [DatePipe]
})
export class PostComponent implements OnInit {
  post: Post | null = null;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.post = await this.blogService.getPost(slug);
    }
  }
}