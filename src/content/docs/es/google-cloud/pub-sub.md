---
title: Publicar y Suscribir
description: A reference page in my new Starlight docs site.
---
EinarCLI facilita la instalación de dependencias de Google PubSub, permite su inclusión directa en tu código y genera publicadores y suscriptores para operaciones de PubSub

## 📡 Instalación de PubSub
Dentro del directorio de tu proyecto, ejecuta el siguiente comando para incluir PubSub en tu proyecto:
```sh
einar install gcp-pubsub
```
Esto generará los siguientes archivos y directorios dentro de tu proyecto, configurando la infraestructura necesaria para la interacción con PubSub:
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

## 👨‍💻 Generar un Nuevo Publicador
Dentro del directorio de tu proyecto, ejecuta el siguiente comando para crear un nuevo publicador:
```sh
einar generate gcp-publisher publish-customer
```
Aquí tienes un ejemplo de cómo se verá el código generado:
```sh
type PublishCustomer func(ctx context.Context, input interface{}) error

func init() {
	ioc.Registry(
		NewPublishCustomer,
		pubsubclient.NewClient,
		logger.NewLogger)
}
func NewPublishCustomer(c *pubsub.Client, l logger.Logger) PublishCustomer {
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
			span.SetStatus(codes.Error, exception.PUBSUB_BROKER_ERROR.Error())
			span.RecordError(err)
			l.LogSpanError(span, exception.PUBSUB_BROKER_ERROR.Error(),
				logger.CustomLogFields{
					constants.Error: err.Error(),
				})
			return exception.PUBSUB_BROKER_ERROR
		}

		span.SetStatus(codes.Ok, "Message published with ID: "+messageID)

		return nil
	}
}
```

El archivo `publish_customer.go` se creará en la siguiente estructura de directorios:
```
/app
  /adapter
    /out
      /gcppublisher
        - publish_customer.go  
```
## 👨‍💻 Generar una Nueva Suscripción
Dentro del directorio de tu proyecto, ejecuta el siguiente comando para crear una nueva suscripción:
```sh
einar generate gcp-subscription process-customer
```
Aquí tienes un ejemplo de cómo se verá el código generado:
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
El archivo `process_customer.go` se creará en la siguiente estructura de directorios:
```
/app
  /adapter
    /in
      /gcpsubscription
        - process_customer.go  
```