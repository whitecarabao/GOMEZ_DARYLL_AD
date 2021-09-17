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
    this.userCons.addUser(user);
    }

    @Get('/all/')
    getAllUser(){
        console.log("This should output ALL users");
        return this.userCons.printAllUsers();
    }

    @Get('/:userID')
    userQuery(@Param('userID') userID: string){
        var parsedID:number = parseInt(userID);
        //console.log("Yoohoo!" + parsedID);
       // console.log(this.userCons.userQuery(parsedID));
       
       return "User Information Query via ID <br>" + this.userCons.userQuery(parsedID)  + "<br> ------------- <br>End of data query."
        
    }

    @Put('/:userID')
    amendData(@Param('userID') userID: string, @Body() user:any){
        var parsedID : number = parseInt(userID);
        if(this.userCons.chkAccExists(parsedID)){
        return this.userCons.editUserData(user, parsedID);
        }
        else{
            return{
                error: "ID_NOT_FOUND",
                message: "No account with ID: " + parsedID + " exists in the system."
            }
        }
    }

    @Delete('/:userID')
    deleteAcc(@Param('userID') userID: string){
        var parsedID = parseInt(userID);

        if(this.userCons.chkAccExists(parsedID) == true){
        this.userCons.deleteAccount(parsedID);
        return "Account ID: [" + parsedID +"] successfully removed from our system!"
        }

        else{
        return "Deletion of Account with Account ID: [" + parsedID + "] could not be processed."
        }
    }

    @Post('/login')
    authProcess(@Body() body:any){
        return this.userCons.authFunction(body);
    }
    

    @Patch('/:userID')
    patchCreds(@Param('userID') userID: string, @Body() userBody:any){
        var parsedID = parseInt(userID);
        //console.log("Controller PATCH PARAM: " +parsedID);
        if(this.userCons.chkAccExists(parsedID)){

        
        return this.userCons.patchFunc(parsedID, userBody);
        
        }
        else{
            return{
                error: "ID_NOT_FOUND",
                message: "No account with ID: " + parsedID + " exists in the system."
            }
        }
    }

    @Get('/search/:term')
    wideSearch(@Param('term') term: string){
        console.log("Searching for term: " + term);
    return "Search System via Attribute<br><br>" + this.userCons.broadSearch(term);
    }

    
}

