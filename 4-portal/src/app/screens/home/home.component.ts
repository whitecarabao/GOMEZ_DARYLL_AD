import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(private router: Router,private api: HttpClient) { 
    this.getUserList();
  }

  ngOnInit(): void {
  }
arrOfUsr:Array<any> = [];
reqRes ="";
  //arrOfUsr:any = this.api.get(environment.API_URL+"/user/all").toPromise();
  async getUserList(){
    
    var caller:any = await this.api.get(environment.API_URL+"/user/all").toPromise();
    
    this.arrOfUsr = caller.data;

      alert("Table populated with " + caller.data.length + " entries!");
    }
    


  

  nav(dest: string){
    this.router.navigate([dest]);
  }
}


