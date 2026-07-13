// prisma/seed/teamGenerator.ts
// Thay worldcup.ts — sinh procedural, generalize theo GROUP_COUNT/TEAMS_PER_GROUP
// thay vì hardcode danh sách đội World Cup 2022.
export const GROUP_COUNT = 8;
export const TEAMS_PER_GROUP = 4;
export const TOTAL_TEAMS = GROUP_COUNT * TEAMS_PER_GROUP; // 32
export const GROUP_LETTERS = Array.from({ length: GROUP_COUNT }, (_, i) => String.fromCharCode(65 + i));
const CITY_POOL = [
    "Sài Gòn", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Huế", "Nha Trang", "Vũng Tàu",
    "Quy Nhơn", "Biên Hòa", "Long An", "Đà Lạt", "Buôn Ma Thuột", "Vinh", "Thanh Hóa", "Nam Định",
    "Bắc Ninh", "Hạ Long", "Rạch Giá", "Phan Thiết", "Pleiku", "Sóc Trăng", "Tây Ninh", "Bến Tre",
    "Cà Mau", "Kon Tum", "Lào Cai", "Yên Bái", "Việt Trì", "Thái Nguyên", "Quảng Ngãi", "Đồng Hới",
];
export function generateTeamNames(count = TOTAL_TEAMS) {
    if (count > CITY_POOL.length) {
        throw new Error(`generateTeamNames: cần ${count} tên nhưng pool chỉ có ${CITY_POOL.length} — thêm city vào CITY_POOL`);
    }
    // Deterministic (không random) — để idempotency guard/reseed logic so theo tên
    // không bị lệch giữa các lần chạy seed.
    return CITY_POOL.slice(0, count).map((city) => `CLB ${city}`);
}
export function generateGroups(teamNames) {
    if (teamNames.length !== TOTAL_TEAMS) {
        throw new Error(`generateGroups: cần đúng ${TOTAL_TEAMS} đội, nhận ${teamNames.length}`);
    }
    const groups = {};
    GROUP_LETTERS.forEach((letter, i) => {
        groups[letter] = teamNames.slice(i * TEAMS_PER_GROUP, (i + 1) * TEAMS_PER_GROUP);
    });
    return groups;
}
// Cross-pairing chuẩn World Cup, generalize theo block 4 bảng liên tiếp:
// (W,X,Y,Z) -> 1W-2X, 1Y-2Z, 1Z-2Y, 1X-2W. Yêu cầu GROUP_COUNT chia hết cho 4.
export function generateRoundOf16Template(letters) {
    if (letters.length % 4 !== 0) {
        throw new Error(`generateRoundOf16Template: GROUP_COUNT=${letters.length} phải chia hết cho 4`);
    }
    const pairs = [];
    for (let i = 0; i < letters.length; i += 4) {
        const block = letters.slice(i, i + 4);
        const [w, x, y, z] = block;
        pairs.push([w, x], [y, z], [z, y], [x, w]);
    }
    return pairs;
}
const VENUE_POOL = [
    { name: "Sân vận động Thống Nhất", address: "TP.HCM" },
    { name: "Sân vận động Mỹ Đình", address: "Hà Nội" },
    { name: "Sân Hòa Xuân", address: "Đà Nẵng" },
    { name: "Sân Cẩm Phả", address: "Quảng Ninh" },
    { name: "Sân Thiên Trường", address: "Nam Định" },
    { name: "Sân Lạch Tray", address: "Hải Phòng" },
    { name: "Sân Gò Đậu", address: "Bình Dương" },
    { name: "Sân Cần Thơ", address: "Cần Thơ" },
];
export function generateVenues(count = VENUE_POOL.length) {
    if (count > VENUE_POOL.length) {
        throw new Error(`generateVenues: cần ${count} venue nhưng pool chỉ có ${VENUE_POOL.length}`);
    }
    return VENUE_POOL.slice(0, count);
}
//# sourceMappingURL=teamGenerator.js.map