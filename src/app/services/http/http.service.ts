import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseUrl = 'http://108.166.190.142:100';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(username: string, password: string) {
    const body = { username, password };
    return this.http
      .post(`${this.baseUrl}/auth/jwt/create`, body)
      .toPromise()
      .then((response: any) => {
        if (response && response.access && response.refresh) {
          this.cookieService.set('access', response.access);
          this.cookieService.set('refresh', response.refresh);
        } else {
          throw new Error('Access or refresh token is missing in the response');
        }
      });
  }

  refresh() {
    const refresh = this.cookieService.get('refresh');
    if (!refresh) {
      throw new Error('Refresh token is missing');
    }
    return this.http
      .post(`${this.baseUrl}/auth/jwt/refresh`, { refresh })
      .toPromise()
      .then((response: any) => {
        if (response && response.access) {
          this.cookieService.set('access', response.access);
        } else {
          throw new Error('Access token is missing in the response');
        }
      });
  }

  logout() {
    // Example: Remove the access token from cookies
    this.cookieService.delete('access');
    // this.cookieService.delete('refresh');

    // Example: Make an HTTP request to the logout endpoint
    // return this.http.post(`${this.baseUrl}/auth/logout`, {}).toPromise();

    console.log('User logged out');
  }

  get(url: string) {
    const access = this.cookieService.get('access');
    const headers = new HttpHeaders().set('Authorization', `JWT ${access}`);
    return this.http.get(`${this.baseUrl}/${url}`, { headers }).toPromise();
  }

  post(url: string, body: any) {
    const access = this.cookieService.get('access');
    const headers = new HttpHeaders().set('Authorization', `JWT ${access}`);
    return this.http
      .post(`${this.baseUrl}/${url}`, body, { headers })
      .toPromise();
  }

  put(url: string, body: any) {
    const access = this.cookieService.get('access');
    const headers = new HttpHeaders().set('Authorization', `JWT ${access}`);
    return this.http
      .put(`${this.baseUrl}/${url}`, body, { headers })
      .toPromise();
  }

  patch(url: string, body: any) {
    const access = this.cookieService.get('access');
    const headers = new HttpHeaders().set('Authorization', `JWT ${access}`);
    return this.http
      .patch(`${this.baseUrl}/${url}`, body, { headers })
      .toPromise();
  }

  delete(url: string) {
    const access = this.cookieService.get('access');
    const headers = new HttpHeaders().set('Authorization', `JWT ${access}`);
    return this.http.delete(`${this.baseUrl}/${url}`, { headers }).toPromise();
  }
}
