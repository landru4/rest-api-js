# rest-api-js
# API REST desarrollada en node.js con adonis y sqlite3.

Ejercicio: API REST que expone la siguiente información que es solicitada: 
  1. Información de los clientes. 
  2. Dinero que los clientes cobraron y el dinero que van a cobrar. 
  3. Transacciones de los clientes.

Instalación, requisitos e instrucciones:

1. Es neceario tener instalado: postman, node.js, npm.
2. Descargar el código contenido en este repositorio.
3. Entrar en la carpeta 'rest-api-adonis'.
4. Abrir una consola en la carpeta del proyecto y ejecutar el comando para instalar los paquetes necesarios: 'npm i'
5. Luego de tener instalado adonis y sqlite3, para crear la base de datos con las tablas correspondientes, ejecutar lo siguiente: 'adonis migration:run'
  Sobre migration: https://legacy.adonisjs.com/docs/4.0/migrations
5. Para levantar la solucion ejecutar: 'adonis serve --dev'.
  Debería verse algo así:
  > Watching files for changes...
  > info: serving app on http://127.0.0.1:333
6. Abrir el archivo con la collección de peticiones de Postaman: 'PruebasAPI.postman_collection.json' y seguir las instrucciones indicadas en el archvo 'Documentacion API.pdf', ambos archivos localizados en la raíz del repositorio.
