import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isShow = true;
  isShowManualForm = true;
  hideActions = true;
  err: string = '';

  shownAlready = 0;
  tempName = 'ERROR - NAME RETRIEVAL ERROR';
  tempID = 'ERROR - ID RETRIEVAL ERROR';
  tempEmail = 'ERROR - EMAIL RETRIEVAL ERROR';
  tempAge = 0;

  constructor(private router: Router, private api: HttpClient) {
    this.getUserList();
  }

  ngOnInit(): void {}

  amendForm: FormGroup = new FormGroup({
    fcName: new FormControl(''),
    fcID: new FormControl(''),
    fcEmail: new FormControl(''),
    fcPwd: new FormControl(''),
    fcAge: new FormControl('', Validators.min(1)),
  });

  newRegManForm: FormGroup = new FormGroup({
    newFcName: new FormControl(''),
    newFcID: new FormControl(''),
    newFcEmail: new FormControl(''),
    newFcPwd: new FormControl(''),
    newFcVPwd: new FormControl(''),
    newFcAge: new FormControl('', Validators.min(1)),
  });
  arrOfUsr: Array<any> = [];

  arrView: Array<any> = [];
  reqRes = '';
  searchTerm: string = '';

  //arrOfUsr:any = this.api.get(environment.API_URL+"/user/all").toPromise();
  async getUserList(opt?: string) {
    var caller: any = await this.api
      .get(environment.API_URL + '/user/all')
      .toPromise();

    this.arrOfUsr = caller.data;

    if(opt == undefined){
    alert('Table populated with ' + caller.data.length + ' entries!');
    }

  }

  async deleteRow(id: string) {
    if (confirm('Are you sure to delete account ' + id)) {
      var delUsr: any = await this.api
        .delete(environment.API_URL + '/user/' + id)
        .toPromise();
      if (delUsr.success) {
        alert(delUsr.data.name + ' deleted!');
        location.reload();
      } else {
        console.log(delUsr.data);
        alert('Error deleting account');
      }
    }
  }

  dispPlaceholders(id: string, name: string, age: number, email: string) {
    this.isShow = false;
    this.tempName = name;
    this.tempEmail = email;
    this.tempAge = age;
    this.tempID = id;
  }

  async patchRow(
    id: string,
    passName?: string,
    age?: number,
    email?: string,
    password?: string
  ) {
    if (!this.amendForm.valid) {
      {
        this.err = 'All fields must be filled.';
        return;
      }
    }
    if (this.amendForm.valid) {
      var payload: any = {};

      if (this.amendForm.value.fcName != '') {
        payload['name'] = this.amendForm.value.fcName;
      }
      if (this.amendForm.value.fcEmail != '') {
        payload['email'] = this.amendForm.value.fcEmail;
      }
      if (this.amendForm.value.fcAge != '') {
        var payloadAge = parseInt(this.amendForm.value.fcAge);
        payload['age'] = payloadAge;
      }
      if (this.amendForm.value.fcPwd != '') {
        payload['password'] = this.amendForm.value.fcPwd;
      }

      console.log(payload);
      if (confirm('Confirming modification of user [' + passName + ']?')) {
        console.log(payload);
        var result: any = await this.api
          .patch(environment.API_URL + '/user/' + id, payload)
          .toPromise();
        this.reqRes = result;
        console.log(result);
        if (result.success == true) {
          alert('You have successfully modified the user, ' + result.data.name);
          this.leaveNoChange();
          this.getUserList();
          
        } else {
          alert('This email already exists!');
        }
      }
    } else {
      alert('No modications performed on user.');
    }
  }

  refresh() {
    location.reload();
  }

  leaveNoChange() {
    this.isShow = true;
  }

  nav(dest: string) {
    this.router.navigate([dest]);
  }

  async searchArrHandler(term?: string) {
    term = (document.getElementById('searchBox') as HTMLInputElement).value;
    console.log('Searching for ' + term);
if(term ==""){
  this.hideActions = true;
  this.getUserList("QUIET");

}
else{
    var caller: any = await this.api
      .get(environment.API_URL + '/user/search/' + term)
      .toPromise();

    this.arrOfUsr = caller.data;
    console.log(caller.data);

    if(caller.success == false){
      this.arrOfUsr = [{name: "NO USERS FOUND"}];
      this.hideActionsBar();
    }
    else{
      this.hideActions == true;
    }
    alert(
      'Updating table with users containing the search term [' + term + ']'
    );
    }
  }

 

  hideActionsBar() {
    this.hideActions = false;

  }

  toggleNewManForm(){
    this.isShowManualForm = !this.isShowManualForm;
  }


  async makeManAcc(){

    if(this.newRegManForm.value['newFcPwd']!==this.newRegManForm.value['newFcVPwd']){
      this.err = 'Passwords do not match. Please check and try again';
    }
    if(!this.newRegManForm.valid){
      {this.err = 'All fields must be filled.';
    return;}
    }
    if(this.newRegManForm.valid){
      var payload: {
        name: string;
        email: string;
        age: number;
        password: string;
      };
      payload = {
        name: this.newRegManForm.value.newFcName,
        email: this.newRegManForm.value.newFcEmail,
        age: parseInt(this.newRegManForm.value.newFcAge),
        password: this.newRegManForm.value.newFcPwd,
      };
      console.log(payload);
    
      var result:any = await this.api.post(environment.API_URL+"/user/register/",payload).toPromise();
      this.reqRes = result;
      if(result.success == true){
        alert("You have been successfully registered, "+ result.data.name);
        this.getUserList();
        this.toggleNewManForm();
        this.newRegManForm.reset();
      }
      else{
        alert("This email already exists!");
      }
    }

  }
}
