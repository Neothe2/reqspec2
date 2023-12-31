import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../services/http/http.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  username: string = '';
  password: string = '';
  registerForm = this.formBuilder.group({
    email: [this.email, [Validators.required, Validators.email]],
    username: [this.username, Validators.required],
    password: [this.password, Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  register() {
    if (!this.registerForm.valid) {
      return;
    }

    this.http
      .post('https://info.dhwana.com:100/auth/users/', {
        email: this.email,
        username: this.username,
        password: this.password,
      })
      .subscribe(() => {
        this.router.navigateByUrl('/login');
      });

    // Your registration logic here.
    // For example:
    // this.authService.register(this.registerForm.value)
    //   .subscribe(
    //     response => {
    //       this.router.navigateByUrl('/login');
    //     },
    //     error => {
    //       console.error('There was an error during the registration process', error);
    //     }
    //   );
  }
}
