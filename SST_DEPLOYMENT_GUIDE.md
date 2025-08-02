# SST Deployment Guide for Mortgage App

## Overview
This guide will help you deploy your mortgage application using SST (Serverless Stack Toolkit) on AWS with serverless architecture.

## Prerequisites

1. **AWS Account**: Set up an AWS account
2. **AWS CLI**: Install and configure AWS CLI
3. **Node.js**: Version 18+ recommended
4. **SST CLI**: Install globally `npm install -g sst`

## Architecture Overview

### Core Services Used:
- **AWS Lambda**: Serverless functions for API endpoints
- **Amazon DynamoDB**: NoSQL database for user data, loans, documents
- **Amazon S3**: Document storage (bank statements, income docs)
- **API Gateway**: RESTful API management
- **CloudFront**: CDN for fast document delivery
- **Amazon SES**: Email notifications
- **Amazon SNS**: SMS notifications
- **AWS Secrets Manager**: Secure credential storage

### Cost Estimation:
- **Development**: $10-50/month
- **Production (100-1000 users)**: $50-200/month
- **High Traffic (1000+ users)**: $200-500/month

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure AWS Credentials
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and preferred region
```

### 3. Set Environment Variables
Create `.env` file in the root directory:
```env
# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# AWS Region
AWS_REGION=us-east-1

# Stage (dev, staging, production)
STAGE=dev

# Email domain for SES (replace with your domain)
EMAIL_DOMAIN=yourdomain.com
```

### 4. Deploy to Development
```bash
npm run sst:dev
```
This command:
- Creates AWS resources
- Deploys Lambda functions
- Sets up DynamoDB tables
- Configures API Gateway
- Provides live development environment

### 5. Deploy to Production
```bash
npm run sst:deploy --stage production
```

## Database Schema

### DynamoDB Tables Created:

#### 1. UsersTable
```
Primary Key: id (string)
Global Secondary Indexes:
- EmailIndex: email
- PhoneIndex: phone  
- UsernameIndex: username

Attributes:
- id: User unique identifier
- email: User email (optional)
- phone: User phone (optional)
- username: User username
- password: Hashed password
- createdAt: Account creation timestamp
- isVerified: Account verification status
```

#### 2. LoansTable
```
Primary Key: id (string)
Global Secondary Indexes:
- UserLoansIndex: userId + createdAt
- StatusIndex: status + createdAt

Attributes:
- id: Loan unique identifier
- userId: Reference to user
- propertyAddress: Property address
- loanAmount: Requested loan amount
- status: Loan status (pending, approved, etc.)
- progress: Application progress percentage
- createdAt: Application timestamp
```

#### 3. DocumentsTable
```
Primary Key: id (string)
Global Secondary Indexes:
- LoanDocumentsIndex: loanId + uploadedAt
- UserDocumentsIndex: userId + uploadedAt

Attributes:
- id: Document unique identifier
- loanId: Reference to loan
- userId: Reference to user
- type: Document type (income, bank_statement, etc.)
- status: Document status (pending, verified, etc.)
- s3Key: S3 object key
- fileName: Original filename
- uploadedAt: Upload timestamp
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify-otp` - OTP verification

### Loans
- `GET /loans` - List user loans
- `POST /loans` - Create new loan application

### Documents
- `GET /documents` - List user documents
- `POST /documents/upload` - Upload document

## Migration from Express Backend

### Step-by-Step Migration:

1. **Keep Current Backend Running**: Don't remove until SST is fully tested
2. **Migrate Routes Gradually**: Start with authentication endpoints
3. **Update Mobile App**: Change API endpoints to new SST URLs
4. **Test Thoroughly**: Ensure all functionality works
5. **Switch DNS**: Point your domain to new API Gateway
6. **Remove Old Backend**: Once everything is confirmed working

### Data Migration:
If you have existing PostgreSQL data:
1. Export data from PostgreSQL
2. Transform to DynamoDB format
3. Import using AWS CLI or SDK
4. Verify data integrity

## Security Features

### Built-in Security:
- **HTTPS Only**: All endpoints enforce HTTPS
- **CORS**: Properly configured cross-origin requests
- **Rate Limiting**: Built into API Gateway
- **Encryption**: Data encrypted at rest and in transit
- **IAM Roles**: Least privilege access for Lambda functions
- **Secrets Management**: JWT secrets stored in AWS Secrets Manager

### Additional Security Recommendations:
- Enable CloudTrail for audit logging
- Set up CloudWatch alarms for monitoring
- Use AWS WAF for additional protection
- Implement proper backup strategies

## Monitoring and Logging

### Built-in Monitoring:
- **CloudWatch Logs**: All Lambda function logs
- **CloudWatch Metrics**: Performance metrics
- **X-Ray Tracing**: Request tracing (optional)

### Custom Monitoring:
```typescript
// Add to Lambda functions for custom metrics
import { CloudWatchClient, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch";

const cloudwatch = new CloudWatchClient({});

// Track custom metrics
await cloudwatch.send(new PutMetricDataCommand({
  Namespace: "MortgageApp",
  MetricData: [{
    MetricName: "UserRegistrations",
    Value: 1,
    Unit: "Count"
  }]
}));
```

## Scaling and Performance

### Auto-Scaling Features:
- **Lambda**: Automatic scaling based on requests
- **DynamoDB**: On-demand billing scales automatically
- **S3**: Unlimited storage capacity
- **CloudFront**: Global CDN for fast document access

### Performance Optimization:
- **Connection Pooling**: Reuse DynamoDB connections
- **Caching**: Implement response caching
- **Image Optimization**: Compress uploaded documents
- **CDN**: Use CloudFront for static assets

## Backup and Disaster Recovery

### Automated Backups:
- **DynamoDB**: Point-in-time recovery enabled
- **S3**: Cross-region replication for documents
- **Lambda**: Code versioning for rollbacks

### Manual Backup Strategy:
```bash
# Export DynamoDB data
aws dynamodb scan --table-name UsersTable > users-backup.json

# Sync S3 bucket for backup
aws s3 sync s3://mortgage-documents s3://mortgage-documents-backup
```

## Troubleshooting

### Common Issues:

1. **Deploy Fails**: Check AWS credentials and permissions
2. **Lambda Timeouts**: Increase timeout in sst.config.ts
3. **DynamoDB Errors**: Verify table schemas and indexes
4. **CORS Errors**: Check API Gateway CORS configuration

### Debug Commands:
```bash
# View logs
npm run sst:console

# Check resources
aws cloudformation describe-stacks --stack-name mortgage-app-dev

# View Lambda logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda
```

## Cost Optimization

### Tips to Minimize Costs:
1. **Use On-Demand DynamoDB**: Only pay for what you use
2. **Lambda Provisioned Concurrency**: Only for high-traffic functions
3. **S3 Intelligent Tiering**: Automatic cost optimization
4. **CloudFront Caching**: Reduce origin requests
5. **Monitor Usage**: Set up billing alerts

### Monthly Cost Breakdown (Estimated):
- Lambda: $5-20 (depends on requests)
- DynamoDB: $10-50 (depends on storage/requests)
- S3: $5-15 (document storage)
- API Gateway: $3-10 (API requests)
- Other Services: $5-15

## Next Steps

1. Deploy to development environment
2. Test all functionality thoroughly
3. Set up monitoring and alerts
4. Plan production deployment
5. Implement additional features (document OCR, workflow automation)

## Support

For issues or questions:
1. Check AWS documentation
2. Review SST documentation: https://sst.dev
3. AWS Support (if you have a support plan)
4. Community forums and Stack Overflow