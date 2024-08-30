import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBFsMBgW-Oc3jsxV0s-oWVoaMa0wXoXQsU",
  authDomain: "ashishsingh-411807.firebaseapp.com",
  databaseURL: "https://ashishsingh-411807-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ashishsingh-411807",
  storageBucket: "ashishsingh-411807.appspot.com",
  messagingSenderId: "906714643119",
  appId: "1:906714643119:web:98962f79b6bd70bc79725a",
  measurementId: "G-NMNDZ3GNC6"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
