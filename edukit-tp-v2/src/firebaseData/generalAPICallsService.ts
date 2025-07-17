import { UserProfile } from "../context/UserProfileModel";
import { auth } from "./firebaseConfig";

export class  GeneralAPICallsService {

 baseURL = "https://api.edukit-tp.me"

//Upload PDF API Call

  async uploadPDFAPICall(formData: FormData){
    const url = this.baseURL + "/ai-model/upload-pdf";
    const res = await fetch(url, {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      return data;
  }

// API Call for updating user data

async updateUserDataInFirestore (user: UserProfile){
    const url = this.baseURL + "/users/update-whole-user/" + user.user_id;
    const userBody = JSON.stringify(user);
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: userBody
    })
    const data = await res.json();
    return data;
}


// API Call for current values of an user object --> current state in firestore

async getUserDataFromFirestore(userId?: string, field?: string) {
  const uid = userId || auth.currentUser?.uid;
  if (!uid) {
    throw new Error("User not authenticated or UID not provided");
  }

  const url = new URL(this.baseURL + "/users/" + uid);
  if (field) {
    url.searchParams.set("field", field);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Fehler beim Abrufen der Nutzerdaten");
  }

  const data = await res.json();
  return data;
}




}

