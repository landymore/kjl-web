import { Component, inject, computed, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  private breakpoint = inject(BreakpointObserver);
  isHandset = toSignal(
    this.breakpoint.observe(Breakpoints.Handset).pipe(map(r => r.matches)),
    { initialValue: false }
  );
  showMenu = computed(() => this.isHandset());

  @ViewChild('sidenav') sidenav!: MatSidenav;

  toggleSidenav(): void {
    this.sidenav?.toggle();
  }

  closeSidenav(): void {
    this.sidenav?.close();
  }
}
