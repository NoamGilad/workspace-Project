const admin = require("firebase-admin");
const serviceAccount = require("./workspace-f24ed-firebase-adminsdk-yqj3x-c2b7307598.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com",
});

admin
  .auth()
  .listUsers()
  .then((listUsersResult) => {
    listUsersResult.users.forEach((userRecord) => {
      // Delete each user
      admin
        .auth()
        .deleteUser(userRecord.uid)
        .then(() => {
          console.log(`Successfully deleted user: ${userRecord.uid}`);
        })
        .catch((error) => {
          console.error(`Error deleting user: ${userRecord.uid}`, error);
        });
    });
  })
  .catch((error) => {
    console.error("Error listing users:", error);
  });

// to initiate this code and delete all the authenticated users, write in the terminal: 'node Admin SDK'
// make sure to cd to this file's folder
