import { auth } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateEmail,
  sendPasswordResetEmail,
  User,
  confirmPasswordReset,
} from "firebase/auth";
import { AuthPopupError } from "./firebaseDataModels";
import { AuthAPICallsService } from "./authAPICallsService";

export class AuthHandlingService {
  authAPICallsService: AuthAPICallsService;

  constructor() {
    this.authAPICallsService = new AuthAPICallsService();
  }

  /*********************************************************
   * Registrierung mit Username, Mail-Adresse und Passwort
   *********************************************************/
  async newRegistration(
    username: string,
    email: string,
    password: string,
    picture: string
  ) {
    if (!email.endsWith("kit.edu")) {
      throw new AuthPopupError("wrong mail address format");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      console.log("authHandling service:", userCredential.user.uid, username);

      await this.authAPICallsService.newUserAPICall(
        userCredential.user.uid,
        username,
        email,
        picture
      );

      return userCredential.user;
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        throw new AuthPopupError("auth/email-already-in-use");
      } else if (error.code === "auth/weak-password") {
        throw new AuthPopupError("auth/weak-password");
      } else if (error.code === "auth/invalid-email") {
        throw new AuthPopupError("auth/invalid-email");
      } else {
        throw new AuthPopupError(error.code || "unknown");
      }
    }
  }

  /**********************************************
   * E-Mail-Verifikation prüfen
   **********************************************/
  async checkEmailVerified(user: User) {
    await user.reload();
    return user.emailVerified;
  }

  /**********************************************
   * Passwort zurücksetzen
   **********************************************/
  async sendResetPasswordEmail(email: string) {
    if (!email.endsWith(".kit.edu")) {
      throw new AuthPopupError(
        "Nur Mail-Adressen der Form 'uxxxx@student.kit.edu' oder name@kit.edu sind zulässig!"
      );
    }
    await sendPasswordResetEmail(auth, email);
  }

  /**********************************************
   * E-Mail-Adresse ändern
   **********************************************/
  async changeEmail(user: User, newEmail: string) {
    if (!newEmail.endsWith(".kit.edu")) {
      throw new AuthPopupError("Ungültige neue E-Mail-Adresse");
    }

    await updateEmail(user, newEmail);
    await sendEmailVerification(user);

    if (user) {
      await this.authAPICallsService.updatedMailAddressAPICall(
        user.displayName,
        user.email,
        user.uid
      );
    }
  }

  /**********************************************
   * Account löschen
   **********************************************/
  async deleteAccount() {
    const user = auth.currentUser;
    if (user) {
      // TODO: API-Aufruf zur Löschung aus Firestore ergänzen
      await user.delete();
    }
  }

  /**********************************************
   * Login
   **********************************************/
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await userCredential.user.reload();

      if (!userCredential.user.emailVerified) {
        throw new AuthPopupError(
          "Bitte bestätige zuerst deine E-Mail-Adresse."
        );
      }

      return userCredential.user;
    } catch (error: any) {
      throw new AuthPopupError("Fehler beim Login: " + error.code);
    }
  }

  /**********************************************
   * Logout
   **********************************************/
  async logout() {
    return auth.signOut();
  }

  /**********************************************
   * Passwort nach Reset setzen
   **********************************************/
  async confirmPasswordAfterReset(oobCode: string, newPassword: string) {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      alert("Passwort erfolgreich zurückgesetzt. Bitte erneut anmelden.");
    } catch (error) {
      alert("Fehler beim Zurücksetzen des Passworts.");
    }
  }

  /**********************************************
   * Verifikationsmail erneut senden
   **********************************************/
  async sendVerificationMailAgain() {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        alert("Verifikationsmail wurde erneut gesendet.");
      } else {
        throw new Error();
      }
    } catch (error) {
      alert("Fehler beim erneuten Versenden der Verifikationsmail.");
    }
  }
}