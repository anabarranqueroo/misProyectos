import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmpresaServicio } from '../../servicios/empresa-servicio';
import { ResenaServicio } from '../../servicios/resena-servicio';
import { AuthServicio } from '../../servicios/auth-servicio';
import { Empresa } from '../../modelos/empresa';
import { Resena } from '../../modelos/resena';
import { ReporteServicio } from '../../servicios/reporte-servicio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empresa-details',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './empresa-details.html',
  styleUrl: './empresa-details.css',
})
export class EmpresaDetails implements OnInit {
  empresa: Empresa | null = null;
  resenas: Resena[] = [];
  mediaEstrellas: number = 0;
  cargando: boolean = true;

  mostrarFormResena: boolean = false;
  verTodasResenas: boolean = false;
  formResena: FormGroup;
  enviandoResena: boolean = false;
  errorResena: string = '';

  estrellasSeleccionadas: number = 0;
  mostrarConfirmacion: boolean = false;
  resenaEliminar: number | null = null;

  mostrarFormReporte: boolean = false;
  resenaAReportar: number | null = null;
  motivoReporte: string = '';
  enviandoReporte: boolean = false;
  errorReporte: string = '';

  constructor(private route: ActivatedRoute, private empresaServicio: EmpresaServicio, private resenaServicio: ResenaServicio, private reporteServicio: ReporteServicio, public authServicio: AuthServicio, private fb: FormBuilder) {
    this.formResena = this.fb.group({
      titulo: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      contenido: this.fb.control('', [Validators.required, Validators.minLength(10)]),
      estrella: this.fb.control(0, [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarEmpresa(id);
    this.cargarResenas(id);
    this.cargarMedia(id);
  }

  cargarEmpresa(id: number): void {
    this.empresaServicio.obtener(id).subscribe({
      next: datos => {
        this.empresa = datos;
        this.cargando = false;
      },
      error: err => {
        console.error('Error al cargar empresa', err);
        this.cargando = false;
      }
    });
  }

  cargarResenas(id: number): void {
    this.resenaServicio.listarPorEmpresa(id).subscribe({
      next: datos => this.resenas = datos,
      error: err => console.error('Error al cargar reseñas', err)
    });
  }

  cargarMedia(id: number): void {
    this.resenaServicio.mediaEstrellas(id).subscribe({
      next: datos => this.mediaEstrellas = datos,
      error: err => console.error('Error al cargar la media', err)
    });
  }

  estrellas(media: number): string[] {
    return Array.from({ length: 5 }, (_, i) => {
      if (i < Math.floor(media)) return 'bi-star-fill';
      if (i < media) return 'bi-star-half';
      return 'bi-star';
    });
  }

  toggleFormResena(): void {
    this.mostrarFormResena = !this.mostrarFormResena;
    if (!this.mostrarFormResena) {
      this.formResena.reset();
      this.estrellasSeleccionadas = 0;
      this.errorResena = '';
    }
  }

  toggleVerTodas(): void {
    this.verTodasResenas = !this.verTodasResenas;
  }

  get resenasMostradas(): Resena[] {
    return this.verTodasResenas ? this.resenas : this.resenas.slice(0, 3);
  }

  porcentajeEstrellas(num: number): number {
    if (this.resenas.length === 0) return 0;
    const cantidad = this.resenas.filter(r => r.estrella === num).length;
    return Math.round((cantidad / this.resenas.length) * 100);
  }

  seleccionarEstrella(num: number): void {
    this.estrellasSeleccionadas = num;
    this.formResena.patchValue({ estrella: num });
  }

  enviarResena(): void {
    if (this.formResena.invalid) {
      this.formResena.markAllAsTouched();
      return;
    }
    this.enviandoResena = true;
    this.errorResena = '';
    const sesion = this.authServicio.obtenerSesion();
    const resena: Resena = {
      titulo: this.formResena.value.titulo,
      contenido: this.formResena.value.contenido,
      estrella: this.formResena.value.estrella,
      empresa: { id: this.empresa!.id } as any,
      usuario: { id: sesion!.id } as any
    };

    this.resenaServicio.crear(resena).subscribe({
      next: () => {
        this.enviandoResena = false;
        this.mostrarFormResena = false;
        this.formResena.reset();
        this.estrellasSeleccionadas = 0;
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.cargarResenas(id);
        this.cargarMedia(id);
      },
      error: (err) => {
        const mensaje = err.error?.message || '';
        if (mensaje.includes('email') || mensaje.includes('registrado')) {
          this.errorResena = 'Usted ya ha escrito una reseña en esta empresa. Elimina la anterior para volver a escribir una nueva.';
        } else {
          this.errorResena = 'Error al enviar la reseña';
        }
        this.enviandoResena = false;
      }
    });
  }

  eliminarResena(id: number): void {
    this.resenaEliminar = id;
    this.mostrarConfirmacion = true;
  }

  confirmarEliminar(): void {
    if (this.resenaEliminar === null) return;
    this.resenaServicio.borrar(this.resenaEliminar).subscribe({
      next: () => {
        const empresaId = Number(this.route.snapshot.paramMap.get('id'));
        this.cargarResenas(empresaId);
        this.cargarMedia(empresaId);
        this.mostrarConfirmacion = false;
        this.resenaEliminar = null;
      },
      error: err => console.error('Error al eliminar reseña', err)
    });
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacion = false;
    this.resenaEliminar = null;
  }

  reportarResena(id: number): void {
    this.resenaAReportar = id;
    this.mostrarFormReporte = true;
    this.motivoReporte = '';
    this.errorReporte = '';
  }

  cancelarReporte(): void {
    this.mostrarFormReporte = false;
    this.resenaAReportar = null;
    this.motivoReporte = '';
    this.errorReporte = '';
  }

  enviarReporte(): void {
    if (!this.motivoReporte.trim() || this.motivoReporte.length < 10) {
      this.errorReporte = 'El motivo debe tener al menos 10 caracteres';
      return;
    }
    this.enviandoReporte = true;
    const sesion = this.authServicio.obtenerSesion();
    const reporte = {
      motivo: this.motivoReporte,
      resena: {
        id: this.resenaAReportar
      } as any,
      usuario: {
        id: sesion!.id
      } as any
    };
    this.reporteServicio.crear(reporte).subscribe({
      next: () => {
        this.mostrarFormReporte = false;
        this.resenaAReportar = null;
        this.motivoReporte = '';
        this.enviandoReporte = false;
      },
      error: (err) => {
        this.errorReporte = err.error?.message || 'Error al enviar el reporte';
        this.enviandoReporte = false;
      }
    });
  }
}
