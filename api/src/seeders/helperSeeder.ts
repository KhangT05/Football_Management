import { PlayerPosition } from "../generated/prisma/client.js";

export const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T>(arr: readonly T[]): T | undefined => {
    if (arr.length === 0) return undefined;

    return arr[randInt(0, arr.length - 1)];
};
// Dùng khi mảng được đảm bảo non-empty bởi business invariant
// (venue list luôn có sẵn, starters luôn đủ 11 người...).
// Throw sớm nếu invariant bị vi phạm — fail loud thay vì silent undefined leak vào DB.
export const pickOrThrow = <T>(arr: readonly T[], context: string): T => {
    const item = pick(arr);
    if (item === undefined) {
        throw new Error(`pickOrThrow: empty array — ${context}`);
    }
    return item;
};
// Phân phối bàn thắng lệch về phía thấp (giống bóng đá thật: đa số trận 0-3 bàn/đội)
export function randomGoals(): number {
    const r = Math.random();
    if (r < 0.28) return 0;
    if (r < 0.55) return 1;
    if (r < 0.78) return 2;
    if (r < 0.92) return 3;
    if (r < 0.98) return 4;
    return 5;
}

export interface SimResult {
    homeScore: number;
    awayScore: number;
    isDraw: boolean;
}

export function simulateGroupMatch(): SimResult {
    const homeScore = randomGoals();
    const awayScore = randomGoals();
    return { homeScore, awayScore, isDraw: homeScore === awayScore };
}

// Trận knockout không được hòa -> nếu hòa ở 90p thì đá thêm hiệp phụ, vẫn hòa thì luân lưu.
export interface KnockoutSimResult {
    homeScore: number;
    awayScore: number;
    wentToExtraTime: boolean;
    wentToPenalty: boolean;
    homePenalty?: number;
    awayPenalty?: number;
    winnerIsHome: boolean;
}
export const atOrThrow = <T>(arr: readonly T[], idx: number, context: string): T => {
    const item = arr[idx];
    if (item === undefined) throw new Error(`atOrThrow: out of range idx=${idx} — ${context}`);
    return item;
};
export function simulateKnockoutMatch(): KnockoutSimResult {
    let { homeScore, awayScore, isDraw } = simulateGroupMatch();
    let wentToExtraTime = false;
    let wentToPenalty = false;
    let homePenalty: number | undefined;
    let awayPenalty: number | undefined;

    if (isDraw) {
        wentToExtraTime = true;
        const etHome = randInt(0, 1);
        const etAway = randInt(0, 1);
        homeScore += etHome;
        awayScore += etAway;
        isDraw = etHome === etAway;
    }

    let winnerIsHome = homeScore > awayScore;

    if (isDraw) {
        wentToPenalty = true;
        homePenalty = randInt(3, 5);
        awayPenalty = randInt(3, 5);
        while (homePenalty === awayPenalty) awayPenalty = randInt(3, 5); // loại trực tiếp không hòa được
        winnerIsHome = homePenalty > awayPenalty;
    }

    return { homeScore, awayScore, wentToExtraTime, wentToPenalty, homePenalty, awayPenalty, winnerIsHome };
}

// ---- Sinh cầu thủ hàng loạt cho đội hình ----
const FIRST_NAMES = ["Văn", "Hữu", "Đức", "Minh", "Quang", "Anh", "Thành", "Hoàng", "Ngọc", "Thanh"];
const LAST_NAMES = [
    "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng",
    "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý",
];
const GIVEN_NAMES = [
    "An", "Bình", "Cường", "Dũng", "Duy", "Đạt", "Giang", "Hải", "Hùng", "Khang",
    "Khoa", "Lâm", "Long", "Nam", "Phong", "Phúc", "Quân", "Sơn", "Tài", "Thắng",
    "Tiến", "Trung", "Tuấn", "Việt", "Vinh",
];

export function generatePlayerName(seedIndex: number): string {
    const last = pick(LAST_NAMES);
    const mid = pick(FIRST_NAMES);
    const given = GIVEN_NAMES[seedIndex % GIVEN_NAMES.length];
    return `${last} ${mid} ${given}`;
}

export function generatePlayerEmail(teamSlug: string, seedIndex: number): string {
    return `${teamSlug}.p${String(seedIndex).padStart(2, "0")}@fifa-seed.local`;
}

export function slugifyTeamName(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "");
}

// Đội hình 23 người: 3 GK, 8 DF, 8 MF, 4 FW — tương tự danh sách đăng ký World Cup thật
export function buildSquadPositions(): PlayerPosition[] {
    const positions: PlayerPosition[] = [
        ...Array(3).fill(PlayerPosition.goalkeeper),
        ...Array(8).fill(PlayerPosition.defender),
        ...Array(8).fill(PlayerPosition.midfielder),
        ...Array(4).fill(PlayerPosition.forward),
    ];
    return positions;
}