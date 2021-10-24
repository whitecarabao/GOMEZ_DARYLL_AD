import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router,private api: HttpClient) { }

  ngOnInit(): void {
  }
regForm: FormGroup = new FormGroup({
  fcName: new FormControl('', Validators.required),
  fcEmail: new FormControl('', Validators.required),
  fcPwd : new FormControl('', Validators.required),
  fcVPwd: new FormControl('',Validators.required),
  fcAge : new FormControl(0, Validators.min(1)),
});
requestResult = "";
err : string ='';
  register(){
   
    }

  async onSubmit(){
    if(this.regForm.value['fcPwd']!==this.regForm.value['fcVPwd']){
      this.err = 'Passwords do not match. Please check and try again';
    }
    if(!this.regForm.valid){
      {this.err = 'All fields must be filled.';
    return;}
    }
    if(this.regForm.valid){
      var payload: {
        name: string;
        email: string;
        age: number;
        password: string;
      };
      payload = {
        name: this.regForm.value.fcName,
        email: this.regForm.value.fcEmail,
        age: parseInt(this.regForm.value.fcAge),
        password: this.regForm.value.fcPwd,
      };
      console.log(payload);
    
      var result:any = await this.api.post(environment.API_URL+"/user/register/",payload).toPromise();
      this.requestResult = result;
      if(result.success == true){
        alert("You have been successfully registered, "+ result.data.name);
        this.nav('home');
      }
      else{
        alert("This email already exists!");
      }
    }
  }
  
  nav(destination: string) {
    this.router.navigate([destination]);
  }
  }


