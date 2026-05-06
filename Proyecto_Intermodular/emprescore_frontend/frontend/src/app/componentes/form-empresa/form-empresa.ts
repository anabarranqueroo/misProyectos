import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { EmpresaServicio } from '../../servicios/empresa-servicio';
import { CategoriaServicio } from '../../servicios/categoria-servicio';
import { AuthServicio } from '../../servicios/auth-servicio';
import { Empresa } from '../../modelos/empresa';
import { Categoria } from '../../modelos/categoria';
import { Usuario } from '../../modelos/usuario';

@Component({
  selector: 'app-form-empresa',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-empresa.html',
  styleUrl: './form-empresa.css',
})
export class FormEmpresa implements OnInit {
  form: FormGroup;
  titulo: string = 'Crear empresa';
  idEmpresa: number = -1;
  categorias: Categoria[] = [];
  cargando: boolean = false;
  errorMensaje: string = '';

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private location: Location, private empresaServicio: EmpresaServicio, private categoriaServicio: CategoriaServicio, private authServicio: AuthServicio) {
    this.form = this.fb.group({
      nombre: this.fb.control('', [Validators.required, Validators.minLength(2)]),
      descripcion: this.fb.control('', [Validators.required, Validators.minLength(10)]),
      categoriaId: this.fb.control('', [Validators.required]),
      telefono: this.fb.control(''),
      emailContacto: this.fb.control('', [Validators.email]),
      web: this.fb.control('')
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
    const id = this.route.snapshot.paramMap.get('id');
    this.idEmpresa = id ? Number(id) : -1;

    if (this.idEmpresa === -1 && this.authServicio.esEmpresa()) {
      const sesion = this.authServicio.obtenerSesion();
      this.empresaServicio.listar().subscribe({
        next: (empresas) => {
          const miEmpresa = empresas.find(e => e.usuario?.id === sesion?.id);
          if (miEmpresa) {
            this.idEmpresa = miEmpresa.id!;
            this.titulo = 'Mi empresa';
            this.form.patchValue({
              nombre: miEmpresa.nombre,
              descripcion: miEmpresa.descripcion,
              categoriaId: miEmpresa.categoria?.id,
              telefono: miEmpresa.telefono,
              emailContacto: miEmpresa.emailContacto,
              web: miEmpresa.web
            });
          }
        },
        error: err => console.error('Error al buscar empresa', err)
      });
    } else if (this.idEmpresa !== -1) {
      this.titulo = 'Editar empresa';
      this.empresaServicio.obtener(this.idEmpresa).subscribe({
        next: datos => {
          this.form.patchValue({
            nombre: datos.nombre,
            descripcion: datos.descripcion,
            categoriaId: datos.categoria?.id,
            telefono: datos.telefono,
            emailContacto: datos.emailContacto,
            web: datos.web
          });
        },
        error: err => console.error('Error al cargar empresa', err)
      });
    }
  }

  cargarCategorias(): void {
    this.categoriaServicio.listar().subscribe({
      next: datos => this.categorias = datos,
      error: err => console.error('Error al cargar las categorias', err)
    });
  }

  envio(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.errorMensaje = '';

    const sesion = this.authServicio.obtenerSesion();
    const empresa: Empresa = {
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      telefono: this.form.value.telefono,
      emailContacto: this.form.value.emailContacto,
      web: this.form.value.web,
      categoria: {
        id: Number(this.form.value.categoriaId)
      } as any,
      usuario: {
        id: sesion!.id
      } as any
    };

    if (this.idEmpresa === -1) {
      this.empresaServicio.crear(empresa).subscribe({
        next: () => this.router.navigate(['/']),
        error: err => {
          this.errorMensaje = err.error?.message || 'Error al crear la empresa';
          this.cargando = false;
        }
      });
    } else {
      empresa.id = this.idEmpresa;
      this.empresaServicio.editar(this.idEmpresa, empresa).subscribe({
        next: () => this.router.navigate(['/']),
        error: err => {
          this.errorMensaje = err.error?.message || 'Error al editar la empresa';
          this.cargando = false;
        }
      });
    }
  }

  volver(): void {
    this.location.back();
  }
}
