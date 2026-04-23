import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Navbar } from '../../components/navbar/navbar';
import { CatsService } from '../../services/cats';
import {marked} from 'marked';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, AfterViewInit {
  private map!: L.Map;

  isLoggedIn: boolean = false;

  selectedCat: any = null;

  private readonly baseUrl = 'http://localhost:3000';

  constructor(
    private authService: AuthService,
    private router: Router,
    private zone: NgZone,
    private catsService: CatsService,
  ) {}

  ngOnInit(): void {
    //this.initMap();
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadCats();
  }

  private initMap(): void {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map', {
      center: [40.828770375418586, 14.19051839800037],
      zoom: 10,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);

    /*const oliverData = {
      name: 'Oliver',
      photo: 'assets/cat-sample.jpg',
      description: 'Friendly tuxedo, seen here often',
      timeAgo: '2 hours ago',
    };

    this.addCatMarker(40.828770375418586, 14.19051839800037, oliverData);*/
  }

  private loadCats(): void {
    this.catsService.getCats().subscribe({
      next: (cats) => {
        cats.forEach((cat: any) => {
          // Adattiamo i dati del DB alla funzione addCatMarker
          const catData = {
            name: cat.title,
            // Se photoUrl inizia già con /uploads, lo usiamo, altrimenti aggiungiamo baseUrl
            photo: cat.photoUrl ? `${this.baseUrl}${cat.photoUrl}` : 'assets/cat-placeholder.jpg',
            description: cat.descriptionMd,
            timeAgo: 'now', // Puoi gestire la data con una libreria come date-fns o moment
          };
          this.addCatMarker(cat.latitude, cat.longitude, catData);
        });
      },
      error: (err) => console.error('Errore nel caricamento gatti:', err),
    });
  }

  private addCatMarker(lat: number, lng: number, data: any) {
    const customIcon = L.divIcon({
      html: `<div style="font-size: 24px;">🐱</div>`,
      className: 'cat-marker-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    const formattedDescription = marked.parse(data.description || '') as string;

    const marker = L.marker([lat, lng], { icon: customIcon });

    const btnId = `btn-details-${Math.random().toString(36).substr(2, 9)}`;

    // Creiamo l'HTML del popup (quello della tua foto)
    const popupContent = `
  <div class="custom-popup" style="min-width: 110px; font-family: sans-serif;">
    <div style="width: 100%; height: 120px; overflow: hidden; border-radius: 10px;">
      <img src="${data.photo}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    <div style="padding: 12px 5px 5px 5px;">
      <h3 style="margin: 0; font-size: 18px; color: #333;">${data.name}</h3>
      <p style="color: #666; font-size: 13px; margin: 8px 0; line-height: 1.4;">
        ${formattedDescription}
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
        <span style="font-size: 11px; color: #aaa; font-style: italic;">${data.timeAgo}</span>
        <button id="${btnId}" style="background: #ff7e5f; color: white; border: none; padding: 6px 14px; border-radius: 15px; cursor: pointer; font-weight: bold; font-size: 12px; transition: 0.2s;">
          Dettagli
        </button>
      </div>
    </div>
  </div>
  `;
    marker.addTo(this.map).bindPopup(popupContent, {
      className: 'leaflet-custom-popup',
      minWidth: 250,
    });
  }

  navigateToAddCat() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/addcat']);
    } else {
      alert('Effetua il login per continuare');
      this.router.navigate(['/login']);
    }
  }
}
