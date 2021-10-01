import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { userInfo } from 'os';
import { User } from './info.struct';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
constructor(private readonly userCons: UserService){}



    @Post('/register/')
    regUser(@Body() user:any ){
    console.log(user);
    return this.userCons.addUser(user);
    
    }

    @Get('/all/')
    getAllUser(){
        console.log("This should output ALL users");
        return this.userCons.printAllUsers();
    }

    @Get('/:userID')
    userQuery(@Param('userID') userID: string){
        return this.userCons.userQuery(userID);
    }

    @Put('/:userID')
    amendData(@Param('userID') userID: string, @Body() user:any){
        
        if(this.userCons.chkAccExists(userID)){
        return this.userCons.editUserData(user, userID);
        }
        else{
            return{
                success: false,
                data: "No account with ID: " + userID + " exists in the system."
            }
        }
    }

    @Delete('/:userID')
    deleteAcc(@Param('userID') userID: string){
        

        if(this.userCons.chkAccExists(userID) == true){

        //var tempCopy: User = this.userCons.users.get(this.userCons.getKey(userID));
        this.userCons.deleteAccount(userID);
        this.userCons.users.delete(userID);
        return {success: true, data: "SUCCESS"};
        }

        else{
        return {success: false, data: "ACCOUNT_DOES_NOT_EXIST"}
        }
    }

    @Post('/login')
    authProcess(@Body() body:any){
        console.log(body);
        return this.userCons.authFunction(body);
    }
    

    @Patch('/:userID')
    patchCreds(@Param('userID') userID: string, @Body() userBody:any){
      
        //console.log("Controller PATCH PARAM: " +parsedID);
        if(this.userCons.chkAccExists(userID)){
        console.log("PATCHING ACCOUNT WITH ID: " + userID);
        
        return this.userCons.patchFunc(userID, userBody);
        
        }
        else{
            return{
                success: false,
                data: "No account with ID: " + userID + " exists in the system."
            }
        }
    }

    @Get('/search/:term')
    wideSearch(@Param('term') term: string){
        console.log("Searching for term: " + term);
    return this.userCons.broadSearch(term);
    }

    
}

