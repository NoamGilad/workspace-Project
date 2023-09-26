const admin = require("firebase-admin");
const serviceAccount = require("./workspace-f24ed-firebase-adminsdk-yqj3x-7a150e4a5f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://workspace-f24ed.firebaseio.com",
});

// List all users
admin
  .auth()
  .listUsers()
  .then((listUsersResult) => {
    const promises = listUsersResult.users.map((userRecord) => {
      // Delete each user and return a promise
      return admin
        .auth()
        .deleteUser(userRecord.uid)
        .then(() => {
          console.log(`Successfully deleted user: ${userRecord.uid}`);
        })
        .catch((error) => {
          console.error(`Error deleting user: ${userRecord.uid}`, error);
        });
    });

    // Wait for all deletion promises to complete
    return Promise.all(promises);
  })
  .then(() => {
    console.log("All users have been deleted.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error listing/deleting users:", error);
    process.exit(1);
  });

// To initiate this code and delete all the authenticated users, write in the terminal: 'node AdminSDK'
// Make sure to cd to this file's folder
