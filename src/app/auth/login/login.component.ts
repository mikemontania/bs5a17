import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';


@Component({
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent   {
  showPassword: boolean = false;
  recuerdame: boolean = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loginForm: FormGroup = this.fb.group({
    username: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
    recuerdame: [false]
  });
  ngOnInit() {
    const username = localStorage.getItem('username');
    if (username) {
      this.loginForm.patchValue({ username: username });
            this.recuerdame = true;
    }
  }


  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


  login() {
    console.log('asd')
    if (this.loginForm.invalid) {
      return;
    }
    Swal.fire({
      title: 'Espere por favor...',
      allowOutsideClick: false,
      icon: 'info',
    });
    Swal.showLoading();
    const { username, password } = this.loginForm.value;
    console.log("login");
    this.authService.login(username, password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      Swal.close();
    },
      error: message => {
        Swal.fire("Error", message, "error");
      }
    });
  }
}
