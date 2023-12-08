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
export class LoginComponent {

  private fb          = inject( FormBuilder );
  private authService = inject( AuthService );
  private router      = inject( Router )


  public myForm: FormGroup = this.fb.group({
    email:    ['miguel.montania@cavallaro.com.py', [ Validators.required, Validators.email ]],
    password: ['Cavainfo.MM', [ Validators.required, Validators.minLength(6) ]],
  });


  login() {
    const { email, password } = this.myForm.value;
console.log('login')
    this.authService.login(email, password)
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: (message) => {
          Swal.fire('Error', message, 'error' )
        }
      })

  }

}
