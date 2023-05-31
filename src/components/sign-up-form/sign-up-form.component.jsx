import { useState } from "react";

import FormInput from "../form-input/form-input.component";
import "./sign-up-form.styles.scss";
import Button from "../button/button.component";

import {
   createAuthUserWithEmailAndPassword,
   createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";

const defaultFormFields = {
   displayName: "",
   email: "",
   password: "",
   confirmPassword: "",
};

const SignUpForm = () => {
   const [formFields, setFormFields] = useState(defaultFormFields);
   const { displayName, email, password, confirmPassword } = formFields;
   // user is the name of the user

   const resetFormFields = () => {
      setFormFields(defaultFormFields);
   };

   const handleSubmit = async (event) => {
      event.preventDefault();

      if (password !== confirmPassword) {
         alert("passwords do not match");
         return;
      }

      try {
         const { user } = await createAuthUserWithEmailAndPassword(
            email,
            password
         );
         console.log(user);
         console.log(displayName);

         await createUserDocumentFromAuth(user, { displayName });
         // The above function creates a new document in Firestore. The function stores properties of the user object
         // in the Firestore
         resetFormFields();
      } catch (error) {
         if ((error.code = "auth/email-already-in-use")) {
            alert(`Cannot create user, ${error.code}`);
         } else {
            console.log("user creation encountered and arror", error);
         }
      }
   };

   const handleChange = (event) => {
      const { name, value } = event.target;

      console.log(name);
      console.log(value);

      // This code updates the formFields state whenever some change happens in the fields of the form(in this case the input
      // elements)

      setFormFields({ ...formFields, [name]: value }); // here I update a key value pair in formfieds, the spread operator
      //spreads all the contents of formFields into a new object, the variable name is surrounded by square brackets because
      // that way whatever value that name variable is equal to, is what is going to be assigned as the key for that specific
      // value. COMPUTED PROPERTY NAME is what is called when a property name is dinamic, and it would not work without those
      // !!!square brackets. THE SQUARE BRACKETS syntax is only used for the key and never the value of a property!!!
   };

   return (
      <div className="sign-up-container">
         <h2>Don't have an account?</h2>
         <span> Sign up with your email and password</span>
         <form onSubmit={handleSubmit}>
            <FormInput
               label="Display Name"
               type="text"
               required
               onChange={handleChange}
               name="displayName"
               value={displayName}
            />
            <FormInput
               label="Email"
               type="email"
               required
               onChange={handleChange}
               name="email"
               value={email}
            />

            <FormInput
               label="Password"
               type="password"
               required
               onChange={handleChange}
               name="password"
               value={password}
            />

            <FormInput
               label="Confirm Password"
               type="password"
               required
               onChange={handleChange}
               name="confirmPassword"
               value={confirmPassword}
            />

            <Button type="submit">Sign Up</Button>
         </form>
      </div>
   );
};

export default SignUpForm;
