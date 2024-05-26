---
title: Repositorio de Firestore
description: A reference page in my new Starlight docs site.
---
EinarCLI te permite instalar dependencias de Firestore, incluirlas directamente en tu código, generar repositorios para operaciones de base de datos de Firestore y verificar la disponibilidad de Firestore en tu proyecto de Google al iniciar la aplicación.

## 🔥 Firestore installation
Dentro del directorio de tu proyecto, ejecuta el siguiente comando para incluir Firestore en tu proyecto:
```sh
einar install firestore
```
Esto generará los siguientes archivos y directorios dentro de tu proyecto, configurando la infraestructura necesaria para la interacción con Firestore:
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
Dentro del directorio de tu proyecto, ejecuta el siguiente comando para crear un nuevo repositorio personalizado:
```sh
einar generate firestore-repository save-customer
```
Aquí tienes un ejemplo de cómo se verá el código generado:
```sh
type SaveCustomer func(ctx context.Context, input interface{}) error

func init() {
	ioc.Registry(
		NewSaveCustomer,
		firestoreclient.NewClient)
}
func NewSaveCustomer(c *firestore.Client) SaveCustomer {
	return func(ctx context.Context, input interface{}) error {
		_, span := observability.Tracer.Start(ctx,
			"SaveCustomer",
			trace.WithSpanKind(trace.SpanKindInternal))
		defer span.End()
		return nil
	}
}
```
El archivo `save_customer.go` se creará en la siguiente estructura de directorios:
```
/app
  /adapter
    /out
      /firestore_repository
        - save_customer.go  
```

### ✍️ Escribiendo documentos individuales
Para escribir documentos individuales, utiliza los métodos proporcionados en `*firestore.DocumentRef`. La función `SaveCustomer`, por ejemplo, crea un nuevo documento dentro de la colección `customers` basado en la entrada proporcionada.
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

### 📄🔍 Leer documentos individuales.
Utiliza `DocumentRef.Get` para leer un documento. El resultado es un `DocumentSnapshot`. Llama a su método `Data` para obtener el contenido completo del documento como un mapa. También puedes obtener un único campo con `DataAt`, o extraer los datos en una estructura con `DataTo` utilizando su definición de tipo:

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
		_, span := observability.Tracer.Start(ctx,
			"FindCustomerById",
			trace.WithSpanKind(trace.SpanKindInternal))
		defer span.End()

		var ref *firestore.DocumentRef = customers.Doc(input.ID)
		docsnap, err := ref.Get(ctx)
		if err != nil {
			span.RecordError(err)
			return Customer{}, err
		}

		var foundDocument Customer
		if err := docsnap.DataTo(&foundDocument); err != nil {
			span.RecordError(err)
			return Customer{}, err
		}
		return foundDocument, nil
	}
}
```
📚🔍 [Explora más ejemplos de uso en la Documentación Oficial.](https://pkg.go.dev/cloud.google.com/go/firestore)
