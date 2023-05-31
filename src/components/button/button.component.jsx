/*
default

inverted

google sign in
*/

// by creating this object it allows me to assign a classname that I feel is more descriptive and I am not forced to provive the name
// I will use as a classname whenever I make a new button

import "./button.styles";

import {
   BaseButton,
   GoogleSignInButton,
   InvertedButton,
} from "./button.styles";

export const BUTTON_TYPE_CLASSES = {
   base: "base",
   google: "google-sign-in",
   inverted: "inverted",
};

const getButton = (buttonType = BUTTON_TYPE_CLASSES.base) =>
   ({
      [BUTTON_TYPE_CLASSES.base]: BaseButton,
      [BUTTON_TYPE_CLASSES.google]: GoogleSignInButton,
      [BUTTON_TYPE_CLASSES.inverted]: InvertedButton,
   }[buttonType]);

const Button = ({ children, buttonType, ...otherProps }) => {
   const CustomButton = getButton(buttonType);
   return <CustomButton {...otherProps}> {children}</CustomButton>;
};

export default Button;
