import { createContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  Firestore,
  setDoc,
  collection,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  firebaseConfig: any;
  auth: Auth | null;
  storeDatabase: Firestore;
  // gettingExistingUser: Function;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string | null;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  firstName: string | null;
  setFirstName: React.Dispatch<React.SetStateAction<string | null>>;
  lastName: string | null;
  setLastName: React.Dispatch<React.SetStateAction<string | null>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  // user: {} | null;
  // setUser: React.Dispatch<React.SetStateAction<{} | null>>;
  curUser: any | null; // any for now...
  registerWithEmailAndPassword: Function;
  login: Function;
  signout: Function;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
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

  const storeDatabase = getFirestore(app);

  const curUser = auth.currentUser;

  const [email, setEmail] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [role, setRole] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /////////////////////////////////////////////////////////////////////
  // Signup
  const usersCollectionRef = collection(storeDatabase, "users");

  const registerWithEmailAndPassword = (
    email: string,
    password: string,
    role: string,
    firstName: string,
    lastName: string
  ) => {
    if (!email || !password || !role || !firstName || !lastName) {
      window.alert("something not valid");
      return;
    }

    if (role !== "employee" && role !== "employer") {
      window.alert("Role must be employee OR employer");
      return;
    }

    setIsSubmitting(true);

    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const curUser = userCredential.user;
          console.log(curUser);
          setLoggedIn(true);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
          window.alert(errorMessage);
          setDoc(doc(usersCollectionRef, email), {
            role,
            firstName,
            lastName,
          });
        });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /////////////////////////////////////////////////////////////////////
  // LOGIN
  // const [user, setUser] = useState<any | null>(null);

  const login = () => {
    setIsSubmitting(true);

    try {
      // setPersistence(auth, browserLocalPersistence);

      signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const curUser = userCredential.user;
          setLoggedIn(true);
        }
      );
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /////////////////////////////////////////////////////////////////////
  // onAuthStateChanged
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("auth.currentUser:", auth.currentUser);

      if (user) {
        const uid = user.uid;
        //USE getDoc etc...
        // ...
        gettingExistingUserDocData(user?.email);
      } else {
        console.error("No account logged in.");
      }
    });
  }, []);

  /////////////////////////////////////////////////////////////////////
  // Signout
  const signout = (e: React.FormEvent) => {
    signOut(auth)
      .then(() => {
        setLoggedIn(false);
        window.location.reload();
      })
      .catch((error) => {
        // An error happened.
      });
  };

  /////////////////////////////////////////////////////////////////////
  // Getting doc data from Firestore

  const gettingExistingUserDocData = async (userData: any) => {
    const docRef = doc(storeDatabase, "users", userData);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setFirstName(docSnap.data().firstName);
      setLastName(docSnap.data().lastName);
      setEmail(userData);
      setRole(docSnap.data().role);
    } else {
      console.error("No such document!");
      console.log("No such document!");
    }
  };

  return (
    <AuthCtx.Provider
      value={{
        firebaseConfig,
        auth,
        storeDatabase,
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
        // user,
        // setUser,
        curUser,
        registerWithEmailAndPassword,
        login,
        signout,
        loggedIn,
        setLoggedIn,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};
