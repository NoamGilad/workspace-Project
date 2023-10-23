import { useContext, useState } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import Card from "../../UI/Card/Card";

import classes from "./UserInfo.module.css";

const UserInfo = () => {
  const context = useContext(AuthCtx);

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

  return (
    <Card className={classes.userInfoContainer}>
      <Card className={classes.profilePhotoContainer}>
        <img
          src={context.profilePictureURL || ""}
          alt="Profile"
          className={classes.profilePhoto}
        />
      </Card>
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
        <h4>User information</h4>
        <div>
          <label>Name:</label>
          <p>{context.nameToCapital(context.firstName, context.lastName)}</p>
        </div>
        <div>
          <label>Role:</label>
          <p>{context.role}</p>
        </div>
        <div>
          <label>Email:</label>
          <p>{context.email}</p>
        </div>
      </div>
    </Card>
  );
};

export default UserInfo;
