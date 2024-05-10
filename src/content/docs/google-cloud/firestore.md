---
title: Firestore Repository
description: A reference page in my new Starlight docs site.
---
The einar-cli allows you to install Firestore dependencies, directly include them in your code, generate repositories for Firestore database operations, and verify the availability of Firestore in your Google project when the application starts.

## 🔥 Firestore installation
Inside your project directory, run the following command to include Firestore in your project:
```sh
einar install firestore
```
This will generate the following files and directories within your project, setting up the necessary infrastructure for Firestore interaction:
```sh 
/app
  /shared
    /infrastructure
      /firebaseapp
        - firebase_app.go
        /firestorewrapper
          - client_wrapper.go
```

## 👨‍💻 Generate a New Custom Repository
Inside your project directory, run the following command to create a new custom repository:
```sh
einar generate firestore-repository save-customer
```
Here's an example of how the generated code might look:
```sh
type SaveCustomer func(ctx context.Context, input interface{}) error

func init() {
	ioc.Registry(
		NewSaveCustomer,
		firestorewrapper.NewClientWrapper)
}
func NewSaveCustomer(c *firestorewrapper.ClientWrapper) SaveCustomer {
	return func(ctx context.Context, input interface{}) error {
		_, span := observability.Tracer.Start(ctx,
			"SaveCustomer",
			trace.WithSpanKind(trace.SpanKindInternal))
		defer span.End()
		return nil
	}
}
```
`c *firestorewrapper.ClientWrapper` is a wrapper for the [official Firestore package](https://pkg.go.dev/cloud.google.com/go/firestore).

### ✍️ Writing individual documents
For writing individual documents, use the methods provided on `*firestore.DocumentRef`. The `SaveCustomer` function, for example, creates a new document within the `customers` collection based on provided input.
```sh
type Customer struct {
	ID     string
	Name   string
	Talent string
}
```
```sh
type SaveCustomer func(ctx context.Context, input Customer) error

func init() {
	ioc.Registry(
		NewSaveCustomer,
		firestorewrapper.NewClientWrapper)
}
func NewSaveCustomer(c *firestorewrapper.ClientWrapper) SaveCustomer {
	customers := c.Client().Collection("customers")
	return func(ctx context.Context, input Customer) error {
		_, span := observability.Tracer.Start(ctx,
			"SaveCustomer",
			trace.WithSpanKind(trace.SpanKindInternal))
		defer span.End()

		var ref *firestore.DocumentRef = customers.Doc(input.ID)
		if _, err := ref.Create(ctx, input); err != nil {
      span.RecordError(err)
			return err
		}
		return nil
	}
}
```