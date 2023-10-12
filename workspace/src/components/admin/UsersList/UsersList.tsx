import { useContext, useEffect } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import Card from "../../../UI/Card/Card";
import classes from "./UsersList.module.css";

const UsersList = () => {
  const context = useContext(AuthCtx);

  if (!context) {
    return <p>No context</p>;
  }

  const gettingUsersList = async () => {
    const docRef = doc(context.storeDatabase, "users");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const arr = [docSnap.data];
      console.log(arr);
      return;
    } else {
      console.error("No such document! No users!");
      return;
    }
  };

  return (
    <Card className={classes.UsersListCard}>
      <h5>Users List</h5>
      <p>{123}</p>
    </Card>
  );
};

export default UsersList;
