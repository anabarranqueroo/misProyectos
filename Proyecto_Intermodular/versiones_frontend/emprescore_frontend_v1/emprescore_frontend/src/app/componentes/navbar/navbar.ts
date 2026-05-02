import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServicio } from '../../servicios/auth-servicio';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(public authServicio: AuthServicio, private router: Router){}

  cerrarSesion(): void {
    this.authServicio.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
