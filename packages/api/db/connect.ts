import { PrismaClient } from '@prisma/client'

let client: PrismaClient | null = null

export default function connect() {
  client = client ?? new PrismaClient()

  return client
}
