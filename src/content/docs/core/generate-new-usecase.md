---
title: UseCase & Dependency Injection
description: A reference page in my new Starlight docs site.
---
The einar-cli lets you create custom business use cases, generating the necessary files and imports to handle your business logic. Einar uses OpenTelemetry to provide complete observability by passing context as the first argument, which unifies traces, metrics, and logs, thereby enhancing your application's monitoring capabilities.

## Generate a New Custom UseCase
Inside your project directory, run the following command to create a new custom usecase:
```sh
einar generate usecase create-customer
```
Here's an example of how the generated code might look:
```sh
type CreateCustomer func(ctx context.Context, domain interface{}) (interface{}, error)

func init() {
	ioc.Registry(NewCreateCustomer)
}
func NewCreateCustomer() CreateCustomer {
	return func(ctx context.Context, input interface{}) (interface{}, error) {
		_, span := observability.Tracer.Start(ctx, "CreateCustomer")
		defer span.End()
		return input, nil
	}
}
```
The file ```create_customer.go``` will be created in the following directory structure:
```
/app
  /usecase
    - create_customer.go
```

## Dependency Injection with Einar's Built-In Mechanism
Einar features its own dependency injection mechanism, which we utilize here by integrating the CreateCustomer type as a constructor argument and registering its associated constructor with ioc.Registry. This approach streamlines the integration of various application components like handlers and use cases, enhancing the maintainability, testeability and scalability of your application:
```sh
func init() {
	ioc.Registry(postCustomer,
		serverwrapper.NewEchoWrapper,
		usecase.NewCreateCustomer)
}
func postCustomer(
	e serverwrapper.EchoWrapper,
	createCustomer usecase.CreateCustomer) {
	e.POST("/insert-your-custom-pattern-here", func(c echo.Context) error {
		result, _ := createCustomer(c.Request().Context(), "custom input")
		return c.JSON(http.StatusOK, result)
	})
}
```