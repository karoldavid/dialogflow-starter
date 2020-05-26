import * as admin from "firebase-admin";
import { dialogflowGateway } from "./gateway";
import { dialogflowFirebaseFulfillment } from "./fulfillment";

const serviceAccount: admin.ServiceAccount = require("../service-account.json");

const { databaseURL }: { databaseURL: string } = JSON.parse(
  process.env.FIREBASE_CONFIG
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL,
});

exports.dialogflowGateway = dialogflowGateway;
exports.dialogflowFirebaseFulfillment = dialogflowFirebaseFulfillment;
