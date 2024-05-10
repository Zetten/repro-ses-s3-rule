import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as actions from 'aws-cdk-lib/aws-ses-actions';

export interface ReproSesS3RuleStackProps extends cdk.StackProps {
  recipient: string;
}

export class ReproSesS3RuleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ReproSesS3RuleStackProps) {
    super(scope, id, props);

    const emailStoreBucket = new s3.Bucket(this, 'TestEmailStore', {
      accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      enforceSSL: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      lifecycleRules: [
        {
          id: 'DeleteEmailsAfter30Days',
          prefix: 'Email/',
          expiration: cdk.Duration.days(30),
        },
      ],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const receiptRuleSet = ses.ReceiptRuleSet.fromReceiptRuleSetName(this, 'TestRuleSet', 'TestRuleSet');

    receiptRuleSet.addRule('StoreToBucketRule', {
      receiptRuleName: 'StoreToBucketRule',
      recipients: [props.recipient],
      actions: [
        new actions.S3({
          bucket: emailStoreBucket,
          objectKeyPrefix: 'emails/',
        }),
      ],
      enabled: true,
    });
  }
}
