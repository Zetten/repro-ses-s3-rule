#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {ReproSesS3RuleStack} from '../lib/repro-ses-s3-rule-stack';

const app = new cdk.App({
  context: {
    recipient: 'test@example.com',
  },
});

new ReproSesS3RuleStack(app, 'ReproSesS3RuleStack', {
  recipient: app.node.getContext('recipient'),
});