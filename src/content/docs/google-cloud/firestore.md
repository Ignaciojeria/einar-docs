---
title: Firestore Repository
description: A reference page in my new Starlight docs site.
---
EinarCLI allows you to install Firestore dependencies, directly include them in your code, generate repositories for Firestore database operations, and verify the availability of Firestore in your Google project when the application starts.

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
        /firestoreclient
          - client.go
```

## 👨‍💻 Generate a New Custom Repository
Inside your project directory, run the following command to create a new custom repository:
```sh
einar generate firestore-repository save-customer
```
Here's an example of how the generated code will look:
```sh
type SaveCustomer func(ctx context.Context, input interface{}) error

func init() {
	ioc.Registry(
		NewSaveCustomer,
		firestoreclient.NewClient)
}
func NewSaveCustomer(c *firestore.Client) SaveCustomer {
	return func(ctx context.Context, input interface{}) error {
		return nil
	}
}
```
The file `save_customer.go` will be created in the following directory structure:
```
/app
  /adapter
    /out
      /firestore_repository
        - save_customer.go  
```

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
		firestoreclient.NewClient)
}
func NewSaveCustomer(c *firestore.Client) SaveCustomer {
	customers := c.Collection("customers")
	return func(ctx context.Context, input Customer) error {
		var ref *firestore.DocumentRef = customers.Doc(input.ID)
		if _, err := ref.Create(ctx, input); err != nil {
			return err
		}
		return nil
	}
}
```

### 📄🔍 Read individual document
Use DocumentRef.Get to read a document. The result is a DocumentSnapshot. Call its Data method to obtain the entire document contents as a map. You can also obtain a single field with DataAt, or extract the data into a struct with DataTo with the type definition :

```sh
type FindCustomerById func(ctx context.Context, input Customer) (Customer, error)

func init() {
	ioc.Registry(
		NewFindCustomerById,
		firestoreclient.NewClient)
}
func NewFindCustomerById(c *firestore.Client) FindCustomerById {
	customers := c.Collection("customers")
	return func(ctx context.Context, input Customer) (Customer, error) {
		var ref *firestore.DocumentRef = customers.Doc(input.ID)
		docsnap, err := ref.Get(ctx)
		if err != nil {
			return Customer{}, err
		}

		var foundDocument Customer
		if err := docsnap.DataTo(&foundDocument); err != nil {
			return Customer{}, err
		}
		return foundDocument, nil
	}
}
```
📚🔍 [Explore More Usage Examples in Official Documentation.](https://pkg.go.dev/cloud.google.com/go/firestore)
