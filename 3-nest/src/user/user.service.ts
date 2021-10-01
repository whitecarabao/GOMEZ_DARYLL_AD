import { Injectable } from '@nestjs/common';
import { randomInt, randomUUID } from 'crypto';
import { max } from 'rxjs';
import { User } from './info.struct';
import { v4 as uuidv4 } from 'uuid';
import {Helper} from './Helper'
import { CRUDReturn } from './crud_return.interface';

@Injectable()
export class UserService {

    seqNum = 0;
    users: Map<string, User> = new Map<string, User>();

    getRandomInt(min, max) {

        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random()* (max - min) + min) ;
      }

    constructor(){
        this.users = Helper.populate();
       // this.populate();
    }






    addUser(user: any){
        var newUser: User;
        console.log("Hello!");
        console.log("Before Creation, current User Key: " + this.users.size);
        if(this.validateBody(user) == true){
                newUser = new User(user?.name, user?.age, user?.email, user?.password);
                this.users.set(newUser.toJson().id, newUser); 
                console.log("Key Count: HEllo!: " + this.users.size);
                return {success: true, data: newUser.toJson()};
            
        }
      
        
        else{
            return this.validateBody(user);
        }
       
    }
    printAllUsers(){

        var stringBuilder = [];
        for (const user of this.users.values()){
          stringBuilder.push(user.toJson());
            
        }
        console.log(stringBuilder);
        return {success: true, data: stringBuilder};
    }

   userQuery(query: string){
       for(const iter1 of this.users.values()){
           //console.log(iter1.toJson().id);
           if(iter1.toJson().id === query){
              

            
            
              // return "ID Number: " + iter1.toJson().id + "<br>Full Name: " + iter1.toJson().name + "<br>Age: " + iter1.toJson().age + "<br>Email: " + iter1.toJson().email + iter1.toJson();
                return iter1.crudPusher();
            }
       }
      
        return {success: false, 
                data: "USER_ID_INVALID_OR_DOES_NOT_EXIST"
            };
    
       
    }
       

    getKey(id:string){

        var ctr = 1;
        for(const iter1 of this.users.keys()){
            if(this.users.get(iter1).toJson().id == id){
                console.log("Key is: " + iter1);
                return iter1;
            }
            
            //ctr++;
            
        }

        
        console.log("Key [" + id + "] not found?");
        return null; 
    }

    editUserData(user: any, id: string){

        var patchUser:User;
        var oldUser: User = this.users.get(this.getKey(id));
        var oldID = id;
        console.log("DEBUG ID: " + oldID);

        patchUser = new User(user?.name, user?.age, user?.email, user?.password);
        //this.users.set(this.getKey(id), patchUser);
        console.log(this.users.get(this.getKey(id)).toJson());
        for(const iter1 of this.users.values()){
            if(iter1.toJson().email === user?.email){
                return {success: false, data: "EMAIL_EXISTS!"}
            }
        }
        console.log("Original User: \nName: " + oldUser.toJson().name + "\nAge: " + oldUser.toJson().age + "\nEmail: " + oldUser.toJson().email + "\n\nNew User: \nName: " + patchUser.toJson().name + "\nAge: " + patchUser.toJson().age + "\nEmail: " + patchUser.toJson().email);
        if (patchUser.toJson().name == undefined || patchUser.toJson().age == undefined || patchUser.toJson().email == undefined || patchUser.toJson().id == undefined){
            console.log("Incomplete data entry.");
            return {success: false, data: "Incomplete Data Entry"};
        }
        
        if(patchUser.toJson().name == undefined || typeof patchUser.toJson().name != "string"){
            return {success: false, data: "Error - Name field is BLANK."};
        }

        if(patchUser.toJson().age == undefined || typeof patchUser.toJson().age != "number"){
            return {success: false, data: "Error - Age field is BLANK"};
        }

        if(patchUser.toJson().email == undefined || typeof patchUser.toJson().email != "string"){
            return {success: false, data:"Error - Email field is BLANK or NOT A STRING"};
        }

        if(user?.password == undefined || typeof user?.password != "string"){
            return {success: false, data:"Error - Password is BLANK or NOT A STRING"};
        }
        this.users.set(oldID, patchUser);
        patchUser.overrideUUID(oldID);
        return {success: true, data: patchUser.toJson()};
    }


    chkAccExists(id:string){
        if(this.users.get(this.getKey(id)) === null || this.users.get(this.getKey(id)) === undefined){
            return false;
        }
        else{
           console.log("Account exists. Key: " + this.getKey(id))
            return true;
        }

    }


    deleteAccount(id:string): CRUDReturn{
            
        try{

            for(const detIter of this.users.values()){
                if(id == detIter.toJson().id){
                    this.users.delete(id);
                    console.log("Deleted ID: " + id);
                    console.log(detIter.toJson());
                    return{
                        success: true,
                        data: detIter.toJson()
                    }
                }
                

            }throw new Error("No Account found!")
    }catch(err){
        return {success: false, data: `${err.message}`};
    }
}

      
   



   authFunction(body:any){
       /*for(const authIter of this.users.values()){
           if(authIter.login(userCred?.password)){
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
       */
       console.log("User Body: " + body);
       for(const authIter of this.users.values()){
            
        if(authIter.toJson().email == body?.email){
        return authIter.login(body?.password);
         }
    }

        return {success: false, data: "LOGIN_FAILED"};
    

   }

  
    


    patchFunc(id:string, userBody:any){

        var stringBuilder;
        stringBuilder = '';
        var newPatch: User;
        var oldUser: User = this.users.get(id);
        console.log(oldUser.toJson());
        for(const iter1 of this.users.values()){
            if(iter1.toJson().email === userBody?.email){
                return {success: false, data: "EMAIL_EXISTS!"}
            }
        }
        if(userBody?.name != undefined && typeof userBody?.name == "string"){
            newPatch = new User(userBody?.name, oldUser.toJson().age, oldUser.toJson().email, oldUser.passwordPusher().password);
            this.users.set(id, newPatch);
            this.users.get(id).overrideUUID(id);
            //oldUser.toJson().name = userBody?.name;
            //oldUser.toJson().email = oldUser.toJson().email;
            //oldUser.toJson().age = oldUser.toJson().age;
            //oldUser.toJson().id = oldUser.toJson().id;
            //oldUser.passwordPusher().password = oldUser.passwordPusher().password;
            stringBuilder += "\n NAME CHANGED!";
        }

        if(userBody?.age != undefined && typeof userBody?.age == "number"){

            
            newPatch = new User(oldUser.toJson().name, userBody?.age, oldUser.toJson().email, oldUser.passwordPusher().password);
            this.users.set(id, newPatch);
            this.users.get(id).overrideUUID(id);
            //oldUser.toJson().age = userBody?.age;
            //oldUser.passwordPusher().password = oldUser.passwordPusher().password;
            //oldUser.toJson().name = oldUser.toJson().name;
            //oldUser.toJson().email = oldUser.toJson().email;
            //oldUser.toJson().id = oldUser.toJson().id;
            stringBuilder += "AGE CHANGED";
        }

        if(userBody?.email != undefined && typeof userBody?.email == 'string'){
            
            //this.users.delete(id);
            newPatch = new User(oldUser.toJson().name, oldUser.toJson().age, userBody?.email, oldUser.passwordPusher().password);//oldUser.toJson().email = userBody.email;
            this.users.set(id, newPatch);
            this.users.get(id).overrideUUID(id);
            this.users.get(id).toJson().email = userBody?.email;
            //this.editUserData(newPatch, id);
            //oldUser.toJson().id = oldUser.toJson().id;
            //oldUser.toJson().age = oldUser.toJson().age;
            //oldUser.passwordPusher().password = oldUser.passwordPusher().password;
            //oldUser.toJson().name = oldUser.toJson().name;
            stringBuilder += "EMAIL CHANGED";
            

        }

        if(userBody?.password != undefined && typeof userBody?.password == 'string'){
            //this.users.delete(id);
            newPatch = new User(oldUser.toJson().name, oldUser.toJson().age, oldUser.toJson().email, userBody?.password);
            this.users.set(id, newPatch);
            this.users.get(id).overrideUUID(id);
            this.users.get(id).passwordPusher().password = userBody?.password;
            //this.editUserData(newPatch, id);

            //oldUser.passwordPusher().password = userBody?.password;
            //oldUser.toJson().name = oldUser.toJson().name;
            //oldUser.toJson().age = oldUser.toJson().age;
            //oldUser.toJson().email = oldUser.toJson().email;
         stringBuilder += "PASSWORD CHANGED";

        }

        if(userBody?.id != undefined && typeof userBody?.id == "string"){

            //newPatch = new User(oldUser.toJson().name, oldUser.toJson().age, oldUser.toJson().email, oldUser.passwordPusher());
            //this.users.set(this.getKey(id), newPatch);
            //oldUser = newPatch;
            console.log("Old UUID was: " + oldUser.toJson().id);
            oldUser.overrideUUID(userBody?.id);
            console.log("New UUID is: " + newPatch.toJson().id);
            stringBuilder += "\n<br>ID: " + userBody?.id;

        }

      

        if(stringBuilder == null || stringBuilder == ""){
            return {success: false, data: "NO_CHANGES_MADE!"}
        }
        else{
            return {success: true, data: this.users.get(id).toJson()};
        }

    }


    broadSearch(searchString:string){
        
        for(const iter1 of this.users.values()){
            //console.log(iter1.toJson().id);

            
            
            if(iter1.toJson().name === searchString){
               
             
                return iter1.toJson();
           
             }

            if(iter1.toJson().age === parseInt(searchString)){

                return iter1.crudPusher();
            }

            if(iter1.toJson().email === searchString){
                return iter1.crudPusher();

            }

            if(iter1.toJson().id === searchString){
                return iter1.crudPusher();
            }
        }
        console.log(searchString + "NOT FOUND")
        return {success: false, data: "NOT FOUND"};
    }


    emailChk(email:string){

        for(const iter1 of this.users.values()){
            if(iter1.toJson().email == email){
                console.log("Email exists: " + email + "\nFrom account: " + iter1.toJson());
                return false; //lol not unique, baka! >///<
            }
        }
        return true; //is unique >:)
    }


    validateBody(body: any){

        var stringBuilder;

        if(typeof body?.age == "number" && typeof body?.name == "string" && typeof body?.email == "string" && typeof body?.password == "string"){
            console.log("Valid, kunuhay - Types Match!");
            if(body?.name != "undefined" && body?.age != "undefined" && body?.email != "undefined" && body?.password != "undefined"){
                console.log("All fields have content - Body fields complete!");
                for(const iter1 of this.users.values()){
                    if(iter1.toJson().email === body?.email){
                        return {success: false, data: "EMAIL_EXISTS!"}
                    }
                }
                return true;
            }
        
         }

         else{

            //oh dear a heap of boilerplate

            

             if(typeof body?.name == "undefined"){
             return {success: false, data: "NO_NAME_VALUE"};
             }

             if(typeof body?.age == "undefined"){
             return {success: false, data: "NO_AGE_VALUE"};
             }

             if(typeof body?.email == "undefined"){
             return {success: false, data: "NO_EMAIL_VALUE"};
             }

             if(typeof body?.password == "undefined"){
             return {success: false, data: "NO_PASSWORD_VALUE"};
             }

             //phew, now let's move onto incompatible datatype checking

            

             if(typeof body?.name != "string"){
             stringBuilder += " - Name value is not a String!";
             return {success: false, data: "NAME_VALUE_TYPE_MISMATCH"};
             }

             if(typeof body?.age != "number"){
             stringBuilder += " - Age value is not a number!";
             return {success: false, data: "AGE_VALUE_TYPE_MISMATCH"};
             }

             if(typeof body?.email != "string"){
             stringBuilder += " - Email value is not a string!";
             return{success: false, data: "EMAIL_VALUE_TYPE_MISMATCH"};
             }

             if(typeof body?.password != "string"){
             stringBuilder += " - Password value is not a string!";
             return {success: false, data: "PASSWORD_VALUE_TYPE_MISMATCH"};
             }

             
             console.log(stringBuilder);
             return {success: false, data: "UNDEFINED_VALUE_TYPE_MISMATCH"};

         }

    }
    }

