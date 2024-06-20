---
title: Publish & Subscribe
description: A reference page in my new Starlight docs site.
---
EinarCLI allows you to install Google PubSub dependencies, directly include them in your code, generate publishers & subscriptors for PubSub operations.

## 📡 PubSub installation
Inside your project directory, run the following command to include PubSub in your project:
```sh
einar install gcp-pubsub
```
This will generate the following files and directories within your project, setting up the necessary infrastructure for PubSub interaction:
```sh 
/app
  /shared
    /infrastructure
      /gcppubsub
        - client.go
        /subscriptionwrapper
          - handle_message_acknowledgment.go
          - message_processor.go
          - subscription_manager.go
```

## 👨‍💻 Generate a New Custom Publisher
Inside your project directory, run the following command to create a new custom publisher:
```sh

type PublishCustomer func(ctx context.Context, input interface{}) error

func init() {
	ioc.Registry(
		NewPublishCustomer,
		gcppubsub.NewClient,
		logging.NewLogger)
}
func NewPublishCustomer(c *pubsub.Client, logger logging.Logger) PublishCustomer {
	topicName := "INSERT_YOUR_TOPIC_NAME_HERE"
	topic := c.Topic(topicName)
	return func(ctx context.Context, input interface{}) error {
		_, span := observability.Tracer.Start(ctx, "PublishCustomer",
			trace.WithSpanKind(trace.SpanKindProducer),
			trace.WithAttributes(attribute.String(constants.TopicName, topicName)),
		)
		defer span.End()

		bytes, err := json.Marshal(input)
		if err != nil {
			return err
		}

		message := &pubsub.Message{
			Attributes: map[string]string{
				"customAttribute1": "attr1",
				"customAttribute2": "attr2",
			},
			Data: bytes,
		}

		result := topic.Publish(ctx, message)
		// Get the server-generated message ID.
		messageID, err := result.Get(ctx)

		if err != nil {
			span.SetStatus(codes.Error, systemerr.PUBSUB_BROKER_ERROR.Error())
			span.RecordError(err)
			logger.SpanLogger(span).Error(
				systemerr.PUBSUB_BROKER_ERROR.Error(),
				constants.TopicName, topicName,
				constants.Error, err.Error())
			return systemerr.PUBSUB_BROKER_ERROR
		}

		span.SetStatus(codes.Ok, "Message published with ID: "+messageID)

		return nil
	}
}
```

The file publish_customer.go will be created in the following directory structure:
```
/app
  /adapter
    /out
      /gcppublisher
        - publish_customer.go  
```
## 👨‍💻 Generate a New Custom Subscription
Inside your project directory, run the following command to create a new custom subscription:
```sh
einar generate gcp-subscription process-customer
```
Here’s an example of how the generated code will look:
```sh
func init() {
	ioc.Registry(
		newProcessCustomer,
		subscriptionwrapper.NewSubscriptionManager)
}
func newProcessCustomer(
	sm subscriptionwrapper.SubscriptionManager,
) subscriptionwrapper.MessageProcessor {
	subscriptionName := "INSERT_YOUR_SUBSCRIPTION_NAME_HERE"
	subscriptionRef := sm.Subscription(subscriptionName)
	subscriptionRef.ReceiveSettings.MaxOutstandingMessages = 5
	messageProcessor := func(ctx context.Context, m *pubsub.Message) (int, error) {
		_, span := observability.Tracer.Start(ctx,
			"messageProcessorStruct",
			trace.WithSpanKind(trace.SpanKindConsumer), trace.WithAttributes(
				attribute.String("subscription.name", subscriptionRef.String()),
				attribute.String("message.id", m.ID),
				attribute.String("message.publishTime", m.PublishTime.String()),
			))
		defer span.End()
		var input interface{}
		if err := json.Unmarshal(m.Data, &input); err != nil {
			span.SetStatus(codes.Error, err.Error())
			m.Ack()
			return http.StatusAccepted, err
		}
		m.Ack()
		return http.StatusOK, nil
	}
	go sm.WithMessageProcessor(messageProcessor).
		WithPushHandler("/subscription/" + subscriptionName).
		Start(subscriptionRef)
	return messageProcessor
}
```
The file process_customer.go will be created in the following directory structure:
```
/app
  /adapter
    /in
      /gcpsubscription
        - process_customer.go  
```