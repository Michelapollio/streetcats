import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth'
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, 
    Navbar
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, AfterViewInit {

  private map!: L.Map;

  isLoggedIn: boolean = false;

  selectedCat: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private zone: NgZone
  ){}

  ngOnInit(): void {
    this.initMap();
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [40.828770375418586, 14.19051839800037],
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);

    const oliverData = {
      name: 'Oliver',
      photo: 'assets/cat-sample.jpg',
      description: 'Friendly tuxedo, seen here often',
      timeAgo: '2 hours ago',
    };

    this.addCatMarker(40.828770375418586, 14.19051839800037, oliverData);
  }

  private addCatMarker(lat: number, lng: number, data: any) {
    const customIcon = L.divIcon({
      html: `<div style="font-size: 24px;">🐱</div>`,
      className: 'cat-marker-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    const marker = L.marker([lat, lng], { icon: customIcon });

    // Creiamo l'HTML del popup (quello della tua foto)
    const popupContent = `
    <div class="custom-popup">
      <img src="${data.photo}" class="popup-img">
      <div class="popup-info">
        <h3>${data.name}</h3>
        <p>${data.description}</p>
        <div class="popup-footer">
          <span>${data.timeAgo}</span>
          <button class="view-btn">View Details</button>
        </div>
      </div>
    </div>
  `;

    /*const popupContainer = `
    <div style="padding: 20px; min-width: 200px; background: white;">
      <h2 style="margin: 0; color: #333;">Caricamento...</h2>
    </div>
  `;*/

    marker.addTo(this.map).bindPopup(popupContent, {
      className: 'leaflet-custom-popup', // Classe per lo stile CSS
      minWidth: 350,
      //closeButton: false,
      //className: 'minimal-popup'
    });
  }

  navigateToAddCat(){
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/addcat']);
    } else {
      alert ('Effetua il login per continuare');
      this.router.navigate(['/login']);
    }
  }

  //view detail

  //close popUp
}
