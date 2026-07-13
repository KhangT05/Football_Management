export type GroupLetter = string;
export declare const GROUP_COUNT = 8;
export declare const TEAMS_PER_GROUP = 4;
export declare const TOTAL_TEAMS: number;
export declare const GROUP_LETTERS: GroupLetter[];
export declare function generateTeamNames(count?: number): string[];
export declare function generateGroups(teamNames: string[]): Record<GroupLetter, string[]>;
export declare function generateRoundOf16Template(letters: GroupLetter[]): [GroupLetter, GroupLetter][];
export interface VenueSeed {
    name: string;
    address: string;
}
export declare function generateVenues(count?: number): VenueSeed[];
//# sourceMappingURL=teamGenerator.d.ts.map