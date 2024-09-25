Documentación del Proyecto
Índice

    Introducción
    Requisitos Previos
    Instalación
    Configuración
    Uso
    Estructura del Proyecto
    Licencia

Introducción

Este proyecto es un bot desarrollado en Node.js con TypeScript que se conecta a Meta a través de un webhook. El bot está diseñado para contestar y filtrar mensajes tambien se encarga de volver archivo a blob para guardarlos a la api.

Requisitos Previos

    Node.js v18.19.1
    npm v18.19.1
    Cuenta de Meta con permisos para configurar webhooks
    https://developers.facebook.com/

Instalación

 1. Clona el repositorio: 
  
    git clone https://github.com/Artag-Chris/whatsappbot
    cd tu-repositorio

 2. Instala las dependencias:

    npm install

Configuración

 1. renombra al archivo .env.template en .env y configura las variables de entorno

 2. Configura el webhook en tu cuenta de Meta para que apunte a la URL de tu servidor.

Uso

Para iniciar el bot, ejecuta el siguiente comando:

 npm run dev
 
 aun no se ha creado la build de producción 
 
Estructura del Proyecto 

 ├── src
 │   ├── app.ts                 # Punto de entrada del bot
 │   ├── config.ts                # Configuración del bot 
          └──classes                # maneja las clases dependiendo del tipo del mensaje
          └──envs                   # adapta las variables de entorno 
          └──interfaces             # interfaces para el tipado extricto de typescript
          └──keywords               # filtrado de palabras para transferencia del bot
          └──multer                 # configuracion de multer aun no implementada
          └──url                    # urls que usa el bot para notificar a la api
          └──websocket              # configuracion del websocket
 │   ├── functions                # funciones que usa el bot
 │   ├── presentation             # servicios del bot // services: logica del bot
 │        └──services                # Utilidades y funciones auxiliares
         └──whatsapp      
             └──bot.controller      # controladores del bot
 ├── .env                       # Variables de entorno
 ├── package.json               # Dependencias y scripts del proyecto
 └── tsconfig.json              # Configuración de TypeScript

Licencia
pendiente
