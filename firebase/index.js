const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "erpsode" // Replace with your Firebase Storage bucket name
});

const storage = admin.storage();
module.exports = storage; // Export the storage object directly
