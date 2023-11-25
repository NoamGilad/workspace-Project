import { useContext, useEffect } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import { useNavigate, useNavigation } from "react-router-dom";
import styled from "styled-components";
import { DimensionsCtx } from "../../contexts/DimensionsProvider";

const UserInfoContainer = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #263238;
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

  @media (max-width: 1050px) {
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

  @media (max-width: 320px) {
    padding: 5px 0px 0px 0px;
  }
`;

const ProfilePhotoContainer = styled.div`
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid #e3f2fd;
  padding: 0px;

  img {
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

  label {
    background-color: #22759f;
    color: #e3f2fd !important;
    border-radius: 20px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
    font-weight: bold;
  }
  label:hover {
    background-color: #0056b3;
  }

  input {
    display: none;
  }

  @media (max-width: 1050px) {
    button {
      margin: 5px;
      width: fit-content;
    }

    label {
      margin: 5px;
      padding: 2px 15px;
      width: fit-content;
    }

    input {
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

    @media (max-width: 320px) {
      button {
        margin: 2px;
      }

      label {
        margin: 2px;
      }
    }
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  div {
    border-radius: 12px;
    margin: 5px;
    background-color: #e3f2fd;
  }

  @media (max-width: 1050px) {
    flex-direction: row;
    margin-right: 0 auto;
  }
`;

export const DeleteButton = styled.button`
  background-color: red;
  width: 100%;

  &:hover {
    background-color: #854242;
  }

  img {
    width: 100%;
  }
`;

const InfoAndActions = styled.div`
  padding: 10px;

  @media (max-width: 320px) {
    padding: 5px;
  }
`;

const UserInfo = () => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();

  if (!context) return <p>No context</p>;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      context.setSelectedFile(selectedFile);

      try {
        await context.uploadProfilePicture(selectedFile);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  const deleteUserHandler = () => {
    const check = window.confirm("Are you sure you want to delete the user?");

    if (context.auth.currentUser?.email && check) {
      context.handleDeleteUser({ id: context.auth.currentUser.email });
      navigate("/");
    } else {
      console.log("Deletion cancelled.");
      return;
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
          <label>
            Select photo
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
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
