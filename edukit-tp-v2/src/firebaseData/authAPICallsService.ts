


export class AuthAPICallsService{

    baseURL = "https://api.edukit-tp.me"

    //New User API Call

    async newUserAPICall(id: string, name: string, email:string, picture: string): Promise<any>{
        const url = this.baseURL + "/users/new-user";
        const body = {
          "id": id,
          "mail": email,
          "name": name,
          "picture": picture
        }
        try{
            const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        body: JSON.stringify(body),
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

////////////////////////////////////////////////////////////////////////////////////////////
//////////////                Further API Calls in same file
///////////////////////////////////////////////////////////////////////////////

  async uploadPDFAPICall(formData: FormData){
    const url = this.baseURL + "/ai-model/upload-pdf";
    const res = await fetch(url, {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      return data;
  }
}