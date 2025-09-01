import { Brand } from '../../brands/entities/brand.entity'
import { v7 as uuidv7 } from 'uuid'

export const BRANDS_SEED: Brand[] = [
  {
    id: uuidv7(),
    name: 'Honda',
    createAt: new Date().getTime()
  },
  {
    id: uuidv7(),
    name: 'Jeep',
    createAt: new Date().getTime()
  },
  {
    id: uuidv7(),
    name: 'Tesla',
    createAt: new Date().getTime()
  },
]
