export type GroupLetter = string;
export declare const GROUP_COUNT = 8;
export declare const TEAMS_PER_GROUP = 4;
export declare const TOTAL_TEAMS: number;
export declare const GROUP_LETTERS: GroupLetter[];
/** Sinh danh sách chữ cái bảng A, B, C... theo groupCount tuỳ ý (không phụ thuộc GROUP_COUNT cố định). */
export declare function generateGroupLetters(groupCount: number): GroupLetter[];
export declare function generateTeamNames(count?: number): string[];
/**
 * Sinh subset tên đội bắt đầu từ offset trong CITY_POOL — dùng khi nhiều
 * giải/mùa cần dùng các tập đội KHÁC NHAU (thay vì luôn lấy count đội đầu
 * tiên của pool như generateTeamNames()) để dữ liệu đa dạng hơn giữa các
 * giải, đồng thời vẫn cho phép các đội trùng nhau một phần (giống bóng đá
 * thật: 1 CLB có thể tham gia nhiều giải khác nhau).
 */
export declare function generateTeamNamesFromOffset(count: number, offset: number): string[];
export declare function generateGroups(teamNames: string[], groupCount?: number): Record<GroupLetter, string[]>;
export declare function generateRoundOf16Template(letters: GroupLetter[]): [GroupLetter, GroupLetter][];
export declare function generateCrossPairingForTwoGroups(letters: [GroupLetter, GroupLetter]): [GroupLetter, GroupLetter][];
export interface VenueSeed {
    name: string;
    address: string;
}
export declare function generateVenues(count?: number): VenueSeed[];
//# sourceMappingURL=teamGenerator.d.ts.map