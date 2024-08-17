---
title: Slog
description: This site explains how to integrate the Slog logger into your EinarCLI application.
---

EinarCLI allows you to integrate Slog directly into your code, enabling the generation of injectable dependencies for logging operations.

## 🛠️ Slog installation
Inside your project directory, run the following command to include the Slog dependency in your project:

```sh
einar install slog
```

This command will generate the following files and directories within your project, setting up the necessary infrastructure for Slog interaction:

```sh 
/app
  /adapter
    /out
      /slogging
        - logger.go  
```


## 👨‍💻 Example Usage

The logs generated with Slog can be injected into any component created by EinarCLI, providing a flexible and consistent logging mechanism across your application. Below is an example of how to use the logger in an onload job:

```sh
func init() {
	ioc.Registry(myOnloadJob, slogging.NewLogger)
}
func myOnloadJob(logger slogging.Logger) {
	logger.Info("Hello from structured logs :D", "customKey", "customValue")
}
```
In this example, the myOnloadJob function receives the logger as a dependency, allowing you to log structured information when the job is executed. The logger is automatically injected by EinarCLI, ensuring seamless integration with the rest of your application.

When executed, the log will appear in the console output as follows:

```sh
{
    "time": "2024-08-17T13:50:39.3223588-04:00",
    "level": "INFO",
    "msg": "Hello from structured logs :D",
    "customKey": "customValue"
}
```