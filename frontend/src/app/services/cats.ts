import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatsService {
  private apiUrl = 'http://localhost:3000/api/cats';

  constructor(private http: HttpClient){}

  saveCat(formData: FormData): Observable<any>{
    return this.http.post(this.apiUrl, formData);
  }
}
