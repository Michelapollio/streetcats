import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MapComponent } from '../map/map';
import * as L from 'leaflet';
import { ElementRef } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { CatsService } from '../../services/cats';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-addcat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MapComponent, MarkdownModule],
  templateUrl: './addcat.html',
  styleUrl: './addcat.scss',
})
export class Addcat implements OnInit, AfterViewInit {
  @ViewChild(MapComponent) mapComp!: MapComponent;
  @ViewChild('editor') editorElement!: ElementRef<HTMLTextAreaElement>;

  catForm!: FormGroup;
  imagePreview: string | null = null;
  currentMarker: L.Marker | null = null;

  constructor(
    private catService: CatsService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.catForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      photo: new FormControl(null, Validators.required),
      latitude: new FormControl(null, Validators.required),
      longitude: new FormControl(null, Validators.required),
    });
  }

  ngAfterViewInit() {
    // Forza il ricalcolo della mappa se necessario (bug Flexbox)
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }

  // Gestione Immagine
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.catForm.patchValue({ photo: file });
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  // Clic sulla Mappa
  onMapClick(event: L.LeafletEvent) {
    const e = event as L.LeafletMouseEvent;
    const { lat, lng } = e.latlng;

    // Aggiorna Form
    this.catForm.patchValue({ latitude: lat, longitude: lng });

    // Gestione Marker (Personalizzato con icona gatto)
    if (this.currentMarker) {
      this.currentMarker.remove();
    }

    // Usiamo un DivIcon per l'icona personalizzata (faccia gatto)
    this.currentMarker = this.mapComp.addMarker(lat, lng, '🐱');
  }

  // Markdown tool
  addBold() {
    const desc = this.catForm.get('description')?.value;
    this.catForm.patchValue({ description: desc + '** friendly calico cat**' });
  }

  insertMarkup(type: string): void {
    const textarea = this.editorElement.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    let markup = '';
    let selection = currentText.substring(start, end);

    switch (type) {
      case 'bold':
        markup = `**${selection || 'bold text'}**`;
        break;
      case 'italic':
        markup = `*${selection || 'italic text'}*`;
        break;
      case 'link':
        markup = `[${selection || 'link text'}](https://example.com)`;
        break;
      case 'code':
        markup = `\`${selection || 'code'}\``;
        break;
    }

    const newText = currentText.substring(0, start) + markup + currentText.substring(end);

    this.catForm.patchValue({ description: newText });

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + markup.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  // INVIO
  saveCat() {
    if (this.catForm.valid) {
      const formData = new FormData();

      const currentUser = this.authService.getUser();
      const userId = currentUser?.id;

      if (!userId) {
        alert('Devi essere loggato per aggiungere un avvistamento!');
        this.router.navigate(['/login']);
        return;
      }

      formData.append('title', this.catForm.get('title')?.value);
      formData.append('descriptionMd', this.catForm.get('description')?.value);
      formData.append('latitude', this.catForm.get('latitude')?.value);
      formData.append('longitude', this.catForm.get('longitude')?.value);
      formData.append('userId', userId);

      const photoFile = this.catForm.get('photo')?.value;
      if (photoFile) {
        formData.append('photo', photoFile, photoFile.name);
      }

      console.log('Invio dati al server...');

      this.catService.saveCat(formData).subscribe({
        next: (response) => {
          console.log('Salvataggio riuscito !', response);
          alert('Gatto aggiunto con successo! 🐾');
          this.router.navigate(['/dashboard']); //DA CAMBIAREEE
        },
        error: (err) => {
          console.error('Errore durante il salvataggio:', err);
          alert('Ops! Qualcosa è andato storto durante il salvataggio.');
        },
      });
    } else {
      alert('Per favore, compila tutti i campi e seleziona la posizione sulla mappa.');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
