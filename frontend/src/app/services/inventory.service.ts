import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryAdjustment } from '../models/inventory-log.model';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiBaseUrl}/inventory`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHttpOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  addStock(adjustment: InventoryAdjustment): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/add`, adjustment, {
      ...this.getHttpOptions(),
      responseType: 'text' as 'json'
    });
  }

  removeStock(adjustment: InventoryAdjustment): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/remove`, adjustment, {
      ...this.getHttpOptions(),
      responseType: 'text' as 'json'
    });
  }

  adjustStock(productId: number, quantity: number, notes?: string): Observable<string> {
    let params = new HttpParams().set('quantity', quantity.toString());
    if (notes) {
      params = params.set('notes', notes);
    }

    return this.http.post<string>(`${this.apiUrl}/adjust/${productId}`, null, {
      ...this.getHttpOptions(),
      params,
      responseType: 'text' as 'json'
    });
  }

  getProductInventoryLogs(productId: number, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/logs/${productId}`, {
      ...this.getHttpOptions(),
      params
    });
  }

  getRecentActivities(page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/activities`, {
      ...this.getHttpOptions(),
      params
    });
  }
}
