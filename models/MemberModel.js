const AWS = require("aws-sdk");
const dynamoose = require('dynamoose');

// local configuration
const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = 'localhost'
  dynamoDbClientParams.endpoint = 'http://localhost:8000'
} else {
  dynamoDbClientParams.region = 'us-east-1'
}

dynamoose.aws.sdk.config.update(dynamoDbClientParams);

const schema = new dynamoose.Schema(
  {
    memberId: {
      type: String,
      hashKey: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    middleInitial: {
      type: String,
      required: false
    },
    phoneNumber: {
      type: Number,
      required: false
    },
    email: {
      type: String,
      required: true,
      validate: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    },
    gender: {
      type: String,
      required: true,
      enum: ["F","M"]
    },
  },
  {
    timestamps: true
  }
);
const MemberModel = dynamoose.model(process.env.MEMBERS_TABLE, schema, {
  create: true
});

MemberModel.findByEmail = async (email) => {
  // need index to performer this query
  // return await MemberModel.query("email").eq(email).exec();
  const condition = new dynamoose.Condition().where("email").eq(email);
  return await MemberModel.scan(condition).exec();
}
module.exports = { MemberModel };