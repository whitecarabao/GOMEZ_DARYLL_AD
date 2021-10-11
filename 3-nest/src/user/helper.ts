import { User } from './info.struct';
import { v4 as uid } from 'uuid';
import { UserService, UserService as usrSrv } from './user.service';
import * as admin from 'firebase-admin';
export class Helper {
  private DB = admin.firestore();
  users: Map<string, User> = new Map<string, User>();
  //constructor(private readonly userCons: usrSrv){}
  //returns an array of attributes as defined in the class
  static describeClass(typeOfClass: any): Array<any> {
    let a = new typeOfClass();
    let array = Object.getOwnPropertyNames(a);
    return array;
  }

  static generateUID(): string {
    return uid().toString().replace(/-/g, '').substring(0, 27);
  }
  //removes an item matching the value from the array
  static removeItemOnce(arr: Array<any>, value: any): Array<any> {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
  static populate(): Map<string, User> {
    
    var result: Map<string, User> = new Map<string, User>();
    try {
      var users = [
        new User('Leanne Graham', 18, "sincere@april.biz", "LG_123456"),
        new User('Ervin Howell', 21, 'shanna@melissa.tv', 'EH_123123'),
        new User('Nathan Plains', 25, 'nathan@yesenia.net', 'NP_812415'),
        new User("Patricia Lebsack", 18, "patty@kory.org", "PL_12345"),
      ];
      users.forEach((user) => {
        this.commit(user, "none", user.toJson().id);
        result.set(user.toJson().id, user);
      });
      return result;
    } catch (error) {
      console.log(error);
      
      return null;
    }
  }

  static async commit(usr: User, option?: string, id?: string)  {
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

 static async emailExists(
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

  static validBody(body: any): { valid: boolean; data: string } {
    try {
      var keys: Array<string> = Helper.describeClass(User);
      var types: Map<string, string> = new Map<string, string>();
      types.set('name', typeof '');
      types.set('age', typeof 0);
      types.set('email', typeof '');
      types.set('password', typeof '');
      for (const key of Object.keys(body)) {
        if (!keys.includes(`${key}`) && typeof body[key] != types.get(key)) {
          return { valid: false, data: `${key} is not a valid attribute` };
        }
        if (typeof body[key] != types.get(key)) {
          throw new Error(
            `${key} with value ${body[key]} with type ${typeof body[
              key
            ]} is not a valid entry, expecting ${key}:${types.get(key)}`,
          );
        }
      }
      return { valid: true, data: null };
    } catch (error) {
      return { valid: false, data: error.message };
    }
  }

  static validBodyPut(body: any): { valid: boolean; data: string } {
    try {
      var bodyValidation: { valid: boolean; data: string } =
        this.validBody(body);
      if (bodyValidation.valid) {
        var keys: Array<string> = Helper.describeClass(User);
        keys = Helper.removeItemOnce(keys, "id");
        for (const key of Object.keys(body)) {
          if (keys.includes(`${key}`)) {
            keys = Helper.removeItemOnce(keys, key);
          }
        }
        if (keys.length > 0) {
          throw Error(`Payload is missing ${keys}`);
        }
        return { valid: true, data: null };
      } else throw Error(bodyValidation.data);
    } catch (error) {
      return { valid: false, data: error.message };
    }
  }
}