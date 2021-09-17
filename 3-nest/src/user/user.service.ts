import { Injectable } from '@nestjs/common';
import { randomInt, randomUUID } from 'crypto';
import { max } from 'rxjs';
import { User } from './info.struct';

@Injectable()
export class UserService {

    seqNum = 0;
    users: Map<number, User> = new Map<number, User>();

    getRandomInt(min, max) {

        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random()* (max - min) + min) ;
      }

    constructor(){
       // this.populate();
    }





    addUser(user: any){
        var newUser: User;
        console.log("Hello!");
        console.log("Before Creation, current User Key: " + this.users.size);
        newUser = new User(this.getRandomInt(1000, 2000), user?.name, user?.age, user?.email, user?.password);
        this.users.set(this.users.size+1, newUser); //safe integer
        this.printAllUsers();
        console.log("Key Count: " + this.users.size);
    }

    printAllUsers(){

        var stringBuilder = [];
        for (const user of this.users.values()){
          stringBuilder.push(user.toJson());
            
        }
        console.log(stringBuilder);
        return stringBuilder;
    }

   userQuery(query: number){
       for(const iter1 of this.users.values()){
           //console.log(iter1.toJson().id);
           if(iter1.toJson().id === query){
              
            
               return "ID Number: " + iter1.toJson().id + "<br>Full Name: " + iter1.toJson().name + "<br>Age: " + iter1.toJson().age + "<br>Email: " + iter1.toJson().email;
          
            }
       }
      
        return "USER WITH ID [" + query + "] NOT FOUND!"
    
       
    }
       

    getKey(id:number){

        var ctr = 1;
        for(const iter1 of this.users.keys()){
            if(this.users.get(iter1).toJson().id == id){
                console.log("Key is: " + iter1);
                return iter1;
            }
            

            
            //ctr++;
            
        }
        console.log("Key not found?");
        return null; 
    }

    editUserData(user: any, id: number){

        var patchUser:User;
        var oldUser: User = this.users.get(this.getKey(id));


        patchUser = new User(id, user?.name, user?.age, user?.email, user?.password);
        //this.users.set(this.getKey(id), patchUser);
        console.log(this.users.get(this.getKey(id)).toJson());
        
        console.log("Original User: \nName: " + oldUser.toJson().name + "\nAge: " + oldUser.toJson().age + "\nEmail: " + oldUser.toJson().email + "\n\nNew User: \nName: " + patchUser.toJson().name + "\nAge: " + patchUser.toJson().age + "\nEmail: " + patchUser.toJson().email);
        if (patchUser.toJson().name == undefined || patchUser.toJson().age == undefined || patchUser.toJson().email == undefined || patchUser.toJson().id == undefined){
            console.log("Incomplete data entry.");
            return false;
        }
        
        if(patchUser.toJson().name == undefined){
            return "Error - Name field is BLANK.";
        }

        if(patchUser.toJson().age == undefined){
            return "Error - Age field is BLANK";
        }

        if(patchUser.toJson().email == undefined){
            return "Error - Email field is BLANK";
        }

    
        this.users.set(this.getKey(id), patchUser);
        return true;
    }


    chkAccExists(id:number){
        if(this.users.get(this.getKey(id)) === null || this.users.get(this.getKey(id)) === undefined){
            return false;
        }
        else{
           console.log("Account exists. Key: " + this.getKey(id))
            return true;
        }

    }


    deleteAccount(id:number){
            
        if(this.chkAccExists(id) == true){
        this.users.delete(this.getKey(id));
        return true;
        }

        else{
        return "NO ACCOUNT FOUND";
        }

    }
      
   

   populate(){
       this.users.set(1, new User(1000, "Daryll Gomez", 21, "daryll@gomez.com", "lmao"));
       this.users.set(2, new User(1001, "Denzel Gomez", 17, "denzel@gomez.com", 'ohLook'));

   }

   authFunction(userCred:any){
       for(const authIter of this.users.values()){
           if(authIter.login(userCred?.email, userCred?.password)){
               return{
               success: true,
               message: "AUTH_SUCCESS"
           }
           }
           else{
               return {
                success: false,
                message: "AUTH_FAILURE"
               }
           
       }
   }

  
    
}

    patchFunc(id:number, userBody:any){

        var stringBuilder;
        stringBuilder = '';
        var newPatch: User;
        var oldUser: User = this.users.get(this.getKey(id));
        console.log(oldUser.toJson());
        if(userBody?.name != undefined){
            
            newPatch = new User(id, userBody?.name, oldUser.toJson().age, oldUser.toJson().email, oldUser.passwordPusher());
            this.users.set(this.getKey(id), newPatch);
            oldUser = newPatch;
            stringBuilder += "\n<br>Name: " + userBody?.name;
        }

        if(userBody?.age != undefined){

            newPatch = new User(id, oldUser.toJson().name, userBody?.age, oldUser.toJson().email, oldUser.passwordPusher());
            this.users.set(this.getKey(id), newPatch);
            oldUser = newPatch;
            stringBuilder += "\n<br>Age: " + userBody.age;
        }

        if(userBody?.email != undefined){

            newPatch = new User(id, oldUser.toJson().name, oldUser.toJson().age, userBody?.email, oldUser.passwordPusher());
            this.users.set(this.getKey(id), newPatch);
            oldUser = newPatch;
            stringBuilder += "\n<br>Email: " + userBody?.email;

        }

        if(userBody?.id != undefined){

            newPatch = new User(userBody?.id, oldUser.toJson().name, oldUser.toJson().age, oldUser.toJson().email, oldUser.passwordPusher());
            this.users.set(this.getKey(id), newPatch);
            oldUser = newPatch;
            stringBuilder += "\n<br>ID: " + userBody?.id;

        }

        

        if(stringBuilder == null || stringBuilder == ""){
            return "No changes were made."
        }
        else{
            return "The following fields were updated for account [" + id + "]: <br>" + stringBuilder;
        }

    }

    broadSearch(searchString:string){
        
        for(const iter1 of this.users.values()){
            //console.log(iter1.toJson().id);

            
            
            if(iter1.toJson().name === searchString){
               
             
                return "Name match. <br><br>Name: " + iter1.toJson().name + "<br>Account ID: " + iter1.toJson().id+ "<br>Age: " + iter1.toJson().age + "<br>Email: " + iter1.toJson().email;
           
             }

            if(iter1.toJson().age === parseInt(searchString)){

                return "Age match. <br><br>Name: " + iter1.toJson().name + "<br>Account ID: " + iter1.toJson().id + "<br>Age: " + iter1.toJson().age + "<br>Email: " + iter1.toJson().email;
            }

            if(iter1.toJson().email === searchString){
                return "Email match. <br><br>Name: " + iter1.toJson().name + "<br>Account ID: " + iter1.toJson().id + "<br>Age: " + iter1.toJson().age + "<br>Email: " + iter1.toJson().email;

            }

            if(iter1.toJson().id === parseInt(searchString)){
                return "ID Number match. <br><br>Name: " + iter1.toJson().name + "<br>Account ID: " + iter1.toJson().id + "<br>Age: " + iter1.toJson().age + "<br>Email: " + iter1.toJson().email;
            }
        }
        return "None of the attributes match your search parameter!"
    }

    }

