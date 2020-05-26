import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { protos } from "@google-cloud/dialogflow";
import { WebhookClient } from "dialogflow-fulfillment";

interface Person {
  country: string;
  email: string;
  name: string;
  nationality: string;
}

interface RequestWithBody extends functions.https.Request {
  body: {
    queryResult: protos.google.cloud.dialogflow.v2.IQueryResult;
  };
}

const welcome = (agent: WebhookClient): void => {
  agent.add("Welcome to my agent!");
};

const fallback = (agent: WebhookClient): void => {
  agent.add("I didn't understand");
  agent.add("I'm sorry, can you try again?");
};

const firstContactHandler = (
  result: protos.google.cloud.dialogflow.v2.IQueryResult
): Function => async (agent: WebhookClient): Promise<void> => {
  const db = admin.firestore();
  const { country, email, name, nationality } = result.parameters as Person;
  const user = db.collection("users").doc(email);

  await user.set({ country, nationality, name, email });

  agent.add("Thank you very much for your data.");
  agent.add("We will follow up with detailed information via email.");
};

export const dialogflowFirebaseFulfillment = functions.https.onRequest(
  async (request: RequestWithBody, response): Promise<void> => {
    const agent = new WebhookClient({ request, response });
    const { queryResult } = request.body;
    const intentMap = new Map();

    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("Default Fallback Intent", fallback);
    intentMap.set("Relocation Intent", firstContactHandler(queryResult));

    await agent.handleRequest(intentMap);
  }
);
