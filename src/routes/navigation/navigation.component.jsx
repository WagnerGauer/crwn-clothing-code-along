import { Fragment, useContext } from "react"; // react forces me to use a top level element, if I don't want to have a div in my html, I have to use this
import { Outlet } from "react-router-dom";

import CartIcon from "../../components/cart-icon/cart-icon.component";
import CartDropdown from "../../components/cart-dropdown/cart-dropdown.component";

import { UserContext } from "../../contexts/user.context";
import { CartContext } from "../../contexts/cart.context";

import { ReactComponent as CrwnLogo } from "../../assets/crown.svg";

import { signOutUser } from "../../utils/firebase/firebase.utils";

import {
   NavigationContainer,
   NavLinks,
   NavLink,
   LogoContainer,
} from "./navigation.styles";

const Navigation = () => {
   const { currentUser } = useContext(UserContext);
   const { isCartOpen } = useContext(CartContext);

   return (
      <Fragment>
         <NavigationContainer>
            <LogoContainer to="/">
               <CrwnLogo></CrwnLogo>
            </LogoContainer>
            <NavLinks>
               <NavLink to="/shop">SHOP</NavLink>
               {currentUser ? (
                  <NavLink as="span" onClick={signOutUser}>
                     SIGN OUT
                  </NavLink>
               ) : (
                  <NavLink to="/auth">Sign In</NavLink>
               )}
               <CartIcon />
            </NavLinks>
            {isCartOpen && <CartDropdown />}
         </NavigationContainer>
         <Outlet />
         {/* this enables that whatever component that is rendered will always be 
         rendered after the navigation */}
      </Fragment>
   );
};

export default Navigation;
