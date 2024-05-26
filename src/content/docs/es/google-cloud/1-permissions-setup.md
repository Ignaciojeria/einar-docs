---
title: Configuración de permisos
description: A reference page in my new Starlight docs site.
---
Usa EinarCLI para generar componentes de Google Cloud. Primero debes proporcionar los permisos necesarios para que tu aplicación acceda a los recursos de Google Cloud. A continuación, te presentamos las opciones disponibles para facilitar esto.

## Opción 1: Credenciales Predeterminadas De La Aplicación
[Aprende cómo configurar las Credenciales Predeterminadas de la Aplicación aquí.](https://cloud.google.com/docs/authentication/provide-credentials-adc?hl=es-419)

Después de configurar tus Credenciales Predeterminadas de la Aplicación (ADC), verifica que el archivo .env en la raíz de tu proyecto contenga el entorno GOOGLE_PROJECT_ID. Actualiza o confirma su valor de la siguiente manera:

```sh
GOOGLE_PROJECT_ID="reemplazar-por-el-id-de-tu-proyecto-de-gcp"
```

## Opción 2: Creación de una Clave de Cuenta de Servicio

Crea una cuenta de servicio con los roles que necesita tu aplicación, y una clave para esa cuenta de servicio, siguiendo las instrucciones en [Creación de una clave de cuenta de servicio](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating).

Después de crear una clave de cuenta de servicio, asegúrate de que el archivo .env en la raíz de tu proyecto incluya los entornos `GOOGLE_PROJECT_ID` y `GOOGLE_APPLICATION_CREDENTIALS`. Actualiza o confirma sus valores de la siguiente manera:
```sh
GOOGLE_APPLICATION_CREDENTIALS= "ruta/de/tu/claveDeCuentaDeServicio.json"
GOOGLE_PROJECT_ID= "reemplazar-por-el-id-de-tu-proyecto-de-gcp"
```

