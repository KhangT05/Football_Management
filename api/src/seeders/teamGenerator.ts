// Thay worldcup.ts — sinh procedural, generalize theo GROUP_COUNT/TEAMS_PER_GROUP
// thay vì hardcode danh sách đội World Cup 2022.
//
// FIX (multi-tournament seeding): các hằng số GROUP_COUNT/TEAMS_PER_GROUP/
// TOTAL_TEAMS trước đây cố định 8/4/32, khiến toàn bộ pipeline chỉ seed
// được ĐÚNG 1 giải cỡ 32 đội. Giờ mọi hàm generate nhận tham số tường minh
// (groupCount, teamsPerGroup) với default = hằng số cũ để 100% tương thích
// ngược với code gọi không truyền tham số. CITY_POOL cũng được mở rộng để
// đủ tên cho nhiều giải/mùa dùng đội khác nhau cùng lúc (dù thực tế các
// giải vẫn có thể tái sử dụng chung 1 pool đội như bóng đá thật).

export type GroupLetter = string;

export const GROUP_COUNT = 8;
export const TEAMS_PER_GROUP = 4;
export const TOTAL_TEAMS = GROUP_COUNT * TEAMS_PER_GROUP; // 32

export const GROUP_LETTERS: GroupLetter[] = Array.from({ length: GROUP_COUNT }, (_, i) =>
    String.fromCharCode(65 + i)
);

/** Sinh danh sách chữ cái bảng A, B, C... theo groupCount tuỳ ý (không phụ thuộc GROUP_COUNT cố định). */
export function generateGroupLetters(groupCount: number): GroupLetter[] {
    if (groupCount <= 0) throw new Error(`generateGroupLetters: groupCount phải > 0, nhận ${groupCount}`);
    return Array.from({ length: groupCount }, (_, i) => String.fromCharCode(65 + i));
}

const CITY_POOL = [
    "Sài Gòn", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Huế", "Nha Trang", "Vũng Tàu",
    "Quy Nhơn", "Biên Hòa", "Long An", "Đà Lạt", "Buôn Ma Thuột", "Vinh", "Thanh Hóa", "Nam Định",
    "Bắc Ninh", "Hạ Long", "Rạch Giá", "Phan Thiết", "Pleiku", "Sóc Trăng", "Tây Ninh", "Bến Tre",
    "Cà Mau", "Kon Tum", "Lào Cai", "Yên Bái", "Việt Trì", "Thái Nguyên", "Quảng Ngãi", "Đồng Hới",
    // NEW — mở rộng thêm cho nhu cầu nhiều giải/mùa chạy song song
    "Móng Cái", "Sầm Sơn", "Tam Kỳ", "Bảo Lộc", "Châu Đốc", "Hà Tĩnh", "Phú Quốc", "Điện Biên",
];

export function generateTeamNames(count = TOTAL_TEAMS): string[] {
    if (count > CITY_POOL.length) {
        throw new Error(`generateTeamNames: cần ${count} tên nhưng pool chỉ có ${CITY_POOL.length} — thêm city vào CITY_POOL`);
    }
    // Deterministic (không random) — để idempotency guard/reseed logic so theo tên
    // không bị lệch giữa các lần chạy seed.
    return CITY_POOL.slice(0, count).map((city) => `CLB ${city}`);
}

/**
 * Sinh subset tên đội bắt đầu từ offset trong CITY_POOL — dùng khi nhiều
 * giải/mùa cần dùng các tập đội KHÁC NHAU (thay vì luôn lấy count đội đầu
 * tiên của pool như generateTeamNames()) để dữ liệu đa dạng hơn giữa các
 * giải, đồng thời vẫn cho phép các đội trùng nhau một phần (giống bóng đá
 * thật: 1 CLB có thể tham gia nhiều giải khác nhau).
 */
export function generateTeamNamesFromOffset(count: number, offset: number): string[] {
    const pool = [...CITY_POOL, ...CITY_POOL.map((c) => `${c} B`)]; // nhân đôi pool cho subset lệch offset lớn
    if (offset + count > pool.length) {
        throw new Error(
            `generateTeamNamesFromOffset: offset=${offset} + count=${count} vượt quá pool (${pool.length}) — thêm city vào CITY_POOL`
        );
    }
    return pool.slice(offset, offset + count).map((city) => `CLB ${city}`);
}

export function generateGroups(teamNames: string[], groupCount = GROUP_COUNT): Record<GroupLetter, string[]> {
    const teamsPerGroup = TEAMS_PER_GROUP;
    const expectedTotal = groupCount * teamsPerGroup;
    if (teamNames.length !== expectedTotal) {
        throw new Error(`generateGroups: cần đúng ${expectedTotal} đội (${groupCount} bảng x ${teamsPerGroup}), nhận ${teamNames.length}`);
    }
    const letters = generateGroupLetters(groupCount);
    const groups = {} as Record<GroupLetter, string[]>;
    letters.forEach((letter, i) => {
        groups[letter] = teamNames.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);
    });
    return groups;
}

// Cross-pairing chuẩn World Cup, generalize theo block 4 bảng liên tiếp:
// (W,X,Y,Z) -> 1W-2X, 1Y-2Z, 1Z-2Y, 1X-2W. Yêu cầu GROUP_COUNT chia hết cho 4.
export function generateRoundOf16Template(letters: GroupLetter[]): [GroupLetter, GroupLetter][] {
    if (letters.length % 4 !== 0) {
        throw new Error(`generateRoundOf16Template: GROUP_COUNT=${letters.length} phải chia hết cho 4`);
    }
    const pairs: [GroupLetter, GroupLetter][] = [];
    for (let i = 0; i < letters.length; i += 4) {
        const block = letters.slice(i, i + 4);
        const [w, x, y, z] = block as [GroupLetter, GroupLetter, GroupLetter, GroupLetter];
        pairs.push([w, x], [y, z], [z, y], [x, w]);
    }
    return pairs;
}

// NEW: cross-pairing cho trường hợp 2 bảng (bracketSize=4, không chia hết cho 4
// theo công thức trên) — chỉ cần 1W-2X, 1X-2W.
export function generateCrossPairingForTwoGroups(letters: [GroupLetter, GroupLetter]): [GroupLetter, GroupLetter][] {
    const [w, x] = letters;
    return [[w, x], [x, w]];
}

export interface VenueSeed {
    name: string;
    address: string;
}

const VENUE_POOL: VenueSeed[] = [
    { name: "Sân vận động Thống Nhất", address: "TP.HCM" },
    { name: "Sân vận động Mỹ Đình", address: "Hà Nội" },
    { name: "Sân Hòa Xuân", address: "Đà Nẵng" },
    { name: "Sân Cẩm Phả", address: "Quảng Ninh" },
    { name: "Sân Thiên Trường", address: "Nam Định" },
    { name: "Sân Lạch Tray", address: "Hải Phòng" },
    { name: "Sân Gò Đậu", address: "Bình Dương" },
    { name: "Sân Cần Thơ", address: "Cần Thơ" },
    // NEW — thêm venue cho nhiều giải chạy song song
    { name: "Sân Thanh Hóa", address: "Thanh Hóa" },
    { name: "Sân Vinh", address: "Nghệ An" },
];

export function generateVenues(count = VENUE_POOL.length): VenueSeed[] {
    if (count > VENUE_POOL.length) {
        throw new Error(`generateVenues: cần ${count} venue nhưng pool chỉ có ${VENUE_POOL.length}`);
    }
    return VENUE_POOL.slice(0, count);
}