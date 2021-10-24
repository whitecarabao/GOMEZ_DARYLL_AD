import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private api: HttpClient) {}

  ngOnInit(): void {}

  fcEmail = new FormControl();
  fcPwd = new FormControl();
  requestResult = '';
  async login() {
console.log("Hello!");

  var result:any = await this.api.post(environment.API_URL+"/user/login",{email: this.fcEmail.value, password: this.fcPwd.value}).toPromise();
  this.requestResult = result.data;
  console.log(this.requestResult);
  if(result.success == true) {
    console.log("Hello! Login complete!");
    alert("Access granted. Welcome "+result.data.name +"!");
    this.nav('home');
  }
  else{
    alert("Credentials incorrect! Try again!")
    console.log(this.requestResult);
  }
   // if (
     // this.fcEmail.value == 'daryll.gomez@gomezdyn.com.ph' &&
  //    this.fcPwd.value == 'lmaoVeryLegitPwd'
   // ) {
    //  alert('Huh, you finally did something right. Himala!');
   //   this.nav('home');
   // } else {
    //  alert('Wrong, just like your day to day choices');
     // console.log('Credentials mismatch');
    //}
  }

  nav(destination: string) {
    this.router.navigate([destination]);
  }
}
