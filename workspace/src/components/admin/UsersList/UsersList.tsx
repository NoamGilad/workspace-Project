import { useContext, useEffect, useState } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import { collection, getDocs } from "firebase/firestore";
import Card from "../../../UI/Card/Card";
import classes from "./UsersList.module.css";
import CircleLoader from "../../../UI/CircleLoader/CircleLoader";

type User = {
  firstName: string;
  lastName: string;
  role: string;
  id: string;
};

const UsersList = () => {
  const context = useContext(AuthCtx);

  const [usersList, setUsersList] = useState<any[]>([]);

  useEffect(() => {
    // context?.setIsSubmitting(true);
    if (!context) {
      return;
    } else {
      const getUsers = async () => {
        const querySnapshot = await getDocs(
          collection(context.storeDatabase, "users")
        );
        const users: any[] = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          const userData = {
            id: doc.id,
            ...doc.data(),
          };
          users.push(userData);
        });

        setUsersList(users);
        // context.setIsSubmitting(false);
      };
      getUsers();
    }
  }, [context]);

  let selectedContent = "";

  const handelSelectUser = (index: number, user: User) => {
    console.log("Selected user at index:", index, user.id);

    return (
      <Card className={classes.usersListCard}>
        <label>First Name</label>
        <div>{user.firstName}</div>
        <label>Last Name</label>
        <div>{user.lastName}</div>
        <label>Email</label>
        <div>{user.id}</div>
      </Card>
    );
  };

  let content;

  if (!context) {
    content = <p>No context</p>;
  }

  if (context) {
    content = (
      <ul>
        {usersList.map((user, index) => (
          <Card className={classes.InnerUserList}>
            <li key={index} onClick={() => handelSelectUser(index, user)}>
              <div>
                <label>Name</label>
                <p>
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <label>Email</label>
                <p>{user.id}</p>
              </div>
            </li>
          </Card>
        ))}
      </ul>
    );
  }

  if (context?.isSubmitting === true) {
    content = <CircleLoader />;
  }

  return (
    <div>
      <Card className={classes.usersListCard}>
        <h5>Users List</h5>
        {content}
      </Card>
      <Card className={classes.usersListCard}>
        <h5>Selected User</h5>
        {selectedContent}
      </Card>
    </div>
  );
};

export default UsersList;
