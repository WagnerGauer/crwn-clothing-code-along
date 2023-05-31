import { createContext, useState, useEffect } from "react";

import {
   onAuthStateChangedListener,
   createUserDocumentFromAuth,
} from "../utils/firebase/firebase.utils";

export const UserContext = createContext({
   currentUser: null,
   setCurrentUser: () => null,
});

export const UserProvider = ({ children }) => {
   const [currentUser, setCurrentUser] = useState(null);
   const value = { currentUser, setCurrentUser };

   useEffect(() => {
      const unsubscribe = onAuthStateChangedListener((user) => {
         if (user) {
            createUserDocumentFromAuth(user);
            // if the there already is a user document, it simply
            // returns the user document. Otherwise it creates a
            // new user document and returns it
         }
         setCurrentUser(user);
         // if the user is now logged in, the currentUser is set to the
         // entire user object with all of its properties,
         // if the user is null(the user is not logged in)
         // this sets current user to null
      });
      // A useEffect hook will run whatever it is returned when it unmounts
      // This is a cleanup function
      return unsubscribe;
      // onAuthStateChanged always returns a cleanup function which in this case
      // I assigned the name of unsubscribe, WHEN THE COMPONENT UNMOUNTS(is not used anymore)
      // the unsubscribe function eliminates the event listener.
      // !! useEffect always runs whatever you return once it unmounts
   }, []);
   // This returns a component that has as its props value. The value prop
   // has the currentUser state and the setCurrentUser setter function.
   // This allows all children of UserProvider to have access to those props
   return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
