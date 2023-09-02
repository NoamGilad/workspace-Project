import { createContext, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  Auth,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
  // collectionRefs: Function;
  approvedRoles: string[];
  // onSubmitionSignupHandler: Function;
  gettingExistingUser: Function;
  // currentUser: any | null;
  onSubmitionSignupHandler: Function;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string | null;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  curUserRole: string | null;
  onSubmitLoginHandler: Function;
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
  const auth: Auth = getAuth(app);

  const storeDataBase = getFirestore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  // Initialize currentUser state to store the user's information
  // const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [curUserRole, setCurUserRole] = useState<string>("");

  const onSubmitionSignupHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Register the user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Set user role
      setUserRole(role);

      const user = userCredential.user;
      const userDocRef = doc(storeDataBase, "roles", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        role: role,
      });

      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const currentUserRole = userData.role;

        setCurUserRole(currentUserRole);
      }
    } catch (error: any) {
      const errorMessage = error.message;
      window.alert(errorMessage);
    }
  };
  const onSubmitLoginHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ).then((userApproval) => {
        const user = userApproval.user;
        console.log(user);

        if (userRole === "employee") {
          setUserRole(userRole);
        }
      });
    } catch (error: any) {
      const errorMessage = error.message;
      window.alert(errorMessage);
    }
    // await setPersistence(auth)
    //   .then(() => {
    //     // Persistence successfully enabled
    //   })
    //   .catch((error) => {
    //     console.error("Error enabling persistence:", error);
    //   });
  };
  // const onSubmitionSignupHandler = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // try {
  //   //   // Register the user
  //   //   const userCredential = await createUserWithEmailAndPassword(
  //   //     auth,
  //   //     email,
  //   //     password
  //   //   );
  //   //   const user = userCredential.user;

  //   //   setUserRole(role);

  //   //   setCurrentUser({
  //   //     uid: user.uid,
  //   //     email: user.email,
  //   //     role: role,
  //   //   });
  //   // } catch (error: any) {
  //   //   const errorMessage = error.message;
  //   //   window.alert(errorMessage);
  //   // }
  // };

  //////////////////////////////////////////////////////////////////
  // DEFINING ROLES AND PERMISSIONS
  const storeDatabase = getFirestore();

  // const rolesRef = collection(storeDatabase, "roles");

  // // Add "admin" document
  // const collectionRefs = async () => {
  //   await setDoc(doc(rolesRef, "employer"), {
  //     role: "admin",
  //     permissions: ["create", "edit", "delete"],
  //   });

  //   // Add "user" document
  //   await setDoc(doc(rolesRef, "employee"), {
  //     role: "user",
  //     permissions: ["create", "edit"],
  //   });
  // };

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

        approvedRoles,
        // collectionRefs,
        // onSubmitionSignupHandler,
        gettingExistingUser,
        // currentUser,
        onSubmitionSignupHandler,
        role,
        setRole,
        userRole,
        setUserRole,
        email,
        setEmail,
        password,
        setPassword,
        curUserRole,
        onSubmitLoginHandler,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};

export default AuthProvider;
