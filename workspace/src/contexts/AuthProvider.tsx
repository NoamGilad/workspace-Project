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
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
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
  isRefreshing: boolean;
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
  const [role, setRole] = useState<string>("");
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /////////////////////////////////////////////////////////////////////
  // Signup
  const usersCollectionRef = collection(storeDatabase, "users");
  const adminsCollectionRef = collection(storeDatabase, "admins");

  const registerWithEmailAndPassword = async (
    email: string,
    password: string,
    role: string,
    firstName: string,
    lastName: string
  ): Promise<boolean> => {
    if (!email || !password || !role || !firstName || !lastName) {
      window.alert("Please fill in all required fields.");
      return false;
    }

    if (role !== "Employee" && role !== "Employer") {
      window.alert("Role must be Employee or Employer.");
      return false;
    }

    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const curUser = userCredential.user;

      if (role === "Employee") {
        await setDoc(doc(usersCollectionRef, email), {
          role,
          firstName,
          lastName,
        });
      } else if (role === "Employer") {
        await setDoc(doc(adminsCollectionRef, email), {
          role,
          firstName,
          lastName,
        });
      }

      setLoggedIn(true);
      setIsSubmitting(false);

      return true;
    } catch (error: any) {
      const errorCode = (error as { code: string }).code;
      const errorMessage = (error as { message: string }).message;
      console.error("Firebase Error Code:", errorCode);
      console.error("Firebase Error Message:", errorMessage);
      window.alert(`Registration failed: ${errorMessage}`);
      setIsSubmitting(false);
      return false;
    }
  };

  /////////////////////////////////////////////////////////////////////
  // LOGIN

  const login = async () => {
    setIsSubmitting(true);

    return signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoggedIn(true);
        setIsSubmitting(false);
        return true;
      })
      .catch((error) => {
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          window.alert("Wrong User/password!");
        }
        console.error("Login error:", error.code);
        setIsSubmitting(false);
        return false;
      });
  };

  /////////////////////////////////////////////////////////////////////
  // onAuthStateChanged
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("auth.currentUser:", auth.currentUser);

      if (user && auth.currentUser !== null) {
        setIsSubmitting(true);
        const signInTime = user.metadata.lastSignInTime;
        //USE getDoc etc...
        // ...
        gettingExistingUserDocData(user?.email);
        gettingExistingAdminDocData(user?.email);
        setLoggedIn(true);
        setIsSubmitting(false);
      } else {
        console.error("No account logged in.");
        setLoggedIn(false);
      }
    });
  }, []);

  /////////////////////////////////////////////////////////////////////
  // Signout
  const signout = () => {
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
      console.error("No such USER document!");
    }
  };

  const gettingExistingAdminDocData = async (userData: any) => {
    const docRef = doc(storeDatabase, "admins", userData);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setFirstName(docSnap.data().firstName);
      setLastName(docSnap.data().lastName);
      setEmail(userData);
      setRole(docSnap.data().role);
    } else {
      console.error("No such ADMIN document!");
    }
  };

  /////////////////////////////////////////////////////////////////////
  // Refreshing page

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSubmitting) {
        const confirmationMessage =
          "There are pending changes. Are you sure you want to refresh?";

        if (window.confirm(confirmationMessage)) {
          setIsRefreshing(true);
        } else {
          e.preventDefault();
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      setIsRefreshing(false);
    };
  }, [isSubmitting]);

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
        isRefreshing,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};
