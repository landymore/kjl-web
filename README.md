# KevinJLandymore.com README

This is my personal website, recently relaunched with Angular. It's set as public to show how I would go about creating a simple Angular single page app hosted on AWS with GitHub Actions.

## Development Environment

I've worked on the Mac platform personally since 2008 and professionally since about 2018 (when I could get it approved at my organization). I use the following IDEs in no particular order of preference:
* JetBrains Rider
* JetBrains WebStorm
* Visual Studio Code

## AWS configuration

This website is uses Cloudfront + S3 to host the static content in AWS.

### Infrastructure as Code
Cloudformation is in `infrastructure/cloudformation` and the workflow is `.github/workflows/cicd.yml`. Secrets and variables are managed in GitHub, and we use an environment (`prod`) configured with approvals to gate deployments. We do NOT use Pull requests as the final gate!

### IAM Role trust policy

Using the following trust policy I can ensure that only the production GitHub Actions environment from my repository can deploy to the production account hosting my website. 

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::<account number>:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": "repo:landymore/kjl-web:environment:prod"
                }
            }
        }
    ]
}
```

Enjoy!

# Angular README

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.9.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
