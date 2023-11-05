import { useContext } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";

import classes from "./UserInfo.module.css";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className={classes.userInfoContainer}>
      <div className={classes.profilePhotoContainer}>
        <img
          src={context.profilePictureURL || ""}
          alt="Profile"
          className={classes.profilePhoto}
        />
      </div>
      <div className={classes.inputContainer}>
        <label className={classes.fileLabel}>
          Select File
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={classes.fileInput}
          />
        </label>
        <button onClick={handleUpload} className={classes.uploadButton}>
          Upload Photo
        </button>
      </div>
      <div className={classes.profileInfo}>
        <div>
          <label>Name:</label>
          <p>{context.nameToCapital(context.firstName, context.lastName)}</p>
        </div>
        <div>
          <label>Email:</label>
          <p>{context.email}</p>
        </div>
      </div>
      <button
        className={classes.deleteButton}
        onClick={() => {
          deleteUserHandler();
        }}
      >
        Delete user
      </button>
    </div>
  );
};

export default UserInfo;
