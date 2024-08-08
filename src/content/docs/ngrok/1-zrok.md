---
title: Zrok Tunnel
description: A reference page in my new Starlight docs site.
---
Use EinarCLI to generate a Zrok tunnel, allowing your local network to be accessible from anywhere in the world. First, ensure your application has the necessary permissions to access Zrok resources. Below, we outline the available options to facilitate this process in your application.

# ⚙️ Environment Setup

The Zrok installation requires a Zrok environment setup. To set up your environment, you need to create an account on the Zrok homepage and follow the getting started steps on the [Zrok homepage](https://docs.zrok.io/docs/getting-started).

# 🌐 Zrok Installation

Inside your project directory, run the following command to include Zrok in your project:

```sh
einar install zrok
```

This will generate the following files and directories within your project, setting up the necessary infrastructure for Zrok interaction:

```sh 
/app
  /shared
    /infrastructure
      /zrok
        - tunnel.go
```

When running the application using go run main.go, you will see something like this:
```
Access server at the following endpoints:  https://6ixfzbvqgg3v.share.zrok.io
WrapHandler.func3

   ____    __
  / __/___/ /  ___
 / _// __/ _ \/ _ \
/___/\__/_//_/\___/ v4.12.0
High performance, minimalist Go web framework
https://echo.labstack.com
____________________________________O/_______
                                    O\
⇨ http server started on 6ixfzbvqgg3v
```