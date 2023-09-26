import { createContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithRedirect,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  Firestore,
  setDoc,
  collection,
} from "firebase/firestore";

type AuthContextType = {
  firebaseConfig: any;
  auth: Auth | null;
  storeDatabase: Firestore;
  // gettingExistingUser: Function;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null | undefined>>;
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
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  gettingExistingUserDocData: Function;
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

  const [showModal, setShowModal] = useState(false);

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

      if (auth.currentUser) {
        sendEmailVerification(auth.currentUser).then(() => {
          console.log("Email verification sent!");
        });
      }

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

      await updateUserProfile();

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
  // Update profile

  const updateUserProfile = async () => {
    if (auth.currentUser === null || !auth.currentUser) {
      console.error("No currentUser");
      return;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`,
        photoURL: "https://example.com/jane-q-user/profile.jpg",
      });
      // Profile updated successfully
      // ...
    } catch (error) {
      // An error occurred while updating the profile
      // Handle the error here
      // ...
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
        curUser,
        registerWithEmailAndPassword,
        login,
        signout,
        loggedIn,
        setLoggedIn,
        isRefreshing,
        showModal,
        setShowModal,
        gettingExistingUserDocData,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};
