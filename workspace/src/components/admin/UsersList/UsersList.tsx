import { useContext, useEffect, useRef, useState } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import CircleLoader from "../../../UI/CircleLoader/CircleLoader";
import EditUser from "../EditUser/EditUser";
import ModifyIcon from "../../../assets/Modify.svg";
import RemoveUser from "../../../assets/RemoveUser.svg";
import styled from "styled-components";
import { DeleteButton } from "../../UserInfo/UserInfo";
import { DimensionsCtx } from "../../../contexts/DimensionsProvider";

const UsersListCard = styled.div`
  width: fit-content;
  margin: 5px;
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  text-align: center;
  padding: 20px;
  padding-bottom: 5px;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  h5 {
    margin: 5px;
    margin-top: -15px;
  }

  ul {
    display: block;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    text-align: center;
    margin: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 720px) {
    li {
      flex-direction: column;
    }

    div {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  @media (max-width: 440px) {
    li {
      width: 300px;
      justify-content: center;
    }
  }

  @media (max-width: 380px) {
    li {
      width: 265px;
    }
  }

  @media (max-width: 340px) {
    li {
      width: 230px;
    }
  }

  @media (max-width: 300px) {
    li {
      width: 210px;
    }
  }
`;

const InnerUserList = styled.div`
  width: fit-content;
  margin: 0 auto;
  margin-bottom: 15px;
  padding: 5px;
  background-color: lightsalmon;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);

  div {
    margin: 0px;
    padding: 3px;
  }

  img {
    margin-top: 3px;
    margin-right: 2px;
  }

  button {
    border-radius: 100%;
    margin: 0 auto;
    margin-right: 5px;
    margin-left: 5px;
  }

  p {
    font-weight: bold;
    margin-top: 2px;
    margin: 2px 7px 3px 7px;
  }
`;

const ProfilePhotoContainer = styled.div`
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 50%;
  border-style: none;
  background-color: rgb(255, 255, 255);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    margin: 0 auto;
  }

  @media (max-width: 440px) {
    width: fit-content;
    height: fit-content;

    img {
      width: 100px;
      height: 100px;
    }
  }

  @media (max-width: 380px) {
    img {
      width: 80px;
      height: 80px;
    }
  }

  @media (max-width: 300px) {
    img {
      width: 70px;
      height: 70px;
    }
  }
`;

const TopDiv = styled.div`
  width: 100%;
  justify-content: center;

  label {
    margin: 0 auto;
  }

  div {
    margin: 0 auto;
  }

  @media (max-width: 440px) {
    width: 80%;

    label {
      font-size: 13px;
    }
  }

  @media (max-width: 380px) {
    label {
      font-size: 11px;
    }
  }

  @media (max-width: 340px) {
    width: 100%;
  }

  @media (max-width: 300px) {
    width: 80%;

    label {
      font-size: 10px;
    }
  }
`;

const MidDiv = styled.div`
  width: 100%;
  justify-content: center;

  @media (max-width: 440px) {
    width: fit-content;

    label {
      font-size: 13px;
    }
  }

  @media (max-width: 380px) {
    label {
      font-size: 11px;
    }
  }

  @media (max-width: 300px) {
    label {
      font-size: 10px;
    }
  }
`;

const ButtonDiv = styled.div`
  width: 100%;
  justify-content: center;

  button {
    width: 13%;
    margin: 0 auto;
  }

  img {
    width: 100%;
  }

  @media (max-width: 440px) {
    width: 50%;
    button {
      width: 25%;
    }
  }

  @media (max-width: 340px) {
    width: 60%;
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
  const dimensions = useContext(DimensionsCtx);

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
                  <p>{context.nameToCapital(user.firstName, user.lastName)}</p>
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
              </li>
            </InnerUserList>
          ))}
      </ul>
    );
  }

  if (dimensions?.isMobile) {
    content = (
      <ul>
        {usersList
          .filter((user) => {
            return (
              user.role === "Employee" &&
              user.company.id === context?.company.id
            );
          })
          .map((user: User, index) => (
            <InnerUserList key={index}>
              <li>
                <TopDiv>
                  {user.photoUrl && (
                    <ProfilePhotoContainer>
                      <img src={user.photoUrl} />
                    </ProfilePhotoContainer>
                  )}
                  <label>
                    Amount per hour
                    <p>{user.amountPerHour}</p>
                  </label>
                </TopDiv>
                <MidDiv>
                  <label>
                    Name
                    <p>
                      {user.firstName} {user.lastName}
                    </p>
                  </label>
                  <label>
                    Email
                    <p>{user.id}</p>
                  </label>
                </MidDiv>
                <ButtonDiv>
                  <button onClick={() => handleEditSelectUser(user)}>
                    <img src={ModifyIcon} />
                  </button>
                </ButtonDiv>
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
    console.log("Selected user:", user);
    context?.setSelectedUser(user);
    context?.setShowEditUserModal(true);
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

  return (
    <>
      <UsersListCard>
        <h5>Users List</h5>
        {content}
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
      </UsersListCard>
    </>
  );
};

export default UsersList;
