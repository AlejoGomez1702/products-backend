import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

// Importa TypeOrmModule.forRoot y la clase de configuración de TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

@Module({
  imports: [
    ProductsModule,
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
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
