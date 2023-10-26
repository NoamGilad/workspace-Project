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
        if (email.length < 0) {
          console.error("No email");
          return;
        }

        window.localStorage.setItem("emailForSignIn", email);
        console.log(email);
        context.setShowModal(false);
        return;
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
            required
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
