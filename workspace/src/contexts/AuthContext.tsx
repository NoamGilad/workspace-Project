import React, { Children, createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const AuthCtx = createContext("defaultValue");

const authCtxProvider = (children: any) => {
  const firebaseConfig = {
    apiKey:
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  return (
    <AuthCtx.Provider value={{ firebaseConfig, auth }}>
      {children}
    </AuthCtx.Provider>
  );
};

export default authCtxProvider;
