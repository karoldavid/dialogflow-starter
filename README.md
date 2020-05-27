# Dialogflow Starter

Use this code, written in TypeScirpt, to set up a "serverless" chatbot running on Node.js. The script consists of a gateway and one fulfillment webhook with Google [Dialogflow](https://dialogflow.com/) and [Firebase](https://firebase.google.com/) Cloud Functions.

## Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Node.js and the npm package manager. It is recommended to use the [Node Version Manager](https://github.com/nvm-sh/nvm/blob/master/README.md).
- [Firebase Command Line Interface](https://firebase.google.com/docs/cli)

## Installation

Download or clone the repository:

```
git clone --depth 1 https://github.com/karoldavid/dialogflow-starter.git
```

## Dialogflow Setup

- Create an agent with [Dialogflow](https://dialogflow.com/).
- Associate the agent with an existing Google Project or create a new Google Project.
- Create an intent, add a couple of training phrases for this intent, and add one ore more actions, parameters with prompts.
- At the very bottom, enable fulfillment for this intent to be able to call a webservice to connect the backend and finally save the intent.
- Got to Fulfillment, enable the Webhook, add the Webhook url with your [project ID](https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects) the [webhook name](https://github.com/karoldavid/dialogflow-starter/blob/master/functions/src/fulfillment/index.ts#L41) and hit save:

```
https://us-central1-<project-id>.cloudfunctions.net/dialogflowFirebaseFulfillment
```

## Project Setup
