---
title: Publish & Subscribe
description: A reference page in my new Starlight docs site.
---
The einar-cli allows you to install Google PubSub dependencies, directly include them in your code, generate publishers & subscriptors for PubSub operations.

## 📡 PubSub installation
Inside your project directory, run the following command to include PubSub in your project:
```sh
einar install pubsub
```
This will generate the following files and directories within your project, setting up the necessary infrastructure for PubSub interaction:
```sh 
/app
  /shared
    /infrastructure
      /pubsubclient
        - client.go
        /subscriptionwrapper
          - handle_message_acknowledgment.go
          - message_processor.go
          - subscription_manager.go
```