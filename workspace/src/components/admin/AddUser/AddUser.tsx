import { sendSignInLinkToEmail } from "firebase/auth";
import { useContext, useState } from "react";
import { AuthCtx } from "../../../contexts/AuthProvider";
import Modal from "../../../UI/Modal/Modal";
import Card from "../../../UI/Card/Card";
import classes from "./AddUser.module.css";

const AddUser = () => {
  const context = useContext(AuthCtx);

  const [toEmail, setToEmail] = useState<string>("");

  if (!context) return <p>No context</p>;

  const handleAddEmployee = (email: string, e: React.FormEvent) => {
    e.preventDefault();

    sendSignInLinkToEmail(context.auth, email, context.actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);
        console.log(email);
        return <p>Sent.</p>;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  return (
    <Modal onClose={() => context.setShowModal(false)}>
      <Card className={classes.addUser}>
        <form>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            onChange={(e) => {
              setToEmail(e.target.value);
            }}
          />
          <button
            onClick={(e) => {
              handleAddEmployee(toEmail, e);
            }}
          >
            Send invitation
          </button>
        </form>
      </Card>
    </Modal>
  );
};

export default AddUser;
