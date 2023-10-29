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
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  Firestore,
  setDoc,
  collection,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

type AuthContextType = {
  firebaseConfig: any;
  auth: Auth;
  storeDatabase: Firestore;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  company: {
    id: string | null;
    name: string | null;
  };
  setCompany: React.Dispatch<
    React.SetStateAction<{
      id: string | null;
      name: string | null;
    }>
  >;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  registerWithEmailAndPassword: Function;
  login: Function;
  actionCodeSettings: {
    url: string;
    handleCodeInApp: boolean;
    // dynamicLinkDomain: string;
  };
  signout: Function;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  gettingExistingUserDocData: Function;
  nameToCapital: Function;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  uploadProfilePicture: Function;
  profilePictureURL: string | null;
  setProfilePictureURL: React.Dispatch<React.SetStateAction<string | null>>;
  list: any;
  setList: React.Dispatch<React.SetStateAction<any>>;
  storingWorkingHours: Function;
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  from: string;
  setFrom: React.Dispatch<React.SetStateAction<string>>;
  to: string;
  setTo: React.Dispatch<React.SetStateAction<string>>;
  selectedUser: {
    firstName: string;
    lastName: string;
    role: string;
    id: string;
  } | null;
  setSelectedUser: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      role: string;
      id: string;
    } | null>
  >;
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
  const storage = getStorage(app);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [company, setCompany] = useState<{
    id: string | null;
    name: string | null;
  }>({
    id: "",
    name: "",
  });

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePictureURL, setProfilePictureURL] = useState<string | null>(
    null
  );
  const [list, setList] = useState<any[]>([]);

  const [date, setDate] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const [selectedUser, setSelectedUser] = useState<{
    firstName: string;
    lastName: string;
    role: string;
    id: string;
  } | null>(null);

  /////////////////////////////////////////////////////////////////////
  // Signup
  const usersCollectionRef = collection(storeDatabase, "users");
  const companiesCollectionRef = collection(storeDatabase, "companies");

  const registerWithEmailAndPassword = async (
    email: string,
    password: string,
    role: string,
    firstName: string,
    lastName: string,
    company: { id: string; name: string }
  ): Promise<boolean> => {
    setRole(role);

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
      const curUser = userCredential.user || null;

      if (auth.currentUser) {
        sendEmailVerification(auth.currentUser).then(() => {
          console.log("Email verification sent!");
        });
      }

      await setDoc(doc(usersCollectionRef, email), {
        role,
        firstName,
        lastName,
        company,
      });

      if (role === "Employer") {
        await setDoc(doc(companiesCollectionRef, company.name), {
          companyId: company.id,
          companyName: company.name,
        });
      }

      setLoggedIn(true);
      setIsSubmitting(false);

      return true;
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        window.alert("Email is already in use!");
      }

      console.error(error.code);
      setIsSubmitting(false);
      return false;
    }
  };

  /////////////////////////////////////////////////////////////////////
  // Signup with link

  const actionCodeSettings = {
    url: `http://localhost:3000/signup-user?company=${company.name}&companyId=${company.id}`,

    handleCodeInApp: true,

    // dynamicLinkDomain: "signup-user",
  };

  /////////////////////////////////////////////////////////////////////
  // LOGIN

  const login = async () => {
    setIsSubmitting(true);

    return await signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        const userRole = await gettingExistingUserDocData(email);

        setLoggedIn(true);
        setIsSubmitting(false);

        return userRole;
      })
      .catch((error) => {
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          window.alert("Wrong User/password!");
          setLoggedIn(false);
          return;
        }
        console.error("Login error:", error.code);
        setIsSubmitting(false);
        return false;
      });
  };

  /////////////////////////////////////////////////////////////////////
  // onAuthStateChanged
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      console.log("auth.currentUser:", auth.currentUser);

      if (user && auth.currentUser !== null) {
        setIsSubmitting(true);

        await gettingExistingUserDocData(user?.email);
        setLoggedIn(true);
        setIsSubmitting(false);
      } else {
        console.log("No account logged in.");
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
      setCompany(docSnap.data().company);
      setList(docSnap.data().workingHours || []);
      return docSnap.data().role;
    } else {
      console.error("No such document!");
    }
  };

  /////////////////////////////////////////////////////////////////////
  // Upload profile picture

  const uploadProfilePicture = async (file: File) => {
    const user = auth.currentUser;

    if (!user) {
      console.error("No user.");
      return;
    }

    const photoStorageRef = ref(storage, `profile-pictures/${user.uid}`);

    try {
      const snapshot = await uploadBytes(photoStorageRef, file);

      const downloadURL = await getDownloadURL(snapshot.ref);

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
        photoURL: downloadURL,
      });

      setProfilePictureURL(downloadURL);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (auth.currentUser?.photoURL) {
      setProfilePictureURL(auth.currentUser?.photoURL);
    }

    if (!auth.currentUser?.photoURL) {
      console.log("No photo url");
      return;
    }
  }, [auth.currentUser]);

  /////////////////////////////////////////////////////////////////////
  // Store working hours

  const storingWorkingHours = async (workingHours: any) => {
    const thisUserDocRef = doc(storeDatabase, "users", email);

    const user = auth.currentUser;

    if (!user) {
      console.error("No user.");
      return;
    }

    await updateDoc(thisUserDocRef, {
      workingHours: workingHours,
    });
  };

  /////////////////////////////////////////////////////////////////////
  // Store amount per hour

  const storeAmountPerHour = () => {};

  /////////////////////////////////////////////////////////////////////
  // Full name

  function nameToCapital(firstName: string, lastName: string): string {
    if (firstName.length === 0) {
      return "No name";
    }

    const firstNameFirstLetter = firstName[0].toUpperCase();
    const firstNameRestOfName = firstName.slice(1);

    const lastNameFirstLetter = lastName[0].toUpperCase();
    const lastNameRestOfName = lastName.slice(1);

    return (
      firstNameFirstLetter +
      firstNameRestOfName +
      ` ` +
      lastNameFirstLetter +
      lastNameRestOfName
    );
  }

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
        company,
        setCompany,
        isSubmitting,
        setIsSubmitting,
        registerWithEmailAndPassword,
        actionCodeSettings,
        login,
        signout,
        loggedIn,
        setLoggedIn,
        showModal,
        setShowModal,
        gettingExistingUserDocData,
        nameToCapital,
        selectedFile,
        setSelectedFile,
        uploadProfilePicture,
        profilePictureURL,
        setProfilePictureURL,
        list,
        setList,
        storingWorkingHours,
        date,
        setDate,
        from,
        setFrom,
        to,
        setTo,
        selectedUser,
        setSelectedUser,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};
