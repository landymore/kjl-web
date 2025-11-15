import { Routes } from '@angular/router';
import { Home } from './home/home';
import { BlogComponent } from './blog/blog.component';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'blog', loadComponent: () => import('./blog/blog.component').then(m => m.BlogComponent) },
    { path: 'blog/:slug', loadComponent: () => import('./blog/post/post.component').then(m => m.PostComponent) },
    { path: '**', redirectTo: '' }
];
