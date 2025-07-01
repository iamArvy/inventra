import { Injectable } from '@nestjs/common';
import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from '@aws-sdk/client-sns';

@Injectable()
export class SnsService {
  private readonly snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async publishToTopic(topicArn: string, message: string, attributes = {}) {
    const params: PublishCommandInput = {
      Message: message,
      TopicArn: topicArn,
      MessageAttributes: Object.entries(attributes).reduce(
        (acc, [key, value]) => {
          acc[key] = {
            DataType: 'String',
            StringValue: value,
          };
          return acc;
        },
        {},
      ),
    };

    return this.snsClient.send(new PublishCommand(params));
  }
}
