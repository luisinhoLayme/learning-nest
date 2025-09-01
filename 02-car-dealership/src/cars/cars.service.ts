import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v7 as uuidv7 } from 'uuid'
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {

  private cars: Car[] = [
    // {
    //   id: uuidv7(),
    //   brand: 'Toyota',
    //   model: 'Corolla'
    // },
  ]

  findAll() {
    return this.cars
  }

  findById(id: string) {
    const car = this.cars.find(car => car.id === id)
    if (!car) throw new NotFoundException(`Car with id '${ id }' not found`)

    return {...car }
  }

  create( createCarDto: CreateCarDto ) {
    const newCar: Car = {id: uuidv7(), ...createCarDto}
    this.cars.push(newCar)

    return newCar
  }

  update( id: string, updateCarDto: UpdateCarDto ) {
    let carDB = this.findById(id)

    if ( updateCarDto.id && updateCarDto.id !== id )
      throw new BadRequestException('Car id is not valid inside body')

    this.cars = this.cars.map(car => {
      if (car.id === id) {
        carDB = { ...carDB, ...updateCarDto, id }
        return carDB
      }
      return car
    })

  return carDB
  }

  delete (id: string) {
    this.findById( id )
    this.cars = this.cars.filter(car => car.id !== id)

    return { msg: 'Car delete successfully.' }
  }

  fillCarsWithSeedData( cars: Car[] ) {
    this.cars = cars
  }
}
