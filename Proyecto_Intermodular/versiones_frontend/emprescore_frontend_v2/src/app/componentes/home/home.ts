import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmpresaServicio } from '../../servicios/empresa-servicio';
import { CategoriaServicio } from '../../servicios/categoria-servicio';
import { Empresa } from '../../modelos/empresa';
import { Categoria } from '../../modelos/categoria';
import { AuthServicio } from '../../servicios/auth-servicio';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  empresas: Empresa[] = [];
  categorias: Categoria[] = [];
  busqueda: string = '';
  categoriaSeleccionada: number | null = null;
  cargando: boolean = false;

  constructor(private empresaServicio: EmpresaServicio, private categoriaServicio: CategoriaServicio, public authServicio:  AuthServicio){}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarEmpresas();
  }

  cargarCategorias(): void {
    this.categoriaServicio.listar().subscribe({
      next: datos => this.categorias = datos,
      error: err => console.error('Error al cargar categorias', err)
    });
  }

  cargarEmpresas(): void {
    this.cargando = true;
    this.empresaServicio.buscar(
      this.busqueda || undefined, this.categoriaSeleccionada || undefined
    ).subscribe({
      next: datos => {
        this.empresas = datos;
        this.cargando = false;
        this.scrollEmpresas();
      },
      error: err => {
        console.error('Error al cargar empresas', err);
        this.cargando = false;
      }
    });
  }

  seleccionarCategoria(id: number): void {
    this.categoriaSeleccionada = this.categoriaSeleccionada === id ? null : id;
    this.cargarEmpresas();
    this.scrollEmpresas();
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.categoriaSeleccionada = null;
    this.cargarEmpresas();
  }

  iconoCategoria(nombre: string): string {
    const iconos: {[key: string]: string} = {
      'Restaurantes y Comida': 'bi-cup-hot',
      'Tecnología': 'bi-laptop',
      'Salud y Bienestar': 'bi-heart-pulse',
      'Moda y Ropa': 'bi-bag',
      'Hogar y Construcción': 'bi-house',
      'Educación': 'bi-book',
      'Viajes y Turismo': 'bi-airplane',
      'Servicios Financieros': 'bi-bank',
      'Transporte y Logística': 'bi-truck',
      'Comercio Online': 'bi-cart'
    };
    return iconos[nombre] || 'bi-grid';
  }

  estrellas(media: number): string[]{
    return Array.from({length:5}, (_,i) => {
      if (i < Math.floor(media)) return 'bi-star-fill';
      if (i < media) return 'bi-star-half';
      return 'bi-star';
    });
  }

  scrollCategorias(): void {
    document.querySelector('.categorias')?.scrollIntoView({behavior: 'smooth'});
  }

  scrollEmpresas(): void {
    document.querySelector('.empresas')?.scrollIntoView({ behavior: 'smooth' });
  }
}
