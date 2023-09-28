import { useContext, useState } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import Card from "../../UI/Card/Card";

import classes from "./UserInfo.module.css";

const UserInfo = () => {
  const context = useContext(AuthCtx);

  if (!context) return <h2>No context</h2>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      context.setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (context.selectedFile) {
      try {
        await context.uploadProfilePicture(context.selectedFile);
        console.log(context.auth?.currentUser?.photoURL);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  return (
    <Card className={classes.userInfoContainer}>
      <div className={classes.profileInfo}>
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
      </div>
      <div className={classes.profileInfo}>
        <h4>User information</h4>
        <p>
          Name: {context.nameToCapital(context.firstName, context.lastName)}
        </p>
        <p>Role: {context.role}</p>
        <p>Email: {context.email}</p>
      </div>
    </Card>
  );
};

export default UserInfo;
