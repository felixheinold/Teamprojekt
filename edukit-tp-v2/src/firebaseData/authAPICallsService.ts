/// <reference types="vite/client" />

export class AuthAPICallsService {
  baseURL = import.meta.env.DEV
    ? "http://127.0.0.1:8000"
    : "https://api.edukit-tp.me";

  /**
   * 📤 Neues Benutzerprofil anlegen
   */
  async newUserAPICall(
    id: string,
    name: string,
    email: string,
    picture: string
  ): Promise<any> {
    const url = `${this.baseURL}/users/new-user`;
    const body = {
      id,
      email,
      name,
      picture,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `❌ newUserAPICall fehlgeschlagen! Status: ${response.status} ${response.statusText}, Antwort: ${errorText}`
        );
      }

      const responseData = await response.json();
      console.log("✅ newUserAPICall erfolgreich:", responseData);
      return responseData;
    } catch (error: any) {
      console.error("❌ newUserAPICall error:", error.message);
      throw error;
    }
  }

  /**
   * 🛠️ Benutzer-E-Mail aktualisieren
   */
  async updatedMailAddressAPICall(
    name: string | null,
    email: string | null,
    id: string | null
  ): Promise<any> {
    if (!id || !email) {
      throw new Error("❌ ID und E-Mail dürfen nicht leer sein!");
    }

    const url = `${this.baseURL}/users/${id}/update`;
    const body = {
      email,
      name,
    };

    try {
      const response = await fetch(url, {
        method: "PUT", // ← PUT besser als POST für Updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `❌ updateUserAPICall fehlgeschlagen! Status: ${response.status} ${response.statusText}, Antwort: ${errorText}`
        );
      }

      const responseData = await response.json();
      console.log("✅ updatedMailAddressAPICall erfolgreich:", responseData);
      return responseData;
    } catch (error: any) {
      console.error("❌ updatedMailAddressAPICall error:", error.message);
      throw error;
    }
  }

  // Hier kannst du weitere API-Methoden anhängen
}
