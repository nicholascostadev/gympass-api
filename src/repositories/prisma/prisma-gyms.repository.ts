import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms.repository'
import { db } from '~/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await db.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const gyms = await db.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${params.userLatitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${params.userLongitude}) ) + sin( radians(${params.userLatitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }

  async searchMany(query: string, page: number) {
    const gyms = await db.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await db.gym.create({
      data,
    })

    return gym
  }
}
