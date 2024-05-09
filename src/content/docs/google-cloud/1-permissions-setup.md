---
title: Permissions Setup
description: A reference page in my new Starlight docs site.
---
To use Einar CLI for generating Google Cloud components, you must first provide the necessary permissions for your application to access Google Cloud resources. Below, we outline the available options to facilitate this.

## Option 1: Application Default Credentials
[Learn how to set up Application Default Credentials here.](https://cloud.google.com/docs/authentication/provide-credentials-adc)

Before configuring your Application Default Credentials (ADC), verify that the .env file in the root of your project contains the `GOOGLE_PROJECT_ID` environment. Update or confirm its value as follows:

```sh
GOOGLE_PROJECT_ID="replace-by-your-gcp-project-id"
```

## Option 2: Creating a Service Account Key
Create a service account with the roles your application needs, and a key for that service account, by following the instructions in [Creating a service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating).

Before creating a service account key, ensure the .env file in the root of your project includes the  `GOOGLE_PROJECT_ID` and `GOOGLE_APPLICATION_CREDENTIALS` environment. Update or confirm their values as follows:
```sh
GOOGLE_APPLICATION_CREDENTIALS= "path/of/your/createdServiceAccount.json"
GOOGLE_PROJECT_ID= "replace-by-your-gcp-project-id"
```

