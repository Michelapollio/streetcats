import { Component, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  template: `<div [id]="mapId" class="map-container"></div>`,
  styles: [
    `
      .map-container {
        height: 100%; /* Prende l'altezza del genitore */
        width: 100%;
        min-height: 400px; /* <--- AGGIUNGI QUESTO PER SICUREZZA */
        display: block;
      }
    `,
  ],
})
export class MapComponent implements AfterViewInit {
  @Input() mapId: string = 'map-' + Math.random().toString(36).substring(2, 9);
  @Input() center: L.LatLngExpression = [40.828, 14.19];
  @Input() zoom: number = 13;
  @Input() interactive: boolean = true;

  @Output() mapClick = new EventEmitter<L.LeafletEvent>();

  private map!: L.Map;

  constructor() {}

  ngAfterViewInit() {
    this.initMap();

    // Aspetta un piccolo istante e forza il ricalcolo delle dimensioni
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 100);
  }

  private initMap(): void {
    this.map = L.map(this.mapId, {
      center: this.center,
      zoom: this.zoom,
      zoomControl: this.interactive,
      dragging: this.interactive,
      scrollWheelZoom: this.interactive,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);

    if (this.interactive) {
      this.map.on('click', (e: L.LeafletMouseEvent) => this.mapClick.emit(e));
    }
  }

  public addMarker(lat: number, lng: number, iconHtml?: string) {
    const icon = L.divIcon({
      html: iconHtml || '🐱',
      className: 'cat-marker-icon',
      iconSize: [40, 40],
      iconAnchor: [15, 30],
    });
    return L.marker([lat, lng], { icon }).addTo(this.map);
  }
}
