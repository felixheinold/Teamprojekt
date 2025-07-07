import { auth } from "./firebaseConfig";
import { db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateEmail,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { AuthPopupError } from "./firebaseDataModels";
import { AuthAPICallsService } from "./authAPICallsService";

export class AuthHandlingService {

 authAPICallsService: AuthAPICallsService 
  constructor(){
    this.authAPICallsService = new AuthAPICallsService();
  }
/********************************************************* */
//Registrierung mit Username, Mail-Adresse und Passwort
/********************************************************* */

  async newRegistration(username: string, email: string, password: string, picture: string){

      if(!email.endsWith("kit.edu")){
      throw new AuthPopupError("Nur Mail-Adressen der Form 'uxxxx@student.kit.edu' oder **name**@kit.edu sind zulässig! Only mail adresses like 'uxxxx@student.kit.edu' or  **name**@kit.edu are valid!");
      }
  // 1. Registierung und E-Mail-Versand
      try{
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await sendEmailVerification(userCredential.user);
          
          //hier Methode von AuthAPICall, um neuen Nutzer anzulegen
          this.authAPICallsService.newUserAPICall(userCredential.user.uid, username, email, picture);

          return userCredential.user;

      } catch (error: any){
          if(error.code === "auth/email-already-in-use"){
              throw new AuthPopupError("Mail-Adresse existiert bereits! \nMail address already exists!");
          }else {
            throw new AuthPopupError(error.code);
          }
      }
  }

    // 2. Prüfen, ob E-Mail bestätigt ist
    async checkEmailVerified(user:User){
        await user.reload();
        return user.emailVerified;
    }




  /********************************************** *
  Passwort zurücksetzen
  ********************************************** */

  async sendResetPasswordEmail(email: string) {
    if (!email.endsWith(".kit.edu")) {
      throw new AuthPopupError("Nur Mail-Adressen der Form 'uxxxx@student.kit.edu' oder **name**@kit.edu sind zulässig! Only mail adresses like 'uxxxx@student.kit.edu' or  **name**@kit.edu are valid!");
    }
    await sendPasswordResetEmail(auth, email);
  }



  /********************************************** *
  E-Mail-Adresse ändern
  ********************************************** */

  async changeEmail(user: User, newEmail: string) {
    if (!newEmail.endsWith(".kit.edu")) {
      throw new AuthPopupError("Nur Mail-Adressen der Form 'uxxxx@student.kit.edu' oder **name**@kit.edu sind zulässig! Only mail adresses like 'uxxxx@student.kit.edu' or  **name**@kit.edu are valid!");
    }
    await updateEmail(user, newEmail);
    await sendEmailVerification(user);

    // hier noch API Call für veränderte Mail-Adresse
    if (user){
      this.authAPICallsService.updatedMailAddressAPICall(user.displayName, user.email, user.uid)
    }
  }


 /********************************************** *
  User aus Auth löschen
  ********************************************** */

  
async deleteAccount() {
  const user = auth.currentUser;
  if (user) {
    
    //hier noch API Call um User zu löschen aus Firestore

    // Firebase Auth User löschen
    await user.delete();
  }

}


  /********************************************** *
    User Login
  ********************************************** */

  async  login(email: string, password: string) {
    try{
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await userCredential.user.reload(); // User-Status aktualisieren
      if (!userCredential.user.emailVerified) {
        throw new AuthPopupError("Bitte bestätige zuerst deine E-Mail-Adresse. Please confirm your mail address first!");
      }
      return userCredential.user; 
    }
   catch (error:any){
      throw new AuthPopupError(error.code);
    }
 
  }

  /********************************************** *
    User Logout
  ********************************************** */


  async logout(){
    return auth.signOut();
  }

}

