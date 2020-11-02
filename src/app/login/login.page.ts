import { Component, OnInit } from '@angular/core';

import {AuthService} from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm = {
    email:'',
    password:''
  };
  constructor(private authService:AuthService,
    private router:Router) { }

  ngOnInit() {
  }
 
  login(){
     this.authService.useLogin(this.loginForm)
     .subscribe(value => {
       if(value){
         this.router.navigateByUrl('/dashboard')
       }
       else{
         alert('login fails')
       }
     },error => {
       alert('login fails')
     })
  }
}
