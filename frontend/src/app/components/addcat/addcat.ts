import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { MarkdownModule } from 'ngx-markdown';


@Component({
  selector: 'app-addcat',
  imports: [CommonModule,
    ReactiveFormsModule,
    MarkdownModule
  ],
  templateUrl: './addcat.html',
  styleUrl: './addcat.scss',
})
export class Addcat implements AfterViewInit{
  catForm!: FormGroup;
  imagePreview: string | null = null;
  map!: L.Map;
  selectedMarker: L.Marker | null = null;
  selectedCoords: L.LatLng | null = null;

  constructor(private fb: FormBuilder) {
    this.catForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      photo: [null, Validators.required]
    });
  }

 ngAfterViewInit() {
   setTimeout(()=>{
    this.initSelectionMap();
   }, 100);
 }

  initSelectionMap() {
    this.map = L.map('map-select').setView([40.828, 14.190], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(this.map);

    // Click sulla mappa per posizionare il gatto
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.selectedCoords = e.latlng;
      
      if (this.selectedMarker) {
        this.selectedMarker.setLatLng(e.latlng);
      } else {
        this.selectedMarker = L.marker(e.latlng, { draggable: true }).addTo(this.map);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
      this.catForm.patchValue({ photo: file });
    }
  }

  saveCat() {
    const finalData = {
      ...this.catForm.value,
      location: this.selectedCoords
    };
    console.log("Salvataggio gatto in corso...", finalData);
    // Qui andrà la chiamata al tuo servizio Backend
  }
}
