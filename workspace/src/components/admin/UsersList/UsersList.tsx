import { useContext, useEffect, useRef, useState } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import CircleLoader from "../../../UI/CircleLoader/CircleLoader";
import EditUser from "../EditUser/EditUser";
import ModifyIcon from "../../../assets/Modify.svg";
import RemoveUser from "../../../assets/RemoveUser.svg";
import styled from "styled-components";
import { DeleteButton } from "../../UserInfo/UserInfo";

const UsersListCard = styled.div`
  width: fit-content;
  margin: 5px;
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  text-align: center;
  padding: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  & h5 {
    margin: 5px;
    margin-top: -15px;
  }

  & ul {
    display: block;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  & li {
    text-align: center;
    margin: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const InnerUserList = styled.div`
  width: fit-content;
  margin: 5px;
  margin-bottom: 15px;
  padding: 5px;
  background-color: lightsalmon;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  & div {
    margin: 0px;
    padding: 3px;
  }

  & img {
    margin-top: 3px;
    margin-right: 2px;
  }

  & button {
    border-radius: 100%;
    margin-right: 5px;
  }

  & p {
    font-weight: bold;
    margin-top: 2px;
    margin: 2px 7px 3px 7px;
  }

  @media (max-width: 500px) {
    & p {
      font-size: 12px;
    }
  }

  @media (max-width: 500px) {
    & p {
      font-size: 10px;
    }
  }
`;

const ProfilePhotoContainer = styled.div`
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 50%;
  border-style: none;
  background-color: rgb(255, 255, 255);

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    margin: 0 auto;
  }
`;

type User = {
  firstName: string;
  lastName: string;
  role: string;
  id: string;
  amountPerHour: number;
  photoUrl: string;
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
            return (
              user.role === "Employee" && user.company.id === context.company.id
            );
          })
          .map((user: User, index) => (
            <InnerUserList key={index}>
              <li>
                {user.photoUrl && (
                  <ProfilePhotoContainer>
                    <img src={user.photoUrl} />
                  </ProfilePhotoContainer>
                )}
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
                <div>
                  <label>Amount per hour</label>
                  <p>{user.amountPerHour}</p>
                </div>
                <button onClick={() => handleEditSelectUser(user)}>
                  <img src={ModifyIcon} />
                </button>
                <DeleteButton onClick={(e) => deleteUserHandler(user, e)}>
                  <img src={RemoveUser} />
                </DeleteButton>
              </li>
            </InnerUserList>
          ))}
      </ul>
    );
  }

  if (context?.isSubmitting === true) {
    content = <CircleLoader />;
  }

  const handleEditSelectUser = (user: User) => {
    console.log("Selected user:", user.id);
    context?.setSelectedUser(user);
    context?.setShowEditUserModal(true);

    console.log(user);
  };

  const updateProfileHandler = async (
    e: React.FormEvent,
    firstName: string,
    lastName: string,
    email: string,
    amountPerHour: number
  ) => {
    e.preventDefault();

    if (!context) return <p>No context</p>;

    context?.setSelectedUser({
      firstName: firstName,
      lastName: lastName,
      role: "Employee",
      id: email,
      amountPerHour: amountPerHour,
    });

    const userRef = doc(context.storeDatabase, "users", email);

    await updateDoc(userRef, {
      firstName: firstName,
      lastName: lastName,
      amountPerHour: amountPerHour,
    });
  };

  const deleteUserHandler = (user: User, e: any) => {
    // const deleteMethod = deleteUser(user);
    // context?.handleDeleteUser(user, deleteMethod);
    // navigate("/");
  };

  return (
    <>
      <UsersListCard>
        <h5>Users List</h5>
        {content}
      </UsersListCard>
      {context?.selectedUser &&
        context?.showEditUserModal &&
        context?.isSubmitting === false && (
          <EditUser
            firstName={context.selectedUser.firstName}
            lastName={context.selectedUser.lastName}
            id={context.selectedUser.id}
            updateProfileHandler={updateProfileHandler}
          />
        )}
    </>
  );
};

export default UsersList;
