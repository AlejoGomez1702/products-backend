# CRUD NestJS <-> Angular

### Paso 1: Preparación del Entorno

1. **Instalar Node.js y npm**: Si no lo tienes instalado, descárgalo e instálalo desde [la página oficial de Node.js](https://nodejs.org/).
   
2. **Instalar Angular CLI**: Abre tu terminal y ejecuta el siguiente comando para instalar Angular CLI de forma global:
   
   ```bash
   npm install -g @angular/cli
   ```
3. **Instalar NestJS CLI**: Igual que con Angular, instala NestJS CLI de forma global ejecutando el siguiente comando:
   ```bash
   npm install -g @nestjs/cli
   ```

### Paso 2: Creación del Proyecto Backend con NestJS

1. **Crear un nuevo proyecto**: En tu terminal, navega a la carpeta donde quieras crear tu proyecto y ejecuta el siguiente comando para crear un nuevo proyecto de NestJS:
    ```bash
   nest new products-backend
   ```
Esto creará una carpeta llamada **products-backend** con la estructura de un proyecto NestJS.

2. **Crear un módulo y un controlador de productos**: En tu terminal, navega a la carpeta recién creada (products-backend) y ejecuta el siguiente comando para generar un módulo y un controlador para productos:
    ```bash
   nest generate module products
    nest generate controller products

   ```

### Paso 3: Configuración de la Base de Datos MySQL

1. **Instalar dependencias de MySQL**: Necesitarás instalar las dependencias de MySQL para Node.js. Ejecuta el siguiente comando en la carpeta del proyecto:
    ```bash
   npm install mysql2

   ```

2. **Configurar la conexión a la base de datos**: Instalar el ORM "TypeORM" Ejecuta el siguiente comando en la carpeta del proyecto:
    ```bash
   npm install typeorm @nestjs/typeorm
    ```
3. **Configurar la conexión a la base de datos en app.module.ts**: Abre el archivo app.module.ts en la carpeta src y realiza las siguientes modificaciones:
    ```typescript
    // Importa TypeOrmModule.forRoot y la clase de configuración de TypeORM
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
    
    @Module({
      imports: [
        // Agrega TypeOrmModule.forRoot con la configuración de la conexión a la base de datos
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'mysql', // Tipo de base de datos (MySQL en este caso)
            host: 'localhost', // Host de la base de datos
            port: 3306, // Puerto de la base de datos
            username: 'tu_usuario', // Nombre de usuario de la base de datos
            password: 'tu_contraseña', // Contraseña de la base de datos
            database: 'nombre_de_tu_base_de_datos', // Nombre de la base de datos
            entities: [__dirname + '/**/*.entity{.ts,.js}'], // Ruta de las entidades de TypeORM
            synchronize: true, // Sincronizar automáticamente las entidades con la base de datos (solo en desarrollo)
          } as TypeOrmModuleOptions),
        }),
      ],
      controllers: [],
      providers: [],
    })
    export class AppModule {}
    ```

Asegúrate de reemplazar 'localhost', 'tu_usuario', 'tu_contraseña' y 'nombre_de_tu_base_de_datos' con los valores correspondientes de tu configuración de MySQL.

4. **Definir las Entidades en TypeORM**: Crea las entidades de TypeORM para tus modelos de datos. Por ejemplo, para un modelo de Product, podrías tener un archivo product.entity.ts en una carpeta products dentro de la carpeta src.
 
    ```typescript
    // product.entity.ts
    
    import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
    
    @Entity()
    export class Product {
      @PrimaryGeneratedColumn()
      id: number;
    
      @Column()
      name: string;
    
      @Column()
      price: number;
    }

    ```
 
Asegúrate de que la carpeta de entidades (entities) en la configuración de TypeORM (app.module.ts) incluya la ruta correcta donde se encuentran tus entidades.

### Paso 4: Implementación de los Servicios en el Backend

1. **Crear servicios para manejar la lógica del CRUD**: Crea un servicio para manejar la lógica del CRUD de productos. Puedes generar el servicio utilizando el CLI de NestJS:
    ```bash
   nest generate service products

   ```

Esto creará un archivo products.service.ts en la carpeta products dentro de tu proyecto NestJS.


2. **Implementar las funciones del CRUD en el servicio de productos**: Abre el archivo products.service.ts y completa las funciones para manejar las operaciones CRUD de productos.
    ```typescript
    // products.service.ts
    
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { Product } from './entities/product.entity';
    import { CreateProductDto } from './dto/create-product.dto';
    import { UpdateProductDto } from './dto/update-product.dto';
    
    @Injectable()
    export class ProductsService {
      constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
      ) {}
    
      async findAll(): Promise<Product[]> {
        return this.productRepository.find();
      }
    
      async findOne(id: number): Promise<Product> {
        return this.productRepository.findOne({ where: { id } });
      }
    
      async create(createProductDto: CreateProductDto): Promise<Product> {
        const newProduct = this.productRepository.create(createProductDto);
        return this.productRepository.save(newProduct);
      }
    
      async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
          throw new Error('Product not found');
        }
        const updatedProduct = Object.assign(product, updateProductDto);
        return this.productRepository.save(updatedProduct);
      }
    
      async remove(id: number): Promise<void> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
          throw new Error('Product not found');
        }
        await this.productRepository.remove(product);
      }
    }


   ```

En este servicio, hemos definido las funciones findAll, findOne, create, update, y remove para manejar las operaciones CRUD de productos. Estas funciones interactúan con el repositorio de productos (productRepository) para realizar operaciones en la base de datos.

3. **Crear DTOs para el CRUD de productos**: Los DTOs se utilizan para validar y transferir los datos entre el controlador y el servicio. Vamos a crear dos DTOs: CreateProductDto y UpdateProductDto.

    ```typescript
    // create-product.dto.ts

    import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
    
    export class CreateProductDto {
      @IsNotEmpty()
      @IsString()
      name: string;
    
      @IsNotEmpty()
      @IsNumber()
      price: number;
    }

   ```
   
   
   ```typescript
    // update-product.dto.ts

    import { PartialType } from '@nestjs/mapped-types';
    import { CreateProductDto } from './create-product.dto';
    
    export class UpdateProductDto extends PartialType(CreateProductDto) {}

   ```
   
   
En CreateProductDto, estamos utilizando el decorador @IsNotEmpty() para asegurarnos de que los campos name y price no estén vacíos y el decorador @IsString() para asegurarnos de que el campo name sea una cadena. Similarmente, en UpdateProductDto, estamos utilizando PartialType de @nestjs/mapped-types para permitir que los campos sean opcionales al actualizar un producto.

 También es necesario instalar **class-validator y @nestjs/mapped-types**:
 
```bash
    npm install class-validator @nestjs/mapped-types
```
    
### Paso 5:  Implementación del Controlador en el Backend

Abre el archivo products.controller.ts y completa las funciones para manejar las operaciones CRUD de productos.

```typescript
// products.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(+id);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(+id);
  }
}


   ```

En este controlador, hemos definido las funciones findAll, findOne, create, update, y remove utilizando los decoradores @Get, @Post, @Put, y @Delete para las rutas /products, /products/:id, respectivamente. Estas funciones llaman a los métodos correspondientes del servicio ProductsService.


Por ultimo configurar el archivo products.module.ts asi:


```typescript
// products.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), // Importar TypeOrmModule y proporcionar la entidad Product
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

```
    
    
