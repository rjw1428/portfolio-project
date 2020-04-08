import firebase from 'firebase'
var firebaseConfig = {
    apiKey: "AIzaSyAEAjJy7IR2FxQPSkgtow5VtlobJ3_obVQ",
    authDomain: "rjw-portfolio.firebaseapp.com",
    databaseURL: "https://rjw-portfolio.firebaseio.com",
    projectId: "rjw-portfolio",
    storageBucket: "rjw-portfolio.appspot.com",
    messagingSenderId: "398936865724",
    appId: "1:398936865724:web:cc832de051415f5f2709b9",
    measurementId: "G-764L319TV6"
};
// Initialize Firebase
var fire = firebase.initializeApp(firebaseConfig);
// fire = firebase.analytics();

export default fire;