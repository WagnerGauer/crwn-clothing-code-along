import { createContext, useState, useEffect } from "react";

import { getCategoriesAndDocuments } from "../utils/firebase/firebase.utils.js";

import SHOP_DATA from "../shop-data.js";

export const CategoriesContext = createContext({
   categoriesMap: {},
});

export const CategoriesProvider = ({ children }) => {
   const [categoriesMap, setCategoriesMap] = useState({});

   useEffect(() => {
      // !I never assign a useEffect function to be async!
      // If I am dealing with a function that makes a request and thus it is asyc
      // I need to create another function inside of the funciton that I pass to
      // the useEffect hook and asign that to be async
      const getCategoriesMap = async () => {
         const categoryMap = await getCategoriesAndDocuments();
         const CATEGORIES_KEYS = [
            "hats",
            "jackets",
            "mens",
            "sneakers",
            "womens",
         ];

         const filteredCategoryMap = Object.keys(categoryMap).reduce(
            (acc, key) => {
               if (CATEGORIES_KEYS.includes(key)) {
                  acc[key] = categoryMap[key];
               }
               return acc;
            },
            {}
            // This is the initial value
         );

         setCategoriesMap(filteredCategoryMap);
      };
      getCategoriesMap();
   }, []);

   // This was just to populate firestore database with dummy data comming from a file in this project
   // useEffect(() => {
   //    addCollectionAndDocuments("categories", SHOP_DATA);
   // }, []);

   const value = { categoriesMap };
   return (
      <CategoriesContext.Provider value={value}>
         {children}
      </CategoriesContext.Provider>
   );
};
