import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { MarkdownModule } from 'ngx-markdown';
import { Router } from '@angular/router';

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
  isLocationConfirmed: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
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

  async saveCat() {
    if (this.catForm.invalid || !this.selectedCoords){
      alert("Compila tutti i campi e seleziona la posizione!");
      return;
    }

    const newCat = {
      title: this.catForm.value.title,
      description: this.catForm.value.description,
      latitude: this.selectedCoords.lat,
      longitude: this.selectedCoords.lng,
      photo: this.imagePreview,
      date: new Date().toISOString()
    };

    try {
      //chiamata al database
      //await this.catService.createCat(newCat).toPromise();

      console.log("Gatto salvato con successo !", newCat);
      alert("Gatto aggiunto alla colonia");

      //ritorno alla home
      this.router.navigate(['/']);
    } catch (error){
      console.error("Errore durante il salvataggio", error);
    }
    /*const finalData = {
      ...this.catForm.value,
      location: this.selectedCoords
    };
    console.log("Salvataggio gatto in corso...", finalData);
    // Qui andrà la chiamata al tuo servizio Backend*/
  }

  insertMarkup(type: string){
    const textarea = document.querySelector('textarea');
    if(!textarea) return;

    const start = textarea.selectionStart;
    const end= textarea.selectionEnd;
    const text = this.catForm.value.description || '';
    const selectedText = text.substring(start, end);

    let newText = '';
    switch (type) {
      case 'bold': newText = `**${selectedText || 'testo'}**`; break;
      case 'italic': newText = `*${selectedText || 'testo'}*`; break;
      case 'link': newText = `[${selectedText || 'link'}](https://...)`; break;
    }

    const updatedValue = text.substring(0, start) + newText + text.substring(end);
    this.catForm.patchValue({description: updatedValue});
  }

  confirmLocation(){
    if(this.selectedCoords){
      console.log("Posizione confermata: ", this.selectedCoords);
      this.isLocationConfirmed=true;
    } else {
      alert("Per favore, seleziona un punto sulla mappa prima di confermare");
    }
  }

   goBack(){
      this.router.navigate(['/']);
    }
}
