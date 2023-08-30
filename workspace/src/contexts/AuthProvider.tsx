import { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

type AuthContextType = {
  firebaseConfig: any;
  auth: Auth | null; // Auth type or null
};

export const AuthCtx = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const firebaseConfig = {
    apiKey: "AIzaSyBe1wv4MJC_mdTvA2WVoJhDgkFOUDic8TE",
    authDomain: "workspace-f24ed.firebaseapp.com",
    projectId: "workspace-f24ed",
    storageBucket: "workspace-f24ed.appspot.com",
    messagingSenderId: "679400397923",
    appId: "1:679400397923:web:08dc2dae777d167dceac56",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const storeDataBase = getFirestore(app);

  return (
    <AuthCtx.Provider value={{ firebaseConfig, auth }}>
      {children}
    </AuthCtx.Provider>
  );
};

export default AuthProvider;
