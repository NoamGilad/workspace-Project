import { useContext, useEffect, useState } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import { collection, getDocs } from "firebase/firestore";
import Card from "../../../UI/Card/Card";
import classes from "./UsersList.module.css";

const UsersList = () => {
  const context = useContext(AuthCtx);

  const [usersList, setUsersList] = useState<any[]>([]);

  useEffect(() => {
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
      };
      getUsers();
    }
  }, [context]);

  return (
    <Card className={classes.UsersListCard}>
      <h5>Users List</h5>
      {!context ? (
        <p>No context</p>
      ) : (
        <ul>
          {usersList.map((user, index) => (
            <Card className={classes.UsersListCard}>
              <li key={index}>
                <p>
                  Name: {user.firstName} {user.lastName}
                </p>
                <p>Email: {user.id}</p>
              </li>
            </Card>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default UsersList;
