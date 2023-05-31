// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
   getAuth,
   signInWithPopup,
   GoogleAuthProvider,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signOut,
   onAuthStateChanged,
} from "firebase/auth";
import {
   getFirestore,
   doc, // retrieve documents inside firestore database
   getDoc, // get the document data
   setDoc, // set the document data
   collection,
   writeBatch,
   query,
   getDocs,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyASyW0wDPvIlRCgmzYq_ZzbVa3GSRpl59Q",
   authDomain: "crwn-db-ebf92.firebaseapp.com",
   projectId: "crwn-db-ebf92",
   storageBucket: "crwn-db-ebf92.appspot.com",
   messagingSenderId: "27037811868",
   appId: "1:27037811868:web:d540fac27c443d39985959",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
   prompt: "select_account",
});
// The purpose of the provider is to sign in the user.

export const auth = getAuth();
// I need the auth object to create a user, sign in and out a user, and probably more
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
// The function onAuthStateChangedListener listens if the user has signed in
// it does not matter which method he uses

export const db = getFirestore();

export const addCollectionAndDocuments = async (
   collectionKey, // the name of the collection
   objectsToAdd
) => {
   const collectionRef = collection(db, collectionKey);
   const batch = writeBatch(db);

   objectsToAdd.forEach((object) => {
      const docRef = doc(collectionRef, object.title.toLowerCase());
      batch.set(docRef, object);
   });

   await batch.commit();
};

export const getCategoriesAndDocuments = async () => {
   const collectionRef = collection(db, "categories");
   const q = query(collectionRef);

   const querySnapshot = await getDocs(q);
   const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
      const { title, items } = docSnapshot.data();
      acc[title.toLowerCase()] = items;
      return acc;
   }, []);
   return categoryMap;
};

export const createUserDocumentFromAuth = async (
   userAuth,
   // userAuth is the currentUser property from the auth object
   additionalInformation = {}
) => {
   if (!userAuth) return;

   const userDocRef = doc(db, "users", userAuth.uid);

   const userSnapshot = await getDoc(userDocRef);
   // if there is a document for that user, the userSnapshot should countain
   // the contents of that document, I can use the .exists() method to
   // check whether or not a ducument for that user exists

   if (!userSnapshot.exists()) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();
      // if there is no user document for that user I create one here
      try {
         await setDoc(userDocRef, {
            displayName,
            email,
            createdAt,
            ...additionalInformation,
         });
      } catch (error) {
         console.log(error.code);
         if (error.code === "auth/wrong-password") {
            console.log("wrong");
            alert("incorrect password or email");
         }
         // console.log('error creating the user', error.message)
      }
   }

   return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
   if (!email || !password) return;

   return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInUserWithEmailAndPassword = async (email, password) => {
   if (!email || !password) return;

   return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
   onAuthStateChanged(auth, callback);
// Once I run OnAuthStateChangedListener that listener will
// always be there

// whenever the user logs in or out, the auth state changes, this causes the
// callback to be executed.
// A currentUser OBJECT(which is a property of auth) IS PASSED TO THE CALLBACK HERE,
// if the user is not authenticated what is passed down to the callback is NULL
// This is ALWAYS listening for a change in auth
