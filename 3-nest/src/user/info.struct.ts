export class User {
    private id: number;
    private name: string;
    private age:number;
    private email:string;
    private password: string;

    constructor(id:number,name:string,age:number,email:string,password:string){
        this.id=id;
        this.name=name;
        this.age=age;
        this.email = email;
        this.password = password;
    }

    login(email:string, password:string){
        if(this.email === email && this.password === password){
            return true;
        }
        else{
            return false;
        }
        
        //return true or false
    }

    userPrompt(){
        //console.log(`${this.id}:${this.name}:${this.email}`);
        return(`${this.id}:${this.name}:${this.email}`);
    }

    checkAtt(value:string){
        if(parseInt(value) == this.id){
            return true;
        }

        if(parseInt(value) == this.age){
            return true;
        }

        if(value == this.name){
            return true;
        }

        if(value == this.email){
            return true;
        }

        else{
            return false;
        }
    }
    toJson(){
        return {
            id: this.id,
            name:this.name,
            age: this.age,
            email: this.email
        }
    }

    passwordPusher(){
        //this is just for the patch function forgive me :(

        return this.password;
    }
    
 
}