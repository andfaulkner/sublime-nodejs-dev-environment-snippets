# AWS - definitions

## Admin Authentication Flow

-   AWS auth flow using an alternative set of admin APIs designed for use on secure backend servers
-   Not the recommended way - they recommend the "custom authentication flow"
-   avoids SRP calculations
-   passwords are sent as plain text, which is dumb

## Cognito (Amazon Cognito)

-   service that lets you create unique identities for your users & authenticate them using either:
    -   your own user pools
    -   federated identity providers
-   can also save user data e.g. game state or app preferences / settings

## User pools

\*

## Custom Authentication Flow

**Recommended approach for authentication**

-   auth flow designed to allow for a series of challenge & response cycles customizable to meet different requirements
-   Flow:
    1.  Call to the InitiateAuth API that:
        -   indicates the type of authentication that will be used
        -   provides any initial authentication parameters
    2.  Amazon Cognito responds to the InitiateAuth call with either:
        -   ID, access, and refresh tokens if the user is signed in
        -   An error if the user fails to authenticate
        -   A challenge for the user along with a session and parameters
            1.  App calls RespondToAuthChallenge API with challenge responses & passes back the session
            2.  Amazon Cognito responds to the RespondToAuthChallenge call similarly to the InitiateAuth call
                -   i.e. providing tokens if signed in, another challenge if unsure, or an error if auth fails
                -   this repeats over and over until auth fails or the user is signed in

## triggers

-   advanced customizations done using AWS Lambda functions
-   Lambda functions trigger on different events
-   trigger types:
    -   Pre-sign-up
        -   invoked when a user submits their information to sign up
        -   perform custom validation to accept or deny the sign-up request
    -   Pre-authentication
        -   invoked when a user submits their info to be authenticated
        -   perform custom validations to accept or deny the sign-in request
    -   Post-authentication
    -   Custom message
        -   invoked before verification or MFA message is sent)
    -   Post-confirmation
        -   invoked after user is authenticated
    -   Create Auth Challenge
    -   Define Auth Challenge
        -   invoked to initiate the custom auth flow
    -   Verify Auth Challenge Response

## Role / IAM Role

-   an AWS identity with permission policies that determine what the identity can & can't do in AWS
    -   Similar to a user, but:
        -   intended to be assumable by anyone who needs it
        -   does not have any credentials (password or access keys) associated with it
            -   if a user is assigned to a role, access keys are created dynamically & provided to the user
-   use to delegate access to users, apps, or services that don't normally have access to your AWS resources. e.g.
    -   let a mobile app to use AWS resources without embedding AWS keys within the app
    -   grant access to your account to a 3rd party to perform an audit on your resources

## Precedence

-   used to select which group is applied for permissions if a user is in multiple groups
    -   The group with the lowest precedence is applied

## SRP

-   Secure remote password
-   an augmented password-authenticated key agreement protocol (?)
-   a way for 1 party (the "client" or "user") to demonstrate to another party (the "server") that they know the password, without sending the password itself or any info from which the password can be broken

## Tags

-   Label that you or AWS assigns to an AWS resource
-   consists of a key and a value
    -   key can have >1 value
-   used to:
    -   organize resources
    -   track AWS costs on a detailed level (cost allocation tags)
-   2 types of cost-allocation tags:
    -   aws-generated
        -   created for you
    -   user-defined
-   tags must be activated before they appear in cost explorer or on a cost allocation report

-   [Cost allocation tags](http://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html)

## MFA

-   Multi-factor authentication, same as everywhere

## SQS

-   Simple query system - a distributed message queue system.

## SES

-   Simple Email Service - service for applications that need to send emails

## SNS

-   Simple notification service
-   Send messages (SMS, email, push notifications, messages to HTTP endpoints, etc)
    out to various endpoints & "topics" grouping endpoints into categories (e.g. mobile devices)

## Elastic Transcoder

- Converts files to different media formats, in the cloud.

## API Gateway

-   Fully managed service that makes it easy for devs to public, maintain, monitor, & secure APIs

-   Basically a doorway into your AWS environment.

-   Lets you create an API that acts as a front door for apps to access data,
    services, business logic, etc from your backend services e.g.:
        -   Code running on AWS Lambda
        -   Any web application
        -   Applications running on EC2 (Amazon Elastic Compute Cloud)

---

# Additional modules to do (minimum):

-   23
-   24
-   25
-   33
-   35
-   36
-   37
