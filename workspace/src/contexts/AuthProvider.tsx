import { createContext, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, Auth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDoc,
} from "firebase/firestore";

type AuthContextType = {
  firebaseConfig: any;
  auth: Auth | null; // Auth type or null
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
  collectionRefs: Function;
  approvedRoles: string[];
  onSubmitionSignupHandler: Function;
  gettingExistingUser: Function;
  currentUser: any | null;
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

  // Initialize currentUser state to store the user's information
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const onSubmitionSignupHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Register the user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      setUserRole(role);

      setCurrentUser({
        uid: user.uid,
        email: user.email,
        role: role,
      });
    } catch (error: any) {
      const errorMessage = error.message;
      window.alert(errorMessage);
    }
  };

  //////////////////////////////////////////////////////////////////
  // DEFINING ROLES AND PERMISSIONS
  const storeDatabase = getFirestore();

  const rolesRef = collection(storeDatabase, "roles");

  // Add "admin" document
  const collectionRefs = async () => {
    await setDoc(doc(rolesRef, "employer"), {
      role: "admin",
      permissions: ["create", "edit", "delete"],
    });

    // Add "user" document
    await setDoc(doc(rolesRef, "employee"), {
      role: "user",
      permissions: ["create", "edit"],
    });
  };

  const approvedRoles = ["employee", "employer"];

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
        userRole,
        setUserRole,
        approvedRoles,
        collectionRefs,
        onSubmitionSignupHandler,
        gettingExistingUser,
        currentUser,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};

export default AuthProvider;
