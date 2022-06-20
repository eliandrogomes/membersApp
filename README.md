<!--
title: 'Serverless Framework with Node Express API service backed by DynamoDB on AWS'
description: 'This template present an architecture to develop and deploy a simple Node Express API service backed by DynamoDB running on AWS Lambda using the traditional Serverless Framework. The project was organized in routes, controllers and models to clarifies the purposes of each class. So, I built a RESTFUL API to perform CRUD operations as a "workout" challenge'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
authorLink: 'https://github.com/eliandrogomes'
authorName: 'Eliandro Velasco Dias Gomes'
authorAvatar: 'https://avatars.githubusercontent.com/u/8731255?s=400&v=4'
-->

# Serverless Framework Node Express API on AWS

This project was based on template Node Express API service, backed by DynamoDB database, running on AWS Lambda using the traditional Serverless Framework.


## Anatomy of the project

This project configures a single function, `api`, which is responsible for handling all incoming requests thanks to the `httpApi` event. As the event is configured in a way to accept all incoming requests, `express` framework is responsible for routing and handling requests internally. Implementation takes advantage of `serverless-http` package, which allows you to wrap existing `express` applications. Additionally, it also handles provisioning of a DynamoDB database that is used for storing data about members. The `express` application exposes five endpoints, `POST /members`, `GET /members` and `GET /members/{memberId}`, `PUT /members/{memberId}`, `PATCH /members/{memberId}`, `DELETE /members/{memberId}`, which allow to manager members/clients.

## Usage

### Deployment

Install dependencies with:

```
npm install
```

and then deploy with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-express-dynamodb-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-express-dynamodb-api-project-dev (196s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: aws-node-express-dynamodb-api-project-dev-api (766 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [`httpApi` event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api/). Additionally, in current configuration, the DynamoDB table will be removed when running `serverless remove`. To retain the DynamoDB table even after removal of the stack, add `DeletionPolicy: Retain` to its resource definition.

### Invocation

After successful deployment, you can create a new user by calling the corresponding endpoint:

```bash
curl --request POST 'https://s510gdx7fi.execute-api.us-east-1.amazonaws.com/members' --header 'Content-Type: application/json' --data-raw '{"firstName": "Charles", "middleInitial": "X", "lastName": "Xavier", "gender": "M", "email": "xavier@xmen.com", "phoneNumber": 5615555555}'
```

Which should result in the following response:

```bash
{
    "success": true,
    "data": {
        "firstName": "Charles",
        "lastName": "Xavier",
        "middleInitial": "X",
        "phoneNumber": 5615555555,
        "email": "xavier@xmen.com",
        "gender": "M",
        "createdAt": 1655656553667,
        "updatedAt": 1655656553667,
        "memberId": "8bf303de-727e-4ad8-b761-653e29739105"
    }
}
```

Other operations and documentation can be found in postman https://xxxxxxx.postman.com

### AWS API Gateway