# Marketplace con Mercado Pago y NodeJS

## Deploy

Para testear todas las funcionalidades de la aplicación debemos hacer el despliegue. Lo podemos hacer en un VPS o en una plataforma como <a href="https://render.com">Render</a>.

Lo mejor es hacer un fork del repositorio, o clonar el código y subirlo a Github. Pero antes modifica el archivo *src/config.js* de acuerdo a tus país y preferencias. En el campo *thisApplicationURL* debes especificar la URL donde estará hosteada la aplicación. Por ejemplo si usas Render, quedará algo así: https://mi-aplicacion.onrender.com. Para el campo *frontendApplicationURL*, la URL de la aplicación cliente o, igual a *thisApplicationURL*.

Seguido creamos una base de datos PostgreSQL en Render, versión >= 14.
Una vez creada la instancia, buscamos las credenciales para conectarnos y las guardamos.

Luego creamos un servidor o *Web Service* y le indicamos el repositorio donde está el código de la aplicación. En el formulario para la creación de la instancia, en el campo *Build Command*, ponemos *npm install*.

Creada la instancia, accedemos a las variables de entorno, en la sección *Environment*, y establecemos las variables para la base de datos y demás. (Ver **.env**).

Una vez la actualización de las variables de entorno se haya realizado, hacemos una petición *GET* al endpoint */dbSchemeSeed* y posteriormente a */dbDataSeed*. Esto creará las tablas e insertará datos para poder probar la aplicación.

También es importante establecer adecuadamente el campo *redirect_uri* en la aplicación de Mercado Pago.

## .env

En el caso de que se quiera montar la aplicación en local, primero hay que copiar y pegar el archivo *.env.example*, renombrarlo a *.env* y reemplazar las variables.

Por otro lado si se hace un despliegue en cualquier plataforma, basta con establecer las variables en las configuraciones de la aplicación. En este caso, al inicio se debería establecer también *N_ENV='development'*, para que los endpoints que crean la estructura de la base de datos estén disponibles, luego de eso se elimina.

**LOGIN_SECRET**: Cualquier clave secreta, solo es necesaria para la creación de JWT tokens.
<br/>**DB_PASS**: Contraseña de la base de datos PostgreSQL.
<br/>**DB_USER**: Usuario de la bdd.
<br/>**DB_HOST**: Host, por defecto *localhost*.
<br/>**DB_NAME**: Nombre de la bdd, por defecto *mercadopago_marketplace*.
<br/>**MP_APP_ID**: Identificador de la aplicación Mercado Pago.
<br/>**MP_ACCESS_TOKEN**: Access Token.
<br/>**MP_CLIENT_SECRET**: Client Secret.
<br/>**N_ENV**: Por defecto *development*, se elimina en producción.

## Endpoints

### [POST] /login

Puedes usar el correo *test1@gmail.com* y la contraseña 123 (Para todos los correos).
La respuesta incluirá un token JWT, que posteriormente se debe usar en los headers.

Body:

~~~js
{
    "email": "test1@gmail.com",
    "password": "123"
}
~~~

Response:

~~~js
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk2ODc1ODk2LCJleHAiOjE2OTY4OTc0OTZ9.kW3LPpmHjVi3W4ARe53bGfr9hAOtaeOhDUSsNz3sZ3Q" // JWT TOKEN
}
~~~

### [GET] /getOAuthLink

Devuelve el link con el que un usuario puede otorgar acceso a información privada de su cuenta, a nuestra aplicación.

Headers:

~~~js
{
    "Content-Type": "application/json",
    "Authorization": "Bearer [JWT TOKEN DE UN VENDEDOR]"
}
~~~

Response: 

~~~js
{
    "success": true,
    "password": "https://auth.mercadopago.com/authorization?client_id=[MP_APP_ID]&response_type=code&platform_id=mp&state=[state]&redirect_uri=[redirectUrl]"
}
~~~

### [GET] /OAuthResult

Recibe por query params: *code* (Código para obtener credenciales) y *state* (Identificador aleatorio). Obtiene las credenciales del usuario y las guarda en la base de datos.

### [GET] /getProducts

Devuelve una lista de productos.

Response:

~~~js
{
    "success": true,
    "products": [
        {
            "id": 1,
            "name": "Product1",
            "description": "Lorem description",
            "price": 1300,
            "seller_id": 1,
            "created_at": "2023-10-09T19:22:21.647Z"
        }
        // ...
    ]
}
~~~

### [POST] /getPreferenceLink

Crea una preferencia con los datos de un producto y devuelve un link con el que un usuario puede realizar el pago.

Headers:

~~~js
{
    "Content-Type": "application/json",
    "Authorization": "Bearer [JWT TOKEN DE UN CLIENTE]"
}
~~~

Body:

~~~js
{
    "productId": 1,
    "quantity": 2
}
~~~

Response:

~~~js
{
    "success": true,
    "link": // Init point 
}
~~~

### [GET] /getPreferences

Devuelve las preferencias creadas. 

Headers:

~~~js
{
    "Content-Type": "application/json",
    "Authorization": "Bearer [JWT TOKEN DE UN VENDEDOR]"
}
~~~

Response:

~~~js
{
    "success": true,
    "preferences": // Array de preferencias
}
~~~

### [POST] /notifications

Función a implementar.

Response: 

~~~js
{
    "success": true
}
~~~

### [GET] /dbSchemeSeed

Para crear las tablas de la base de datos.

Response:

~~~js
{
    "success": true
}
~~~

### [GET] /dbDataSeed

Para insertar datos de prueba en la base de datos.

Response:

~~~js
{
    "success": true
}
~~~
<hr/>
<br/>
<a href="https://medium.com/@luc4sfur7ado/marketplace-con-mercado-pago-y-nodejs-9d82e2218b5c">Link al artículo</a> en el que explico el funcionamiento de un Marketplace con Mercado Pago.
