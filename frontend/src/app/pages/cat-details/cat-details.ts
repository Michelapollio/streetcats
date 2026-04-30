import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CatsService } from '../../services/cats';
import { AuthService } from '../../services/auth'; // Importa AuthService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Aggiungi FormsModule per ngModel
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import * as L from 'leaflet';

@Component({
  selector: 'app-cat-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cat-details.html',
  styleUrl: './cat-details.scss',
})
export class CatDetails implements OnInit, AfterViewChecked {
  cat: any = null;
  formattedDescription: any = '';

  //COMMENTI USER
  comments: any[] = [];
  newCommentText: string = '';
  isUserLoggedIn: boolean = false;

  //MAPPA
  private map!: L.Map;
  private mapInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private catsService: CatsService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isUserLoggedIn = this.authService.isLoggedIn();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadCatDetails(id);
    }
  }

  loadCatDetails(id: string): void {
    this.catsService.getCatsById(id).subscribe({
      next: (data) => {
        console.log('Dati ricevuti dal backend:', data);
        this.cat = data;
        this.comments = data.comments || [];

        const rawDescription = data.descriptionMd || data.description || '';
        const htmlContent = marked.parse(rawDescription) as string;
        this.formattedDescription = this.sanitizer.bypassSecurityTrustHtml(htmlContent);

        // Forza Angular a renderizzare l'HTML prima di cercare il div della mappa
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Errore nel recupero gatto:', err),
    });
  }

  addComment(): void {
    if (!this.newCommentText.trim()) return;

    const currentUserId = this.authService.getCurrentUserId();
    const commentData = {
      catId: this.cat.id, // Assicurati che cat.id sia valorizzato
      text: this.newCommentText,
      userId: this.authService.getCurrentUserId(),
      username: this.authService.getUser()?.username, // Opzionale: utile per la UI
    };

    this.catsService.addComment(commentData).subscribe({
      next: (comment) => {
        // Aggiungi il commento alla lista locale per vederlo subito
        this.comments.push(comment);
        this.newCommentText = '';
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Errore nell'aggiunta del commento:", err),
    });
  }

  ngAfterViewChecked(): void {
    const mapContainer = document.getElementById('miniMap');

    // Inizializziamo solo se c'è il container, ci sono i dati e non è già stata creata
    if (mapContainer && this.cat && !this.mapInitialized) {
      this.initMiniMap();
    }
  }

  private initMiniMap(): void {
    // Evitiamo che venga chiamata più volte
    this.mapInitialized = true;

    // Se per caso c'era una vecchia istanza, la puliamo
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('miniMap', {
      center: [this.cat.latitude, this.cat.longitude],
      zoom: 15,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    const customIcon = L.divIcon({
      html: `<div class="marker-container">
               <div class="pulse-circle"></div>
               <div class="cat-icon-mini">🐱</div>
             </div>`,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    L.marker([this.cat.latitude, this.cat.longitude], { icon: customIcon }).addTo(this.map);

    // Refresh dimensioni per evitare zone grigie
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }
}
