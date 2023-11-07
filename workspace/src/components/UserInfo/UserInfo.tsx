import { useContext } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const UserInfoContainer = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: peachpuff;
  text-align: center;
  padding: 20px;
  border: 3;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
  margin: 0 auto;

  & p {
    font-weight: bold;
    margin-top: 2px;
    margin: 2px 7px 3px 7px;
  }

  @media (max-width: 920px) {
    display: flex;
    flex-direction: row;

    & div {
      flex-direction: row;
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
  padding: 0px;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;

  & label {
    background-color: rgb(122, 122, 122);
    color: #fff;
    border-radius: 15px;
    padding: 2px 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
    font-weight: bold;
  }

  & input {
    display: none;
  }

  @media (max-width: 920px) {
    & button {
      margin: 5px;
    }
    & label {
      margin: 5px;
    }
    & input {
      margin: 5px;
    }
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;

  & div {
    border-radius: 12px;
    margin: 5px;
    background-color: rgb(255, 255, 255);
  }

  @media (max-width: 920px) {
    flex-direction: row;

    & div {
      margin-right: 15px;
    }
  }
`;

const DeleteButton = styled.button`
  background-color: red;

  &:hover {
    background-color: lightcoral;
  }
`;

const UserInfo = () => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();

  if (!context) return <p>No context</p>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      context.setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (context.selectedFile) {
      try {
        await context.uploadProfilePicture(context.selectedFile);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  const deleteUserHandler = () => {
    if (context.auth.currentUser?.email) {
      const deleteMethod = context.auth.currentUser.delete();
      context.handleDeleteUser(
        { id: context.auth.currentUser.email },
        deleteMethod
      );
      navigate("/");
    }
  };

  let content = (
    <UserInfoContainer>
      <ProfilePhotoContainer>
        <img src={context.profilePictureURL || ""} alt="Profile" />
      </ProfilePhotoContainer>
      <InputContainer>
        <label>
          Select File
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        <button onClick={handleUpload}>Upload Photo</button>
      </InputContainer>
      <ProfileInfo>
        <div>
          <label>Name:</label>
          <p>{context.nameToCapital(context.firstName, context.lastName)}</p>
        </div>
        <div>
          <label>Email:</label>
          <p>{context.email}</p>
        </div>
      </ProfileInfo>
      <DeleteButton
        onClick={() => {
          deleteUserHandler();
        }}
      >
        Delete user
      </DeleteButton>
    </UserInfoContainer>
  );

  if (window.innerWidth < 920) {
    content = (
      <UserInfoContainer>
        <ProfilePhotoContainer>
          <img src={context.profilePictureURL || ""} alt="Profile" />
        </ProfilePhotoContainer>
        <div>
          <ProfileInfo>
            <div>
              <label>Name:</label>
              <p>
                {context.nameToCapital(context.firstName, context.lastName)}
              </p>
            </div>
            <div>
              <label>Email:</label>
              <p>{context.email}</p>
            </div>
          </ProfileInfo>
          <InputContainer>
            <label>
              Select File
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
            <button onClick={handleUpload}>Upload Photo</button>
            <DeleteButton
              onClick={() => {
                deleteUserHandler();
              }}
            >
              Delete user
            </DeleteButton>
          </InputContainer>
        </div>
      </UserInfoContainer>
    );
  }

  return <>{content}</>;
};

export default UserInfo;
