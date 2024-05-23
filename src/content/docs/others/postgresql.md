---
title: PostgreSQL Repository
description: A reference page in my new Starlight docs site.
---
The einar-cli allows you to install PostgreSQL GORM dependencies, include them directly in your code, and generate repositories for PostgreSQL database operations.

## 🗄️ PostgreSQL installation
Inside your project directory, run the following command to include PostgreSQL GORM in your project:
```sh
einar install postgresql
```
This will generate the following files and directories within your project, setting up the necessary infrastructure for PostgreSQL interaction:
```sh 
/app
  /shared
    /infrastructure
      /postgresql
        - connection.go
```
## 👨‍💻 Generate a New Custom Repository
Inside your project directory, run the following command to create a new custom repository:
```sh
einar generate postgresql-repository save-customer
```
Here's an example of how the generated code might look:
```sh
type SaveCustomer func(ctx context.Context, input interface{}) error

func init() {
	ioc.Registry(
		NewSaveCustomer,
		postgresql.NewConnection,
		logging.NewLogger)
}
func NewSaveCustomer(connection *gorm.DB, logger logging.Logger) SaveCustomer {
	return func(ctx context.Context, input interface{}) error {
		_, span := observability.Tracer.Start(ctx,
			"SaveCustomer",
			trace.WithSpanKind(trace.SpanKindInternal))
		defer span.End()
		//PUT YOUR POSTGRESQL OPERATION HERE
		return nil
	}
}
```