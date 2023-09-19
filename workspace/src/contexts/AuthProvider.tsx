import { createContext, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, Auth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, Firestore } from "firebase/firestore";

type AuthContextType = {
  firebaseConfig: any;
  auth: Auth | any;
  storeDataBase: Firestore;
  // gettingExistingUser: Function;
  email: string | any;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string | any;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  role: string | any;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  firstName: string | any;
  setFirstName: React.Dispatch<React.SetStateAction<string | null>>;
  lastName: string | any;
  setLastName: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AuthCtx = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
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
  const auth: Auth = getAuth(app);

  const storeDataBase = getFirestore(app);

  const [email, setEmail] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [role, setRole] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  //////////////////////////////////////////////////////////////////
  // DEFINING ROLES AND PERMISSIONS
  const storeDatabase = getFirestore();

  // const gettingExistingUser = async (user: any) => {
  //   console.log(user);

  //   const docRefUser = doc(storeDatabase, "roles", user.uid);
  //   const docSnapUser = await getDoc(docRefUser);

  //   if (!docSnapUser.exists()) {
  //     console.log("No such documents");
  //   }

  //   return <p>{user.email}</p>;
  // };

  return (
    <AuthCtx.Provider
      value={{
        firebaseConfig,
        auth,
        storeDataBase,
        // gettingExistingUser,
        email,
        setEmail,
        password,
        setPassword,
        role,
        setRole,
        firstName,
        setFirstName,
        lastName,
        setLastName,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};
