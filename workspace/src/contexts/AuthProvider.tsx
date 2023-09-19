import { createContext, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  Auth,
  signOut,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc, Firestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  login: Function;
  user: any | null;
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

  /////////////////////////////////////////////////////////////////////
  // LOGIN
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);

  const login = async () => {
    setIsSubmitting(true);

    try {
      await setPersistence(auth, browserLocalPersistence);

      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          setUser(user);
          return user;
        }
      );
    } catch (error) {
      console.error("Login error:", error);
      window.alert(`Login error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        isSubmitting,
        setIsSubmitting,
        login,
        user,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};
