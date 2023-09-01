import { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useUser = () => {
  const [user, setUser] = useState<any | null>(null);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    console.log(user);
    setUser(user);
  });

  return user;
};
