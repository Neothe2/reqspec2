import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../services/http/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  username: string = '';
  password: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private router: Router
  ) {
    // this.http.refresh().then(() => {
    //   this.router.navigateByUrl('/clients');
    // });
    this.loginForm = this.formBuilder.group({
      username: [this.username, [Validators.required]],
      password: [this.password, [Validators.required]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.http.login(this.username, this.password).then(() => {
        this.router.navigateByUrl('/clients');
      });
    }
  }
}
