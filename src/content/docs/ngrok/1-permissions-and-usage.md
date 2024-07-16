---
title: Installation & Permissions
description: A reference page in my new Starlight docs site.
---

Use EinarCLI to generate an Ngrok tunnel, allowing your local network to be accessible from anywhere in the world. First, ensure your application has the necessary permissions to access Ngrok resources. Below, we outline the available options to facilitate this process in your application.

# 🌐 Ngrok Installation
Inside your project directory, run the following command to include Ngrok in your project:

```sh
einar install ngrok
```

This will generate the following files and directories within your project, setting up the necessary infrastructure for Ngrok interaction:
```sh 
/app
  /shared
    /infrastructure
      /ngrok
        - tunnel.go
```

## 🔒 Permissions Setup

The Ngrok installation requires an Authtoken as an input parameter. To obtain the Authtoken, you need to create an account on the  [Ngrok HomePage.](https://ngrok.com/)

After generating your Authtoken, verify that the .env file in the root of your project contains the `NGROK_AUTHTOKEN` environment variable:
```sh 
NGROK_AUTHTOKEN="<TOKEN>"
```

When running the application using go run main.go, you will see something like this:
```
   ____    __
  / __/___/ /  ___
 / _// __/ _ \/ _ \
/___/\__/_//_/\___/ v4.12.0
High performance, minimalist Go web framework
https://echo.labstack.com
____________________________________O/_______
                                    O\
⇨ http server started on 1ef2-186-104-119-135.ngrok-free.app
```