import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ResenaServicio } from '../../servicios/resena-servicio';
import { ReporteServicio } from '../../servicios/reporte-servicio';
import { AuthServicio } from '../../servicios/auth-servicio';
import { Resena } from '../../modelos/resena';
import { ReporteResena } from '../../modelos/reporte-resena';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  resenasPendientes: Resena[] = [];
  reportes: ReporteResena[] = [];
  seccionActiva: string = 'resenas';
  cargando: boolean = false;
  mostrarConfirmacion: boolean = false;
  itemAEliminar: number | null = null;
  tipoEliminar: string = '';


  constructor(private route: ActivatedRoute, private resenaServicio: ResenaServicio, private reporteServicio: ReporteServicio, private authServicio: AuthServicio) { }

  ngOnInit(): void {
    this.cargarResenasPendientes();
    this.cargarReportes();
    this.route.queryParams.subscribe(params => {
      if (params['seccion']) {
        this.seccionActiva = params['seccion'];
      }
    });
  }

  cargarResenasPendientes(): void {
    this.cargando = true;
    this.resenaServicio.listarPendientes().subscribe({
      next: datos => {
        this.resenasPendientes = datos;
        this.cargando = false;
      },
      error: err => {
        console.error('Error al cargar reseñas pendientes', err);
        this.cargando = false;
      }
    });
  }

  cargarReportes(): void {
    this.reporteServicio.listar().subscribe({
      next: datos => this.reportes = datos,
      error: err => console.error('Error al cargar reportes', err)
    });
  }

  aprobarResena(id: number): void {
    this.resenaServicio.aprobar(id).subscribe({
      next: () => this.cargarResenasPendientes(),
      error: err => console.error('Error al aprobar reseña', err)
    });
  }

  rechazarResena(id: number): void {
    this.resenaServicio.rechazar(id).subscribe({
      next: () => this.cargarResenasPendientes(),
      error: err => console.error('Error al rechazar reseña', err)
    });
  }

  eliminarReporte(id: number): void {
    this.itemAEliminar = id;
    this.tipoEliminar = 'reporte';
    this.mostrarConfirmacion = true;
  }

  eliminarResenaReportada(resenaId: number): void {
    this.itemAEliminar = resenaId;
    this.tipoEliminar = 'resena';
    this.mostrarConfirmacion = true;
  }

  confirmarEliminar(): void {
    if (this.itemAEliminar === null) return;
    if (this.tipoEliminar === 'reporte') {
      this.reporteServicio.borrar(this.itemAEliminar).subscribe({
        next: () => {
          this.cargarReportes();
          this.mostrarConfirmacion = false;
          this.itemAEliminar = null;
        },
        error: err => console.error('Error al eliminar reporte', err)
      });
    } else if (this.tipoEliminar === 'resena') {
      this.resenaServicio.borrar(this.itemAEliminar).subscribe({
        next: () => {
          this.cargarReportes();
          this.cargarResenasPendientes();
          this.mostrarConfirmacion = false;
          this.itemAEliminar = null;
        },
        error: err => console.error('Error al eliminar reseña', err)
      });
    }
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacion = false;
    this.itemAEliminar = null;
  }

  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
  }

  estrellas(num: number): string[] {
    return Array.from({ length: 5 }, (_, i) =>
      i < num ? 'bi-star-fill' : 'bi-star'
    );
  }
}
