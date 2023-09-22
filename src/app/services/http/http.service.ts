import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

declare global {
  interface Window {
    require: any;
    process: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseUrl = 'http://127.0.0.1:8000';
  private isElectron: boolean;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) platformId: string
  ) {
    this.isElectron = window && window.process && window.process.type;
  }

  getCookie(key: string): string | null {
    if (this.isElectron) {
      return this.cookieService.get(key);
    } else {
      let value = localStorage.getItem(key);
      return value;
    }
  }

  setCookie(key: string, value: string): void {
    if (this.isElectron) {
      this.cookieService.set(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  }

  deleteCookie(key: string): void {
    if (this.isElectron) {
      this.cookieService.delete(key);
    } else {
      localStorage.removeItem(key);
    }
  }

  login(username: string, password: string) {
    const body = { username, password };
    return this.http
      .post(`${this.baseUrl}/auth/jwt/create`, body)
      .toPromise()
      .then((response: any) => {
        if (response && response.access && response.refresh) {
          this.setCookie('access', response.access);
          this.setCookie('refresh', response.refresh);
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
          this.setCookie('access', response.access);
        } else {
          throw new Error('Access token is missing in the response');
        }
      });
  }

  logout() {
    // Example: Remove the access token from cookies
    this.deleteCookie('access');
    // this.cookieService.delete('refresh');

    // Example: Make an HTTP request to the logout endpoint
    // return this.http.post(`${this.baseUrl}/auth/logout`, {}).toPromise();

    console.log('User logged out');
  }

  get(url: string) {
    const access = this.getCookie('access');
    const headers = new HttpHeaders().set('Authorization', `JWT ${access}`);
    return this.http.get(`${this.baseUrl}/${url}`, { headers }).toPromise();
  }

  post(url: string, body: any) {
    const access = this.getCookie('access');
    const headers = new HttpHeaders().set('Authorization', `JWT ${access}`);
    return this.http
      .post(`${this.baseUrl}/${url}`, body, { headers })
      .toPromise();
  }

  put(url: string, body: any) {
    const access = this.getCookie('access');
    const headers = new HttpHeaders().set('Authorization', `JWT ${access}`);
    return this.http
      .put(`${this.baseUrl}/${url}`, body, { headers })
      .toPromise();
  }

  patch(url: string, body: any) {
    const access = this.getCookie('access');
    const headers = new HttpHeaders().set('Authorization', `JWT ${access}`);
    return this.http
      .patch(`${this.baseUrl}/${url}`, body, { headers })
      .toPromise();
  }

  delete(url: string) {
    const access = this.getCookie('access');
    const headers = new HttpHeaders().set('Authorization', `JWT ${access}`);
    return this.http.delete(`${this.baseUrl}/${url}`, { headers }).toPromise();
  }
}
