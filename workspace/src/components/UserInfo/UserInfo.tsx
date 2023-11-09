import { useContext } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DimensionsCtx } from "../../contexts/DimensionsProvider";

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

  p {
    font-weight: bold;
    margin-top: 2px;
    margin: 2px 7px 3px 7px;
  }

  @media (max-width: 940px) {
    display: flex;
    flex-direction: row;

    div {
      flex-direction: row;
    }

    @media (max-width: 570px) {
      display: flex;
      flex-direction: column;
      padding: 10px 0px 5px 0px;

      div {
        margin: auto;
      }

      label {
        font-size: 12px;
      }
    }

    @media (max-width: 360px) {
      div {
        margin: 0 auto;
      }

      label {
        font-size: 10px;
      }

      p {
        font-size: 10px;
      }
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

  @media (max-width: 940px) {
    & button {
      margin: 5px;
    }
    & label {
      margin: 5px;
      padding: 2px 15px;
    }
    & input {
      margin: 5px;
    }

    @media (max-width: 570px) {
      justify-content: center;

      p {
        font-size: 10px;
      }

      button {
        width: fit-content;
        font-size: 10px;
      }

      label {
        align-self: center;
        font-size: 10px;
        padding: 5px 10px;
      }
    }
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  & div {
    border-radius: 12px;
    margin: 5px;
    background-color: rgb(255, 255, 255);
  }

  @media (max-width: 940px) {
    flex-direction: row;
    margin-right: 0 auto;
  }
`;

const DeleteButton = styled.button`
  background-color: red;

  &:hover {
    background-color: lightcoral;
  }
`;

const InfoAndActions = styled.div`
  padding: 10px;
`;

const UserInfo = () => {
  const context = useContext(AuthCtx);
  const dimensions = useContext(DimensionsCtx);
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

  return (
    <UserInfoContainer>
      <div>
        <ProfilePhotoContainer>
          <img src={context.profilePictureURL || ""} alt="Profile" />
        </ProfilePhotoContainer>
      </div>
      <InfoAndActions>
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
        <InputContainer>
          <label>Select File</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload Photo</button>
          <DeleteButton
            onClick={() => {
              deleteUserHandler();
            }}
          >
            Delete user
          </DeleteButton>
        </InputContainer>
      </InfoAndActions>
    </UserInfoContainer>
  );
};

export default UserInfo;
