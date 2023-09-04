import { createContext, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, Auth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, Firestore } from "firebase/firestore";

type AuthContextType = {
  firebaseConfig: any;
  auth: Auth; // Auth type or null
  storeDataBase: Firestore;
  gettingExistingUser: Function;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  curUserRole: string | null;
  setCurUserRole: React.Dispatch<React.SetStateAction<string>>;
  handleLogout: Function;
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

  const storeDataBase = getFirestore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  // Initialize currentUser state to store the user's information
  const [curUserRole, setCurUserRole] = useState<string>("");

  // LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  //////////////////////////////////////////////////////////////////
  // DEFINING ROLES AND PERMISSIONS
  const storeDatabase = getFirestore();

  const gettingExistingUser = async (user: any) => {
    console.log(user);

    const docRefUser = doc(storeDatabase, "roles", user.uid);
    const docSnapUser = await getDoc(docRefUser);

    if (!docSnapUser.exists()) {
      console.log("No such documents");
    }

    return <p>{user.email}</p>;
  };

  return (
    <AuthCtx.Provider
      value={{
        firebaseConfig,
        auth,
        storeDataBase,
        gettingExistingUser,
        role,
        setRole,
        userRole,
        setUserRole,
        email,
        setEmail,
        password,
        setPassword,
        curUserRole,
        setCurUserRole,
        handleLogout,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};
