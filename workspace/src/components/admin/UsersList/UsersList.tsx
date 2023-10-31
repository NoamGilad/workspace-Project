import { useContext, useEffect, useState } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import Card from "../../../UI/Card/Card";
import classes from "./UsersList.module.css";
import CircleLoader from "../../../UI/CircleLoader/CircleLoader";
import EditUser from "../EditUser/EditUser";
import ModifyIcon from "../../../assets/Modify.svg";
import { useNavigate } from "react-router-dom";

type User = {
  firstName: string;
  lastName: string;
  role: string;
  id: string;
};

const UsersList = () => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();

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

  let content;

  if (!context) {
    content = <p>No context</p>;
  }

  if (context) {
    content = (
      <ul>
        {usersList
          .filter((user) => {
            return user.role === "Employee";
          })
          .map((user: User, index) => (
            <Card className={classes.InnerUserList}>
              <li key={index}>
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
                <button onClick={() => handleSelectUser(user)}>
                  <img src={ModifyIcon} />
                </button>
              </li>
            </Card>
          ))}
      </ul>
    );
  }

  if (context?.isSubmitting === true) {
    content = <CircleLoader />;
  }

  const handleSelectUser = (user: User) => {
    console.log("Selected user:", user.id);
    context?.setSelectedUser(user);
    context?.setShowModal(true);
  };

  const updateProfileHandler = async (
    e: React.FormEvent,
    firstName: string,
    lastName: string,
    email: string
  ) => {
    e.preventDefault();

    if (!context) return <p>No context</p>;

    context?.setSelectedUser({
      firstName: firstName,
      lastName: lastName,
      role: "Employee",
      id: email,
    });

    const userRef = doc(context.storeDatabase, "users", email);

    await updateDoc(userRef, {
      firstName: firstName,
      lastName: lastName,
    });
  };

  const deleteUserHandler = () => {
    context?.handleDeleteUser(
      context.auth.currentUser?.email?.toString(),
      context.auth.currentUser?.delete()
    );
    navigate("/");
  };

  return (
    <>
      <Card className={classes.usersListCard}>
        <h5>Users List</h5>
        {content}
      </Card>
      {context?.selectedUser &&
        context?.showModal &&
        context?.isSubmitting === false && (
          <EditUser
            firstName={context.selectedUser.firstName}
            lastName={context.selectedUser.lastName}
            id={context.selectedUser.id}
            updateProfileHandler={updateProfileHandler}
          />
        )}
      <button>Delete</button>
    </>
  );
};

export default UsersList;
