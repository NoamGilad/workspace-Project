import { createContext, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

type AuthContextType = {
  firebaseConfig: any;
  auth: Auth | null; // Auth type or null
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AuthCtx = createContext<AuthContextType | null>(null);

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

  // Initialize userRole state
  const [userRole, setUserRole] = useState<string | null>(null);

  //////////////////////////////////////////////////////////////////
  // DEFINING ROLES AND PERMISSIONS
  const storeDataBase = getFirestore();

  const rolesCollectionRef = doc(storeDataBase, "roles", "employer");

  // Add "admin" document
  const employerPermissions = ["create", "edit", "delete"];
  setDoc(
    rolesCollectionRef,
    { employer: { permissions: employerPermissions } },
    { merge: true }
  );

  // Add "user" document
  const employeePermissions = ["create", "edit"];
  setDoc(
    rolesCollectionRef,
    { employee: { permissions: employeePermissions } },
    { merge: true }
  );

  return (
    <AuthCtx.Provider value={{ firebaseConfig, auth, userRole, setUserRole }}>
      {children}
    </AuthCtx.Provider>
  );
};

export default AuthProvider;
