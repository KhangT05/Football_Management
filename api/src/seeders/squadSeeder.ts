import bcrypt from "bcrypt";
import { PrismaClient, PlayerPosition, PlayerRole } from "../generated/prisma/client.js";
import { buildSquadPositions, generatePlayerEmail, generatePlayerName, slugifyTeamName } from "./helperSeeder.js";

const BCRYPT_ROUNDS = 12;
const SQUAD_SIZE = 23;
const DEFAULT_PASSWORD = "Player@123456";

/**
 * Sinh đội hình cho TẤT CẢ team trong teamIdByName.
 *
 * existingPlayerIds: danh sách player_id "thật" (từ seedPlayersFromExistingUsers)
 * chưa được gán vào team nào — sẽ được ưu tiên nhét vào các team đầu tiên trước
 * khi sinh thêm player giả để lấp đầy 23 người/đội. Cách này thoả đúng yêu cầu
 * "player tự link sang user" mà không tạo trùng Player cho user đã có sẵn.
 */
export async function seedSquads(
  db: PrismaClient,
  teamIdByName: Record<string, number>,
  existingPlayerIds: number[] = []
): Promise<void> {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
  const teamEntries = Object.entries(teamIdByName);

  // hàng đợi player thật chưa gán team, dùng dần cho các đội đầu tiên
  const realPlayerQueue = [...existingPlayerIds];

  let globalSeedIndex = 1;

  for (const [teamName, teamId] of teamEntries) {
    const positions = buildSquadPositions();
    const slug = slugifyTeamName(teamName);

    // đã có cầu thủ nào trong team này chưa (chạy seed lại thì không tạo trùng)
    const alreadyCount = await db.teamPlayer.count({ where: { team_id: teamId } });
    if (alreadyCount >= SQUAD_SIZE) continue;

    let jersey = alreadyCount + 1;
    const slotsToFill = SQUAD_SIZE - alreadyCount;

    for (let i = 0; i < slotsToFill; i++) {
      const idx = (jersey - 1) % positions.length;
      const position = positions[idx];
      if (!position) {
        throw new Error(`squadSeeder: positions rỗng hoặc index out of range (idx=${idx})`);
      }
      const role: PlayerRole =
        jersey === 1 ? PlayerRole.captain : jersey === 2 ? PlayerRole.vice_captain : PlayerRole.player;

      let playerId: number;

      const realPlayerId = realPlayerQueue.shift();
      if (realPlayerId) {
        // gán player thật (đã link user có sẵn) vào đội này
        playerId = realPlayerId;
        await db.player.update({ where: { id: playerId }, data: { position } });
      } else {
        const email = generatePlayerEmail(slug, globalSeedIndex);
        const name = generatePlayerName(globalSeedIndex);
        globalSeedIndex++;

        const user = await db.user.upsert({
          where: { email },
          update: {},
          create: {
            name,
            email,
            password: passwordHash,
            email_verified: true,
            email_verified_at: new Date(),
          },
        });

        const player = await db.player.upsert({
          where: { user_id: user.id },
          update: {},
          create: {
            user_id: user.id,
            date_of_birth: new Date(2000, 0, 1),
            position,
            nationality: teamName,
          },
        });
        playerId = player.id;
      }

      await db.teamPlayer.upsert({
        where: { team_id_jersey_number: { team_id: teamId, jersey_number: jersey } },
        update: {},
        create: {
          team_id: teamId,
          player_id: playerId,
          jersey_number: jersey,
          position,
          role,
          status: "active",
          approval_status: "approved",
        },
      });

      jersey++;
    }

    console.log(`[SquadSeeder] ${teamName}: đủ ${SQUAD_SIZE} cầu thủ`);
  }
}
