# Proyecto FullStack - Proceso de Pago E-commerce

Este proyecto es una aplicación fullstack desarrollada como parte de un test de desarrollo, simulando un flujo de compra de productos con integración de pagos a través de un procesador de pagos. La aplicación permite a los usuarios ver productos, añadirlos al carrito, ingresar datos de pago y envío, ver un resumen y completar (simuladamente usando modo de pruebas) la transacción.

- El frontend es accesible a través de https://payment-gateway-project-frontend.vercel.app/
- El backend es accesible a través de https://payment-gateway-project-backend.vercel.app/api/v1/

## Tabla de Contenidos

-   [Descripción General](#descripción-general)
-   [Flujo de la Aplicación](#flujo-de-la-aplicación)
-   [Características](#características)
-   [Tecnologías Utilizadas](#tecnologías-utilizadas)
-   [Requisitos Previos](#requisitos-previos)
-   [Instalación y Configuración](#instalación-y-configuración)
-   [Ejecución del Proyecto](#ejecución-del-proyecto)
-   [Documentación de la API](#documentación-de-la-api)
-   [Diseño de la Base de Datos](#diseño-de-la-base-de-datos)
-   [Despliegue](#despliegue)
-   [Estructura del Proyecto](#estructura-del-proyecto)
-   [Consideraciones Adicionales](#consideraciones-adicionales)

## Descripción General

La aplicación implementa un proceso de onboarding de 5 pasos para la compra de un producto:

1.  **Página de Productos:** Muestra los productos disponibles con descripción, precio y stock.
2.  **Información de Pago y Envío:** Un modal solicita datos de tarjeta de crédito (ficticios) y dirección de entrega.
3.  **Resumen del Pago:** Muestra el desglose del costo (producto, tarifa base, envío) antes de confirmar.
4.  **Procesamiento y Estado Final:** Se crea una transacción PENDING, se actualiza el stock, se llama a la API de pago (Payment Gateway Sandbox). Una vez se actualice el estado de la transacción, el procesador de pagos envía un evento a la API y se actualiza el estado internamente, y, en caso de fallo, el stock del producto vuelve a la normalidad.
5.  **Página de Producto Actualizada:** Redirecciona a una vista con información de la transacción, y es posible volver a la página de productos mostrando el stock actualizado.

## Flujo de la Aplicación

`Página de Productos` -> `Modal (Info Tarjeta/Envío)` -> `Backdrop (Resumen)` -> `Procesando...` -> `Estado final del pago` -> `Página de Productos (Stock Actualizado)`

## Características

* Visualización de catálogo de productos con stock en tiempo real.
* Filtrado de productos por categoría.
* Carrito de compras funcional (añadir, incrementar, decrementar, eliminar).
* Formulario de pago con validación de tarjeta de crédito/débito.
* Formulario para datos de envío.
* Resumen detallado del pago antes de la confirmación.
* Integración con API backend para gestionar transacciones y stock.
* Integración con API del Payment Gateway (En modo pruebas) para procesar pagos.
* Actualización del estado de la transacción y stock post-pago.
* Notificación del resultado de la transacción al usuario (Redireccionado una vez finalizado el pago).

## Tecnologías Utilizadas

* **Frontend:**
    * Framework/Librería: React.js
    * Manejo de Estado: Redux Toolkit
    * Lenguaje: TypeScript
    * Estilos: Tailwind CSS
    * Build Tool: Vite
    * Testing: Jest
* **Backend:**
    * Framework: Nest.js
    * Lenguaje: /TypeScript
    * Arquitectura: Hexagonal + ROP
    * ORM: Prisma
    * Testing: Jest
* **Base de Datos:**
    * PostgreSQL
* **Despliegue:**
    * Para fines de practicidad y facilidad se realizó el despliegue de frontend y backend en Vercel (por este motivo se envía carpeta dist/ en backend al repositorio). La base de datos se encuentra en Supabase.
    * Es posible desplegar en AWS, Azure, GCP, servidores linux directamente, entre otra opciones.

## Requisitos Previos

* Node.js (v18 o superior recomendado)
* npm
* En caso de desplegar en local, se requiere Docker y Docker Compose.

## Instalación y Configuración

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/jfcatano/payment-gateway-project
    cd payment-gateway-project
    ```

2.  **Instala dependencias del Frontend:**
    ```bash
    # Navega al directorio del frontend si es necesario (ej: cd frontend)
    npm install
    ```

3.  **Instala dependencias del Backend:**
    ```bash
    # Navega al directorio del backend si es necesario (ej: cd backend)
    npm install
    ```

4.  **Configura las variables de entorno:**
    * **Frontend:** Crea un archivo `.env` en el directorio raíz del frontend basado en el archivo `.env.example`:
        ```env
        VITE_PAYMENT_GATEWAY_PUBLIC_KEY=
        VITE_PAYMENT_GATEWAY_REDIRECT_URL=http://localhost:5173/payment-success
        VITE_API_URL=http://localhost:3000/api
        # Las variables de entorno predeterminadas ya se encuentran en .env.example, debe añadirse manualmente todas las keys por motivos de seguridad.
        ```
    * **Backend:** Crea un archivo `.env` en el directorio raíz del backend basado en el archivo `.env.example`. Asegúrate de incluir:
        ```env
        DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fullstack_test?schema=public
        PAYMENT_GATEWAY_API_URL=url_de_api_sandbox_del_payment_gateway
        PAYMENT_GATEWAY_PUBLIC_KEY=
        PAYMENT_GATEWAY_PRIVATE_KEY=
        PAYMENT_GATEWAY_EVENTS_KEY=
        PAYMENT_GATEWAY_INTEGRITY_KEY=
        # Las variables de entorno predeterminadas ya se encuentran en .env.example, debe añadirse manualmente todas las keys por motivos de seguridad.
        ```

5.  **Configura la Base de Datos:**
    * Asegúrate de que tu instancia de base de datos (PostgreSQL) esté corriendo (Solo si iniciarás sin Docker).
    * Ejecuta las migraciones de Prisma. (ej: `npx prisma migrate dev`)
    * Ejecuta el script de seeding para poblar la base de datos con productos de prueba:
        ```bash
        # Navega al directorio del backend si es necesario
        npm run seed
        ```

## Ejecución del Proyecto

* **Inicia todo el proyecto usando Docker**
    ```bash
    # Navega al directorio raíz si es necesario
    docker compose up -d
    # Posteriormente ejecuta las migraciones de prisma y el seed de datos
    npx prisma migrate dev
    npm run seed
    ```
    La API debería estar disponible en `http://localhost:3000` y la aplicación web en `http://localhost:5173`.

1.  **Inicia el Backend (sin Docker):**
    ```bash
    # Navega al directorio del backend
    npm run start:dev
    ```
    La API debería estar disponible en `http://localhost:3000`.

2.  **Inicia el Frontend (sin Docker):**
    ```bash
    # Navega al directorio del frontend
    npm run dev
    ```
    La aplicación debería estar disponible en `http://localhost:5173`.

## Documentación de la API

La documentación detallada de los endpoints de la API se encuentra disponible en:

* **Documentación aún no disponible.**

La API incluye endpoints para gestionar:
* Productos (creación y lectura)
* Transacciones (creación y lectura)

## Diseño de la Base de Datos

* **Definiciones de Modelos (Prisma):**
    ```prisma
    model Product {
    id                 String               @id @default(uuid())
    name               String
    description        String
    price              Float
    stock              Int
    imageUrl           String?
    createdAt          DateTime             @default(now())
    updatedAt          DateTime             @updatedAt
    TransactionProduct TransactionProduct[]
    }

    model Customer {
    id           String        @id @default(uuid())
    name         String
    email        String        @unique
    addressLine1 String
    addressLine2 String?
    city         String
    country      String
    postalCode   String?
    createdAt    DateTime      @default(now())
    updatedAt    DateTime      @updatedAt
    transactions Transaction[]
    }

    model Transaction {
    id                   String            @id @default(uuid())
    internal_reference   String            @unique @default(uuid())
    transaction_id       String?           @unique
    status               TransactionStatus @default(PENDING)
    amount               Float
    base_fee             Float
    delivery_fee         Float 
    payment_method_token String?
    procesor_response    Json?
    error_message        String?

    customer_id String
    customer    Customer @relation(fields: [customer_id], references: [id])

    createdAt           DateTime             @default(now())
    updatedAt           DateTime             @updatedAt
    transactionProducts TransactionProduct[]
    }

    model TransactionProduct {
    id                Int    @id @default(autoincrement())
    transaction_id    String
    product_id        String
    name              String
    price             Float
    quantity          Int
    stock_at_purchase Int?

    transaction Transaction @relation(fields: [transaction_id], references: [id])
    products    Product     @relation(fields: [product_id], references: [id])
    }

    enum TransactionStatus {
    PENDING
    APPROVED
    DECLINED
    ERROR
    }
    ```

* **Modelos y Relaciones**

- Un **Customer** puede tener múltiples **Transaction**s.
- Una **Transaction** puede tener múltiples **TransactionProduct**s.
- Cada **TransactionProduct** guarda una copia del nombre, precio y cantidad del producto comprado.
