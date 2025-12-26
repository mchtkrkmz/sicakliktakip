// Firebase Configuration
// Bu dosyayı Firebase Console > Project Settings > Your apps > SDK setup and configuration bölümünden alacağınız bilgilerle güncelleyin

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase'i başlat
firebase.initializeApp(firebaseConfig);

// Firestore referansı
const db = firebase.firestore();

// Collection adı
const COLLECTION_NAME = 'temperature-humidity-measurements';
