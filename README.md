# Dialogflow Starter

Use this code, written in TypeScirpt, to set up a "serverless" chatbot running on Node.js. The script consists of a gateway and one fulfillment webhook with Google [Dialogflow](https://dialogflow.com/) and [Firebase](https://firebase.google.com/) Cloud Functions.

## Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Node.js and the npm package manager. It is recommended to use the [Node Version Manager](https://github.com/nvm-sh/nvm/blob/master/README.md).
- [Google Cloud SDK](https://cloud.google.com/sdk/docs).
- [Firebase Command Line Interface](https://firebase.google.com/docs/cli).
- [Postman](https://www.postman.com/) API client (to test the functions).

## Installation

Download or clone the repository:

```
git clone --depth 1 https://github.com/karoldavid/dialogflow-starter.git
```

Find the next installation instructions below in the _Firebase Setup_ section.

## Recommended to Read First

It is highly suggested to read and follow the instructions [here](https://cloud.google.com/dialogflow/docs/quick/setup) first (especially the part about authentication).

## Dialogflow Setup

To set up your Dialogflow agent with intent and webhook, read the [Dialogflow basics](https://cloud.google.com/dialogflow/docs/basics) and follow below steps:

- Create an _agent_ with [Dialogflow](https://dialogflow.com/).
- Associate the agent with an existing _Google Project_ or create a new Google Project.
- Create an _intent_, add a couple of _training phrases_ for this intent, and add one ore more _actions, parameters with prompts_.
- At the very bottom, enable [Fulfillment](https://cloud.google.com/dialogflow/docs/fulfillment-overview) for this intent to be able to call a _webservice_ to connect the backend. Finally, save the intent.
- Got to Fulfillment, enable the [Webhook](https://cloud.google.com/dialogflow/docs/fulfillment-webhook), add the Webhook url with your [project ID](https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects) the [webhook name](https://github.com/karoldavid/dialogflow-starter/blob/master/functions/src/fulfillment/index.ts#L41) and hit save:

```
https://us-central1-<project-id>.cloudfunctions.net/dialogflowFirebaseFulfillment
```

## Firebase Setup

### Initialize the Project

- At the root level of your local dialogflow-starter repository [initialize the Firebase SDK for Cloud Functions](https://firebase.google.com/docs/functions/get-started):

```
firebase init functions
```

- Choose your Dialogflow project from the project list.
- Choose TypeScript.
- Choose to use TSLINT.
- When asked to overwrite an existing file, always choose NO.
- When asked to install npm dependencies, say YES.

### Add the Service Account Key

- Got to the Firebase Console, select your project, got to _Settings_, and then _Service accounts_.
- Click the _Generate Private Key_ button.
- Download the json file to your local project's functions folder.
- Rename the key file to `service-account.json`:

```
dialogflow-starter/functions/service-account.json
```

### Connect the Webhook

- Replace the intent name to your intent name [here](https://github.com/karoldavid/dialogflow-starter/blob/master/functions/src/fulfillment/index.ts#L49).

- Add your own intent handler.

```
// functions/src/fulfillment/index.ts
intentMap.set([YOUR INTENT NAME], yourCallback(queryResult));
```

### Run and deploy

Before launching the app, cd into to functions folder and execute the following command:

```
npm run build
```

Next, execute below command to start the emulator:

```
firebase serve
```

Finally, if everything looks just fine, deploy the functions:

```
firebase deploy
```

### Test the gateway and webhook

- To test the interactions with the agent via _http requests_, open the _Postman API Client_.
- Set the _request method_ to _POST_.
- Set the Dialogflow gateway's _request url_ (which can be copied from the terminal output). Here is an example:

```
http://localhost:5000/walkthrough-fhakgj/us-central1/dialogflowGateway
```

- Finally, add the _request body_. It should contain the `sessionId` string, and the `queryInput` object. Set the `queryInput.text` property to one of your intent's training phrases:

```
{
	"sessionId": "foo",
	"queryInput": {
		"text": {
			"text": [INTENT_TRAINING_PHRASE_STRING],
			"languageCode": "en-US"
		}
	}
}
```

- When you now hit the send button, you should get a response from your Dialogflow agent.
- The answer of the last question should trigger the webhook. If your intent's fulfillement is set up to save data to the firebase db, you can control the operation in your Firebase project database.
- Finally, the Dialogflow agent's final answer may look as configured in the sample [intent handler](https://github.com/karoldavid/dialogflow-starter/blob/master/functions/src/fulfillment/index.ts#L37):

```
{
    "fulfillmentMessages": [
        {
            "platform": "PLATFORM_UNSPECIFIED",
            "text": {
                "text": [
                    "Thank you very much for your data."
                ]
            },
            "message": "text"
        },
        {
            "platform": "PLATFORM_UNSPECIFIED",
            "text": {
                "text": [
                    "We will follow up with detailed information via email."
                ]
            },
            "message": "text"
        }
    ],
    "outputContexts": [],
    "queryText": "anne",
    "speechRecognitionConfidence": 0,
    "action": "com.test.TEST_INTENT",
    "parameters": {
        "fields": {
            "name": {
                "stringValue": "anne",
                "kind": "stringValue"
            }
        }
    },
    "allRequiredParamsPresent": true,
    "fulfillmentText": "",
    "webhookSource": "",
    "webhookPayload": null,
    "intent": {
        "inputContextNames": [],
        "events": [],
        "trainingPhrases": [],
        "outputContexts": [],
        "parameters": [],
        "messages": [],
        "defaultResponsePlatforms": [],
        "followupIntentInfo": [],
        "name": "projects/walkthrough-fhakgj/agent/intents/46c847ea-aeb4-4b05-af79-254c27b0f7aa",
        "displayName": "Test Intent",
        "priority": 0,
        "isFallback": false,
        "webhookState": "WEBHOOK_STATE_UNSPECIFIED",
        "action": "",
        "resetContexts": false,
        "rootFollowupIntentName": "",
        "parentFollowupIntentName": "",
        "mlDisabled": false
    },
    "intentDetectionConfidence": 0.009999999776482582,
    "diagnosticInfo": {
        "fields": {
            "webhook_latency_ms": {
                "numberValue": 3303,
                "kind": "numberValue"
            }
        }
    },
    "languageCode": "en",
    "sentimentAnalysisResult": null
}
```

[WIP]
