const admin = require('firebase-admin');
const serviceAccount = require('./auth-app-a7a4b-firebase-adminsdk-hy3yl-256bb12f1f.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
