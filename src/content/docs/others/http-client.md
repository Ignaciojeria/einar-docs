---
title: HTTP Client
description: A reference page in my new Starlight docs site.
---
The einar-cli allows you to generate custom HTTP clients with the necessary files and imports to handle your outgoing calls.


## 📥 HTTP Resty Client installation
Inside your project directory, run the following command to include HTTP Client in your project:
```sh
einar install resty
```
This will generate the following files and directories within your project, setting up the necessary infrastructure for Resty HTTP Client interaction:
```sh 
/app
  /shared
    /infrastructure
      /httpresty
        - client.go
```

## 👨‍💻 Generate a New Custom HTTP Client
Inside your project directory, run the following command to create a new custom HTTP Client:
```sh
einar generate resty-client call-public-api
```
Here's an example of how the generated code will look:

```sh
type CallPublicApi func(ctx context.Context, input interface{}) (interface{}, error)

func init() {
	ioc.Registry(NewCallPublicApi, newresty.NewClient)
}
func NewCallPublicApi(cli *resty.Client) CallPublicApi {
	return func(ctx context.Context, input interface{}) (interface{}, error) {
		return nil, nil
	}
}
```