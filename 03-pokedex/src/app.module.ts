import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
   }),
    MongooseModule.forRoot('mongodb+srv://luisinho231:luisinho231@luisinho-db.yp9i8.mongodb.net/pokedex-nest'),
    PokemonModule,
    CommonModule,
    SeedModule
  ],
})
export class AppModule { }
