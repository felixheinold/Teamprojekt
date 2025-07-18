import { UserProfile } from "../context/UserProfileModel";
import { auth } from "./firebaseConfig";
import { PlayerInLeaderboard } from "../pages/dashboard/UserDropdown/Leaderboard";

export class  GeneralAPICallsService {

 //baseURL = "https://api.edukit-tp.me"
 baseURL = "http://127.0.0.1:8000" //when testing for dev

//Upload PDF API Call

  async uploadPDFAPICall(formData: FormData){
    console.log("onUpload aufgerufen");
    const url = this.baseURL + "/ai-model/upload-pdf";
    const bodyPDF = formData;
    console.log("FormData PDF: ", formData);

    const res = await fetch(url, {
        method: "POST",
        body: bodyPDF
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

//API Call to fetch all GameUnits with certain characteristics
async fetchQuestionsWithQueryParams(queryParamString: string){
    const url = this.baseURL + "/ai-model/fetch-game-units" + queryParamString;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
    const data = await res.json();
    return data;
}


//API Call to get current leaderboard

async fetchCurrentLeaderboard():Promise<PlayerInLeaderboard []> {
    const url = this.baseURL + "/statistics/get-current-leaderboard"
    const res = await fetch (url, {
        method: "GET",
        headers: {
            "content-Type": "application/json"
        }
    })
    const data = await res.json();
    console.log("IM API CALL", data)
    return data;
}


}




