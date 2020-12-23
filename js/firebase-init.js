// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAK_ne9NE8NND7yDgujjyNdrxQ7yik1RbQ",
    authDomain: "hashincludeblog.firebaseapp.com",
    databaseURL: "https://hashincludeblog.firebaseio.com",
    projectId: "hashincludeblog",
    storageBucket: "hashincludeblog.appspot.com",
    messagingSenderId: "24676758854",
    appId: "1:24676758854:web:3e492386596188a0bb6147",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//firebase references
var db = firebase.firestore();
var auth = firebase.auth();
// var storage = firebase.storage();