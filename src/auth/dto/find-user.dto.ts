import { Role } from "@prisma/client"
import { UUID } from "node:crypto"

const Sexe = {
  M: 'M',
  F: 'F'
}


export type FindUserDtoField = {
  id?: UUID
  username?: string
  email?: string
  role?: Role
  sexe?: typeof Sexe[keyof typeof Sexe]
} 