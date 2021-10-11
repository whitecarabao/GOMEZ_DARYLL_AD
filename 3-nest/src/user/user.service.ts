import { Injectable } from '@nestjs/common';
import { randomInt, randomUUID } from 'crypto';
import { max } from 'rxjs';
import { User } from './info.struct';
import { v4 as uuidv4 } from 'uuid';
import { Helper } from './Helper';
import { CRUDReturn } from './crud_return.interface';
import * as admin from 'firebase-admin';
import { database } from 'firebase-admin';
import { DH_CHECK_P_NOT_PRIME } from 'constants';
import { resourceLimits } from 'worker_threads';

@Injectable()
export class UserService {
  private DB = admin.firestore();

  seqNum = 0;
  users: Map<string, User> = new Map<string, User>();

 constructor() {
    this.users = Helper.populate();
    /*this.users.forEach((user) => {
      this.commit(user, 'none', user.toJsonSecure().id);
    });*/


    //inefficent way of committing prepopped users in the db in sequence
    /*for(const leanne of this.users.values()){
        if(leanne.toJson().name === "Leanne Graham"){
           this.commit(leanne,"none",leanne.toJson().id);
        }

    }

    for(const ervin of this.users.values()){
        if(ervin.toJson().name === "Ervin Howell"){
            this.commit(ervin,"none",ervin.toJson().id);
        }
    }

    for(const nathan of this.users.values()){
        if(nathan.toJson().name === "Nathan Plains"){
            this.commit(nathan,"none",nathan.toJson().id);
        }
    }

    for(const patricia of this.users.values()){
        if(patricia.toJson().name === "Patricia Lebsack"){
            this.commit(patricia,"none",patricia.toJson().id);
        }
    }
    */
    this.printAllUsers();
    //var dbIterVar = await this.DB.collection('user').listDocuments();

    // this.populate();
  }

  async addUser(body: any): Promise<CRUDReturn> {
    try {
      var bodyOK: boolean = Helper.validBody(body).valid;
      if (bodyOK) {
        if ((await this.emailExists(body.email)) === false) {
          if (this.validateBody(body) == true) {
            var usrHldr: User = new User(
              body.name,
              body.age,
              body.email,
              body.password,
              body?.id,
            );
          }
        }
        if (await this.commit(usrHldr, 'none', usrHldr.toJsonSecure().id)) {
          return {
            success: true,
            data: usrHldr.toJson(),
          };
        }
      } else {
        return {
          success: false,
          data: 'Email: ' + body.email + ' already exists in database',
        };
      }
    } catch (e) {
      return { success: false, data: 'ERROR REGISTERING ACCOUNT' };
    }
  }

  async commit(usr: User, option?: string, id?: string): Promise<CRUDReturn> {
    try {
      if (option === 'patchMode') {
      }
      var DB = admin.firestore();
      var emEx = this.emailExists(usr.toJson().email);
      if ((await emEx) === false) {
        var res = await DB.collection('user').doc(id).set(usr.toJsonSecure());
        console.log(
          'Email [' + usr.toJson().email + '] does not exist. Committing...',
        );
        return { success: true, data: usr.toJson() };
      } else {
        console.log(
          'Email [' + usr.toJson().email + '] exists. Not committing',
        );
      }
    } catch (error) {
      console.log(error);
      return { success: false, data: error.message };
    }
  }

  async getAllUserObj(): Promise<Array<User>> {
    var res: Array<User> = [];
    try {
      var dbDat: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
        await this.DB.collection('user').get();

      dbDat.forEach((doc) => {
        if (doc.exists) {
          var data = doc.data();
          res.push(
            new User(
              data['name'],
              data['age'],
              data['email'],
              data['password'],
              data['id'],
            ),
          );
        }
      });
      return res;
    } catch (e) {
      return null;
    }
  }

  async printAllUsers(): Promise<CRUDReturn> {
    var res: Array<any> = [];
    try {
      var allUsr = await this.getAllUserObj();
      allUsr.forEach((user) => {
        res.push(user.toJsonSecure());
      });
      return { success: true, data: res };
    } catch (e) {
      return { success: false, data: e };
    }
  }

  /*async printAllUsers() {
    var stringBuilder = [];
    var db: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
      await this.DB.collection('user').get();
    db.forEach((doc) => {
      if (doc.exists) {
        stringBuilder.push({
          id: doc.id,
          name: doc.data()['name'],
          age: doc.data()['age'],
          email: doc.data()['email'],
        });
      }
    });

    //for (const user of this.users.values()) {
    //   stringBuilder.push(user.toJson());
    //}
    console.log(stringBuilder);
    return { success: true, data: stringBuilder };
  }
  */

  async userQuery(query: string): Promise<CRUDReturn> {
    try {
      var resulta = await this.DB.collection('user').doc(query).get();
      if (resulta.exists) {
        return {
          success: true,
          data: resulta.data(),
        };
      } else {
        return {
          success: false,
          data: `User ${query} does not exist within the database`,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        data: error,
      };
    }
  }

  async checkExists(body: any): Promise<CRUDReturn> {
    try {
      var dbIter = await this.DB.collection('user').get();

      for (const dbIterVar of dbIter.docs) {
        if (body.id === dbIterVar.id) {
          return { success: true, data: dbIterVar.data() };
        }
      }

      return { success: false, data: 'DOES NOT EXIST' };
    } catch (e) {
      return { success: false, data: 'ERROR_CHKEXISTS' };
    }
  }

  async editUserData(user: any, id: string): Promise<CRUDReturn> {
    try {
      var validPutBody = await Helper.validBodyPut(user).valid;

      if ((await this.userQuery(id)).success == true) {
        if (validPutBody == true) {
          if ((await this.emailExists(user?.email)) == false) {
            var db = this.DB.collection('user').doc(id);
            var usr: User = new User(
              user.name,
              user.age,
              user.email,
              user.password,
              id,
            );
            db.update(usr.toJsonSecure());
            console.log(usr.toJson());
            return { success: true, data: usr.toJson() };
          } else {
            return { success: false, data: 'EMAIL EXISTS' };
          }
        } else {
          return { success: false, data: Helper.validBodyPut(user).data };
        }
      } else {
        return { success: false, data: 'ACC_NON_EXISTENT' };
      }
    } catch (e) {
      return { success: false, data: 'ERROR!' };
    }
  }

  async deleteAccount(id: string): Promise<CRUDReturn> {
    try {
      var delDbSearcher = await this.DB.collection('user').get();
      for (const delDoc of delDbSearcher.docs) {
        if (delDoc.id === id) {
          const deletedDocCpy = delDoc.data();
          this.DB.collection('user').doc(delDoc.id).delete();
          return { success: true, data: deletedDocCpy };
        }
      }
      return { success: false, data: 'ACC_NOT_FOUND' };
    } catch (err) {
      return { success: false, data: `${err.message}` };
    }
  }

  async authFunction(body: any) {
    try {
      var dbDocIter = await this.DB.collection('user').get();

      for (const authDocs of dbDocIter.docs) {
        if (
          authDocs.data()['email'] == body.email &&
          authDocs.data()['password'] != body.password
        ) {
          return { success: false, data: 'WRONG PASSWORD!' };
        }

        if (
          authDocs.data()['password'] == body.password &&
          authDocs.data()['email'] == body.email
        ) {
          return { success: true, data: authDocs.data() };
        }
      }
      return { success: false, data: 'ACCOUNT_NON_EXISTENT!' };
    } catch (err) {}

    return { success: false, data: 'LOGIN_FAILED' };
  }

  async patchFunc(id: string, userBody: any): Promise<CRUDReturn> {
    try {
      var changeArray = '';

      //if(typeof userBody?.email != "string" || typeof userBody?.name != "string" ||
      //  typeof userBody?.password != "string" || typeof userBody?.age != "number"  ) {
      //    return {success: false, data: "INVALID OBJECT TYPE"};
      //}

      if (
        userBody?.password != undefined &&
        typeof userBody?.password != 'string'
      ) {
        return { success: false, data: 'PASSWRD_VALUE_TYPE_MISMATCH' };
      }
      if (userBody?.name != undefined && typeof userBody?.name != 'string') {
        return { success: false, data: 'NAME_VALUE_TYPE_MISMATCH' };
      }
      if (userBody?.email != undefined && typeof userBody?.email != 'string') {
        return { success: false, data: 'EMAIL_VALUE_TYPE_MISMATCH' };
      }
      if (userBody?.age != undefined && typeof userBody?.age != 'number') {
        return { success: false, data: 'AGE_VALUE_TYPE_MISMATCH' };
      }
      if (userBody?.email != undefined) {
        if ((await this.emailExists(userBody?.email)) == true) {
          return { success: false, data: 'EMAIL_EXISTS_PATCH_FAILURE' };
        }
      }

      var db = this.DB.collection('user').doc(id);
      if ((await db.get()).exists == true) {
        if (
          userBody?.name != undefined &&
          userBody?.name != null &&
          typeof userBody?.name == 'string'
        ) {
          console.log('Name set to ' + userBody?.name);
          changeArray += '\nName changed to' + userBody?.name;
          await db.update({ name: userBody?.name });
        }
        if (
          userBody?.email != undefined &&
          userBody?.email != null &&
          typeof userBody?.email == 'string'
        ) {
          console.log('Email is set to ' + userBody?.email);
          changeArray += 'Email is set to ' + userBody?.email;
          await db.update({ email: userBody?.email });
        }
        if (userBody?.age != undefined && typeof userBody?.age == 'number') {
          console.log('Age set to ' + userBody?.age);
          changeArray += 'Age is set to ' + userBody?.age;
          await db.update({ age: userBody?.age });
        }
        if (
          userBody?.password != undefined &&
          userBody?.password != null &&
          typeof userBody?.password == 'string'
        ) {
          console.log('Password set to ' + userBody?.password);
          changeArray += 'Password changed.';
          await db.update({ password: userBody?.password });
        }

        if (changeArray != null || changeArray != '') {
          return {
            success: true,
            data: (await this.DB.collection('user').doc(id).get()).data(),
          };
        } else {
          return { success: false, data: 'NO_PATCHED_FIELDS' };
        }
      } else {
        return { success: false, data: 'ID_NOT_FOUND' };
      }
    } catch (e) {
      return { success: false, data: e };
    }
  }

  async broadSearch(searchString: string): Promise<CRUDReturn> {
    try {
      var dbDatQuery = await this.DB.collection('user').get();
      var resArr = [];
      resArr = [];
      dbDatQuery.forEach(doc=>{
        if (doc.data()['email'] == searchString) {
          console.log('Email is searchString');
          resArr.push(doc.data());
          //return { success: true, data: doc.data() };
        }
        if (doc.data()['name'] == searchString) {
          console.log('Name is searchString');
          resArr.push(doc.data());
          //return { success: true, data: doc.data() };
        }
        if (doc.data()['id'] == searchString) {
          console.log('Id is searchString');
          resArr.push(doc.data());
          //return { success: true, data: doc.data() };
        }
        if (doc.data()['age'] == searchString) {
          console.log('Age is searchString');
          resArr.push(doc.data());
          //return { success: true, data: doc.data() };
        }
        if (resArr.length > 0) {
            console.log(resArr);
            return {success: true, data: resArr};
        }
       
      }
      )
      if (resArr.length > 0) {
        console.log(resArr);
        return {success: true, data: resArr};
    }
    else{
        return {success: false, data:"NOT_FOUND!"};
    }

      
    } catch (e) {
      return { success: false, data: 'NOT FOUND' };
    }
  }

  validateBody(body: any) {
    var stringBuilder;

    if (
      typeof body?.age == 'number' &&
      typeof body?.name == 'string' &&
      typeof body?.email == 'string' &&
      typeof body?.password == 'string'
    ) {
      console.log('Valid, kunuhay - Types Match!');
      if (
        body?.name != 'undefined' &&
        body?.age != 'undefined' &&
        body?.email != 'undefined' &&
        body?.password != 'undefined'
      ) {
        console.log('All fields have content - Body fields complete!');
        for (const iter1 of this.users.values()) {
          if (iter1.toJson().email === body?.email) {
            return { success: false, data: 'EMAIL_EXISTS!' };
          }
        }
        return true;
      }
    } else {
      //oh dear a heap of boilerplate

      if (typeof body?.name == 'undefined') {
        return { success: false, data: 'NO_NAME_VALUE' };
      }

      if (typeof body?.age == 'undefined') {
        return { success: false, data: 'NO_AGE_VALUE' };
      }

      if (typeof body?.email == 'undefined') {
        return { success: false, data: 'NO_EMAIL_VALUE' };
      }

      if (typeof body?.password == 'undefined') {
        return { success: false, data: 'NO_PASSWORD_VALUE' };
      }

      //phew, now let's move onto incompatible datatype checking

      if (typeof body?.name != 'string') {
        stringBuilder += ' - Name value is not a String!';
        return { success: false, data: 'NAME_VALUE_TYPE_MISMATCH' };
      }

      if (typeof body?.age != 'number') {
        stringBuilder += ' - Age value is not a number!';
        return { success: false, data: 'AGE_VALUE_TYPE_MISMATCH' };
      }

      if (typeof body?.email != 'string') {
        stringBuilder += ' - Email value is not a string!';
        return { success: false, data: 'EMAIL_VALUE_TYPE_MISMATCH' };
      }

      if (typeof body?.password != 'string') {
        stringBuilder += ' - Password value is not a string!';
        return { success: false, data: 'PASSWORD_VALUE_TYPE_MISMATCH' };
      }

      console.log(stringBuilder);
      return { success: false, data: 'UNDEFINED_VALUE_TYPE_MISMATCH' };
    }
  }

  async emailExists(
    email: string,
    options?: { exceptionId: string },
  ): Promise<boolean> {
    try {
      var DB = admin.firestore();
      var usrRes = await DB.collection('user')
        .where('email', '==', email)
        .get();
      console.log('Are results empty?');
      console.log(usrRes.empty);
      if (usrRes.empty) return false;
      for (const doc of usrRes.docs) {
        console.log(doc.data());
        console.log('Are opts defined?');
        console.log(options != undefined);
        if (options != undefined) {
          if (doc.id == options?.exceptionId) continue;
        }
        if (doc.data()['email'] === email) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    } catch (error) {
      console.log('Email exists subfunction error');
      console.log(error.message);
      return false;
    }
  }
}
