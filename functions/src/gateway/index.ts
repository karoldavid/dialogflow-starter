export {};
import * as cors from "cors";
import * as functions from "firebase-functions";
import { SessionsClient, protos } from "@google-cloud/dialogflow";
import { GoogleAuthOptions } from "google-auth-library";

interface RequestWithBody extends functions.https.Request {
  body: {
    queryInput: protos.google.cloud.dialogflow.v2.IQueryInput;
    sessionId: string;
  };
}

const serviceAccount: GoogleAuthOptions["credentials"] = require("../../service-account.json");

const corsHandler = cors({ origin: true });

const { projectId }: { projectId: string } = JSON.parse(
  process.env.FIREBASE_CONFIG
);

export const dialogflowGateway = functions.https.onRequest(
  (request: RequestWithBody, response) => {
    corsHandler(
      request,
      response,
      async (): Promise<void> => {
        const { queryInput, sessionId } = request.body;

        const sessionClient = new SessionsClient({
          credentials: serviceAccount,
        });

        const session = sessionClient.projectAgentSessionPath(
          projectId,
          sessionId
        );

        try {
          const responses = await sessionClient.detectIntent({
            session,
            queryInput,
          });

          const result = responses[0].queryResult;

          response.send(result);
        } catch (err) {
          console.log(err);
          response
            .status(500)
            .send({ error: true, message: "Something went wrong." });
        }
      }
    );
  }
);
