import { UserProfile } from "../context/UserProfileModel";
import { auth } from "./firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

export class GeneralAPICallsService {
  baseURL = import.meta.env.DEV
    ? "http://127.0.0.1:8000"
    : "https://api.edukit-tp.me";

  /**
   * 📄 PDF Upload
   */
  async uploadPDFAPICall(formData: FormData) {
    const url = `${this.baseURL}/ai-model/upload-pdf`;

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("❌ PDF-Upload fehlgeschlagen");
    }

    return await res.json();
  }

// API Call for updating user data

async updateUserDataInFirestore(user: UserProfile) {
  const url = this.baseURL + "/users/update-whole-user/" + user.user_id;
  const userBody = JSON.stringify({ user_updates: user });

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: userBody,
  });

  // 🔍 Prüfe explizit auf Fehlermeldung (z. B. 422 Unprocessable Content)
  if (!res.ok) {
    const text = await res.text(); // Nicht immer JSON!
    console.error(`❌ Fehler beim User-Update (${res.status}):`, text);
    throw new Error(`Backend-Fehler ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data;
}



// API Call for current values of an user object --> current state in firestore

async getUserDataFromFirestore(userId?: string, field?: string) {
  const uid = userId || auth.currentUser?.uid;
  if (!uid) {
    throw new Error("User not authenticated or UID not provided");
  }

    const url = new URL(`${this.baseURL}/users/${uid}`);
    if (field) {
      url.searchParams.set("field", field);
    }

    const res = await fetch(url.toString(), {
      method: "GET",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `❌ Fehler beim Abrufen der Nutzerdaten. Status: ${res.status}, Antwort: ${errorText}`
      );
      throw new Error("Fehler beim Abrufen der Nutzerdaten");
    }

    const data = await res.json();
    console.log("✅ Nutzerdaten geladen:", data);
    return data;
  }

  /*
  *
  */

  async updateUserField(userId: string, updates: Record<string, any>) {
    const url = `${this.baseURL}/users/update-general-info/${userId}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_updates: updates }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Fehler beim Teilupdate:", text);
      throw new Error("Feld konnte nicht aktualisiert werden");
    }

    return await res.json();
  }



  /**
   * 🗑️ Nutzer aus dem Backend löschen
   */
  async deleteUser(userId: string): Promise<any> {
    const url = `${this.baseURL}/users/${userId}`;
    const res = await fetch(url, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Fehler beim Löschen: ${res.status} – ${errorText}`);
      throw new Error("Benutzer konnte nicht gelöscht werden");
    }

    const data = await res.json();
    console.log("✅ Benutzer gelöscht:", data);
    return data;
  }

  /**
   * 🔐 Passwort-Zurücksetzung via Firebase
   */
  async sendResetPasswordEmail(email: string) {
    if (!email) throw new Error("E-Mail fehlt");

    await sendPasswordResetEmail(auth, email);
    console.log("✅ Passwort-Zurücksetzungsmail gesendet an:", email);
  }
}
