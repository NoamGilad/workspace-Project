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
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { Shift } from "../components/Shifts/ShiftsList/ShiftsList";
import { Dayjs } from "dayjs";

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
  amountPerHour: number;
  setAmountPerHour: React.Dispatch<React.SetStateAction<number>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  registerWithEmailAndPassword: Function;
  login: Function;
  actionCodeSettings: {
    url: string;
    handleCodeInApp: boolean;
  };
  signout: Function;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
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
  date: string | Dayjs;
  setDate: React.Dispatch<React.SetStateAction<string | Dayjs>>;
  from: string;
  setFrom: React.Dispatch<React.SetStateAction<string>>;
  to: string;
  setTo: React.Dispatch<React.SetStateAction<string>>;
  selectedUser: {
    firstName: string;
    lastName: string;
    role: string;
    id: string;
    amountPerHour: number;
  } | null;
  setSelectedUser: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      role: string;
      id: string;
      amountPerHour: number;
    } | null>
  >;
  handleDeleteUser: Function;
  showResetModal: boolean;
  setShowResetModal: React.Dispatch<React.SetStateAction<boolean>>;
  showAddUserModal: boolean;
  setShowAddUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  showEditUserModal: boolean;
  setShowEditUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  selectedYearChart: string;
  setSelectedYearChart: React.Dispatch<React.SetStateAction<string>>;
  normalHours: Shift[];
  setNormalHours: React.Dispatch<React.SetStateAction<Shift[]>>;
  extra125Hours: Shift[];
  setExtra125Hours: React.Dispatch<React.SetStateAction<Shift[]>>;
  extra150Hours: Shift[];
  setExtra150Hours: React.Dispatch<React.SetStateAction<Shift[]>>;
  curLanguage: string;
  setCurLanguage: React.Dispatch<React.SetStateAction<string>>;
  usersList: User[];
  setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
  errorMsg: string;
};

export type User = {
  firstName: string;
  lastName: string;
  role: string;
  id: string;
  amountPerHour: number;
  photoUrl: string;
  company: { name: string; id: string };
};

export const AuthCtx = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
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
  const [amountPerHour, setAmountPerHour] = useState<number>(30);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [showEditUserModal, setShowEditUserModal] = useState<boolean>(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePictureURL, setProfilePictureURL] = useState<string | null>(
    null
  );
  const [list, setList] = useState<Shift[]>([]);

  const [normalHours, setNormalHours] = useState<Shift[]>([]);
  const [extra125Hours, setExtra125Hours] = useState<Shift[]>([]);
  const [extra150Hours, setExtra150Hours] = useState<Shift[]>([]);

  const [date, setDate] = useState<string | Dayjs>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const [usersList, setUsersList] = useState<User[]>([]);

  const [selectedUser, setSelectedUser] = useState<{
    firstName: string;
    lastName: string;
    role: string;
    id: string;
    amountPerHour: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear().toString();
  const [selectedYearChart, setSelectedYearChart] =
    useState<string>(currentYear);

  const [curLanguage, setCurLanguage] = useState<string>("en");

  const [errorMsg, setErrorMsg] = useState<string>("");

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
      console.error("Please fill in all required fields.");
      return false;
    }

    if (role !== "Employee" && role !== "Employer") {
      console.error("Role must be Employee or Employer.");
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
        amountPerHour,
      });

      if (role === "Employer") {
        await setDoc(doc(companiesCollectionRef, company.name), {
          companyId: company.id,
          companyName: company.name,
        });
      }

      return true;
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        console.error("Email is already in use!");
      }

      setLoggedIn(true);
      setIsSubmitting(false);

      console.error(error.code);
      console.error(error.message);
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

  const login = async (email: string, password: string) => {
    setIsSubmitting(true);
    setErrorMsg("");

    return await signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        const userRole = await gettingExistingUserDocData(email);
        setRole(userRole);

        setLoggedIn(true);
        setIsSubmitting(false);

        return userRole;
      })
      .catch((error) => {
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          console.error("Wrong User/password!");
          setLoggedIn(false);
          setErrorMsg("Wrong User/password!");
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
      setLoading(true);
      console.log("auth.currentUser:", auth.currentUser);

      if (user && auth.currentUser !== null) {
        setIsSubmitting(true);

        await gettingExistingUserDocData(user?.email);
        setLoggedIn(true);
        setIsSubmitting(false);

        if (auth.currentUser?.photoURL) {
          setProfilePictureURL(auth.currentUser?.photoURL);
        }

        if (!auth.currentUser?.photoURL) {
          console.log("No photo url");
        }
      } else {
        console.log("No account logged in.");
        setLoggedIn(false);
      }

      setLoading(false);
    });
  }, []);

  /////////////////////////////////////////////////////////////////////
  // Signout
  const signout = () => {
    signOut(auth)
      .then(() => {
        setLoggedIn(false);
        // window.location.reload();
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
      setCompany(docSnap.data().company);
      setList(docSnap.data().workingHours || []);
      setAmountPerHour(docSnap.data().amountPerHour);
      setRole(docSnap.data().role);
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

      const thisUserDocRef = doc(storeDatabase, "users", email);

      await updateDoc(thisUserDocRef, {
        photoUrl: downloadURL,
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  };

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
  // Delete user

  const handleDeleteUser = async (user: User) => {
    if (user.id && auth.currentUser !== null) {
      try {
        await auth.currentUser.delete();
        await deleteDoc(doc(storeDatabase, "users", user.id));
        return console.log("Successfully deleted user");
      } catch (error) {
        console.error("Error deleting user:", error);
        return;
      }
    }

    return;
  };

  /////////////////////////////////////////////////////////////////////
  // Full name

  function nameToCapital(firstName: string, lastName: string): string {
    if (firstName.length === 0) {
      return "";
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
        amountPerHour,
        setAmountPerHour,
        isSubmitting,
        setIsSubmitting,
        registerWithEmailAndPassword,
        actionCodeSettings,
        login,
        signout,
        loggedIn,
        setLoggedIn,
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
        handleDeleteUser,
        showResetModal,
        setShowResetModal,
        showAddUserModal,
        setShowAddUserModal,
        showEditUserModal,
        setShowEditUserModal,
        loading,
        selectedYearChart,
        setSelectedYearChart,
        normalHours,
        setNormalHours,
        extra125Hours,
        setExtra125Hours,
        extra150Hours,
        setExtra150Hours,
        curLanguage,
        setCurLanguage,
        usersList,
        setUsersList,
        errorMsg,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};
