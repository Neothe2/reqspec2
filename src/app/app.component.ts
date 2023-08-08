import { Component } from '@angular/core';
import { HttpService } from './services/http/http.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private http: HttpService,
    private router: Router,
    private nav: NavController
  ) {}

  onLogout() {
    this.http.logout();
    this.nav.navigateRoot('/login');
  }
}
