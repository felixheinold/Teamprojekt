


export class AuthAPICallsService{

    baseURL = "https://api.edukit-tp.me"

    //New User API Call

    async newUserAPICall(id: string, name: string, email:string, picture: string): Promise<any>{
        const url = this.baseURL + "/users/new-user";
        try{
            const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
      body: JSON.stringify({
        user_id: id,
        user_mail: email,
        user_name: name,
        user_profile_picture: picture
      }),
        });

        if (!response.ok) {
            throw new Error(`HTTP-Fehler bei Anfrage an API! Status: ${response.status}`);
        }

        const responseData = response.json();
        return responseData;
        }catch (error:any){
            throw error;
        }
  }

//Update User API Call (Update Mail Address)


      async updatedMailAddressAPICall(name: string | null, email: string | null, id: string | null): Promise<any>{
        const url = this.baseURL + "/users/" + id + "/update";
        try{
            const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify([email]),
        });

        if (!response.ok) {
            throw new Error(`HTTP-Fehler bei Anfrage an API! Status: ${response.status}`);
        }

        const responseData = response.json();
        return responseData;
        }catch (error:any){
            throw error;
        }

  }

}