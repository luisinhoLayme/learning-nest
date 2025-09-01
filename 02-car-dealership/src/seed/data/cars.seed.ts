import { Car } from '../../cars/interfaces/car.interface'
import { v7 as uuidv7 } from 'uuid'

export const CARS_SEED: Car[] = [
  {
    id: uuidv7(),
    brand: 'Toyota',
    model: 'Corolla'
  },
  {
    id: uuidv7(),
    brand: 'Honda',
    model: 'Civic'
  },
  {
    id: uuidv7(),
    brand: 'Jeep',
    model: 'Cherock'
  },
]
