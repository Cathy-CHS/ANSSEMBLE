// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { ref, child, get, set, getDatabase, onValue } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-8EF5xR-SODBJi8XK3Ei13YJiw-X0i1g",
  authDomain: "id311-finalteam5.firebaseapp.com",
  projectId: "id311-finalteam5",
  storageBucket: "id311-finalteam5.appspot.com",
  messagingSenderId: "957534001506",
  appId: "1:957534001506:web:bede6b717496bde6f6b43b",
  measurementId: "G-6GRFL3D471",
  databaseURL: "https://id311-finalteam5-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const dbRef = ref(db);
let data;
get(dbRef).then((snapshot) => {
    data = snapshot.val();
    // console.log("result: "+data);
    // console.log("result: "+JSON.stringify(data));
});

// get(dbRef).then((snapshot) => {
//     const data = snapshot.val();
//     console.log(data);
// });

// onValue(dbRef, (snapshot) => {
//     const data = snapshot.val();
//     data.forEach((element) => {
//         console.log(element);
//     });
// });

// const analytics = getAnalytics(app);

export default data;