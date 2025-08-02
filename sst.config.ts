/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "mortgage-app",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1", // Change to your preferred region
        },
      },
    };
  },
  async run() {
    // VPC for enhanced security
    const vpc = new sst.aws.Vpc("MortgageVpc", {
      baseTags: {
        Project: "MortgageApp",
      },
    });

    // S3 bucket for document storage
    const documentsBucket = new sst.aws.Bucket("MortgageDocuments", {
      public: false,
      cors: [
        {
          allowedMethods: ["GET", "PUT", "POST", "DELETE"],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          maxAge: 3000,
        },
      ],
    });

    // DynamoDB tables
    const usersTable = new sst.aws.Dynamo("UsersTable", {
      fields: {
        id: "string",
        email: "string",
        phone: "string",
        username: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        EmailIndex: { hashKey: "email" },
        PhoneIndex: { hashKey: "phone" },
        UsernameIndex: { hashKey: "username" },
      },
    });

    const loansTable = new sst.aws.Dynamo("LoansTable", {
      fields: {
        id: "string",
        userId: "string",
        status: "string",
        createdAt: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        UserLoansIndex: { hashKey: "userId", rangeKey: "createdAt" },
        StatusIndex: { hashKey: "status", rangeKey: "createdAt" },
      },
    });

    const documentsTable = new sst.aws.Dynamo("DocumentsTable", {
      fields: {
        id: "string",
        loanId: "string",
        userId: "string",
        type: "string",
        status: "string",
        uploadedAt: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        LoanDocumentsIndex: { hashKey: "loanId", rangeKey: "uploadedAt" },
        UserDocumentsIndex: { hashKey: "userId", rangeKey: "uploadedAt" },
      },
    });

    // RDS Aurora Serverless for relational data (if needed alongside DynamoDB)
    const database = new sst.aws.Postgres("MortgageDB", {
      engine: "aurora-postgresql",
      version: "13.13",
      scaling: {
        min: 0.5,
        max: 1,
      },
      vpc,
    });

    // Secrets for sensitive data
    const jwtSecret = new sst.aws.Secret("JwtSecret");
    const databaseUrl = new sst.aws.Secret("DatabaseUrl");

    // API Gateway with Lambda functions
    const api = new sst.aws.ApiGatewayV2("MortgageApi", {
      cors: {
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowOrigins: ["*"],
        allowHeaders: ["*"],
      },
    });

    // Auth Lambda function
    api.route("POST /auth/register", {
      handler: "backend/src/lambda/auth.register",
      environment: {
        USERS_TABLE: usersTable.name,
        JWT_SECRET: jwtSecret.value,
        STAGE: $app.stage,
      },
      permissions: [
        {
          actions: ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Query"],
          resources: [usersTable.arn, `${usersTable.arn}/*`],
        },
      ],
    });

    api.route("POST /auth/login", {
      handler: "backend/src/lambda/auth.login",
      environment: {
        USERS_TABLE: usersTable.name,
        JWT_SECRET: jwtSecret.value,
        STAGE: $app.stage,
      },
      permissions: [
        {
          actions: ["dynamodb:GetItem", "dynamodb:Query"],
          resources: [usersTable.arn, `${usersTable.arn}/*`],
        },
      ],
    });

    api.route("POST /auth/verify-otp", {
      handler: "backend/src/lambda/auth.verifyOtp",
      environment: {
        USERS_TABLE: usersTable.name,
        JWT_SECRET: jwtSecret.value,
        STAGE: $app.stage,
      },
      permissions: [
        {
          actions: ["dynamodb:UpdateItem", "dynamodb:GetItem"],
          resources: [usersTable.arn],
        },
      ],
    });

    // Loan management endpoints
    api.route("GET /loans", {
      handler: "backend/src/lambda/loans.list",
      environment: {
        LOANS_TABLE: loansTable.name,
        USERS_TABLE: usersTable.name,
        JWT_SECRET: jwtSecret.value,
      },
      permissions: [
        {
          actions: ["dynamodb:Query", "dynamodb:GetItem"],
          resources: [loansTable.arn, `${loansTable.arn}/*`, usersTable.arn],
        },
      ],
    });

    api.route("POST /loans", {
      handler: "backend/src/lambda/loans.create",
      environment: {
        LOANS_TABLE: loansTable.name,
        USERS_TABLE: usersTable.name,
        JWT_SECRET: jwtSecret.value,
      },
      permissions: [
        {
          actions: ["dynamodb:PutItem", "dynamodb:GetItem"],
          resources: [loansTable.arn, usersTable.arn],
        },
      ],
    });

    // Document management endpoints
    api.route("GET /documents", {
      handler: "backend/src/lambda/documents.list",
      environment: {
        DOCUMENTS_TABLE: documentsTable.name,
        DOCUMENTS_BUCKET: documentsBucket.name,
        JWT_SECRET: jwtSecret.value,
      },
      permissions: [
        {
          actions: ["dynamodb:Query"],
          resources: [documentsTable.arn, `${documentsTable.arn}/*`],
        },
        {
          actions: ["s3:GetObject"],
          resources: [`${documentsBucket.arn}/*`],
        },
      ],
    });

    api.route("POST /documents/upload", {
      handler: "backend/src/lambda/documents.upload",
      environment: {
        DOCUMENTS_TABLE: documentsTable.name,
        DOCUMENTS_BUCKET: documentsBucket.name,
        JWT_SECRET: jwtSecret.value,
      },
      permissions: [
        {
          actions: ["dynamodb:PutItem"],
          resources: [documentsTable.arn],
        },
        {
          actions: ["s3:PutObject", "s3:PutObjectAcl"],
          resources: [`${documentsBucket.arn}/*`],
        },
      ],
    });

    // CloudFront distribution for document delivery
    const cdn = new sst.aws.Cdn("MortgageCdn", {
      origins: [
        {
          domainName: documentsBucket.domain,
          originId: "S3Origin",
        },
      ],
      defaultCacheBehavior: {
        targetOriginId: "S3Origin",
        compress: true,
        allowedMethods: ["GET", "HEAD", "OPTIONS"],
        cachedMethods: ["GET", "HEAD"],
        viewerProtocolPolicy: "redirect-to-https",
      },
    });

    // SNS for notifications
    const notificationsTopic = new sst.aws.SnsTopic("MortgageNotifications");

    // SES for email notifications
    const emailDomain = new sst.aws.Email("MortgageEmail", {
      sender: "noreply@yourdomain.com", // Replace with your domain
    });

    // Step Functions for loan processing workflow
    const loanWorkflow = new sst.aws.Function("LoanWorkflow", {
      handler: "backend/src/lambda/workflow.handler",
      environment: {
        LOANS_TABLE: loansTable.name,
        DOCUMENTS_TABLE: documentsTable.name,
        NOTIFICATIONS_TOPIC: notificationsTopic.arn,
      },
      permissions: [
        {
          actions: ["dynamodb:UpdateItem", "dynamodb:GetItem"],
          resources: [loansTable.arn, documentsTable.arn],
        },
        {
          actions: ["sns:Publish"],
          resources: [notificationsTopic.arn],
        },
      ],
    });

    return {
      api: api.url,
      database: database.host,
      documentsBucket: documentsBucket.name,
      cdnUrl: cdn.domainName,
    };
  },
});