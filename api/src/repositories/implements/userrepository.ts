// import { PrismaClient } from "@prisma/client";
// import { BaseRepository } from "./baserepository.js";
// import { User } from "../../generated/prisma/client.js";
// import { UserCreateInput, UserUpdateInput } from "../../generated/prisma/models/User.js";

// export class UserRepository extends BaseRepository<
//     User,
//     UserCreateInput,
//     UserUpdateInput
// > {
//     constructor(prisma: PrismaClient) {
//         super(prisma.user, user, "User");
//     }

//     findBySeasonId(seasonId: number): Promise<User[]> {
//         return this.model.findMany({ where: { seasonId, deletedAt: null } });
//     }
// }