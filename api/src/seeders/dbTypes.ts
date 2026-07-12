// prisma/seed/dbTypes.ts
//
// Các seeder tạo Match/Group/BracketSlot/MatchEvent/PlayerStatistic cần chạy
// trong prisma.$transaction để một lần crash giữa chừng KHÔNG để lại state
// nửa vời (vd. 3 trận đã tạo trong 6 trận vòng bảng, rồi lần seed sau đọc
// existingCount=3 < 6 và tạo lặp lại 3 trận đầu vì Match.leg nullable khiến
// unique constraint không chặn được — xem ghi chú trong groupMatchSeeder.ts).
//
// DbClient cho phép cùng 1 hàm seeder nhận cả PrismaClient (gọi rời, các bước
// idempotent qua upsert) lẫn Prisma.TransactionClient (gọi trong transaction,
// các bước tạo record mới không có unique constraint đầy đủ).
import type { PrismaClient, Prisma } from "../generated/prisma/client.js";

export type DbClient = PrismaClient | Prisma.TransactionClient;