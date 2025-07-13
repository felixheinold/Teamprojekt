
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyBjQ08VMzdKQb5TZuvxbWQ6nu7nRCFXs0k",

  authDomain: "edukit-tp.firebaseapp.com",

  projectId: "edukit-tp",

  storageBucket: "edukit-tp.firebasestorage.app",

  messagingSenderId: "833953524975",

  appId: "1:833953524975:web:b6718ee60de9cd3f303f1a"

};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);