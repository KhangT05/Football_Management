export const GROUP_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
// Mỗi bảng đúng 4 đội, thứ tự index = seed position trong bảng (không ảnh hưởng logic).
export const WORLD_CUP_GROUPS = {
    A: ["Qatar", "Ecuador", "Senegal", "Netherlands"],
    B: ["England", "Iran", "USA", "Wales"],
    C: ["Argentina", "Saudi Arabia", "Mexico", "Poland"],
    D: ["France", "Australia", "Denmark", "Tunisia"],
    E: ["Spain", "Costa Rica", "Germany", "Japan"],
    F: ["Belgium", "Canada", "Morocco", "Croatia"],
    G: ["Brazil", "Serbia", "Switzerland", "Cameroon"],
    H: ["Portugal", "Ghana", "Uruguay", "South Korea"],
};
// Cặp đấu vòng 1/8 (Round of 16) theo đúng khuôn bracket chuẩn của World Cup:
// mỗi cặp là [nhất bảng X, nhì bảng Y].
export const ROUND_OF_16_TEMPLATE = [
    ["A", "B"], // 1A vs 2B
    ["C", "D"], // 1C vs 2D
    ["D", "C"], // 1D vs 2C
    ["B", "A"], // 1B vs 2A
    ["E", "F"], // 1E vs 2F
    ["G", "H"], // 1G vs 2H
    ["F", "E"], // 1F vs 2E
    ["H", "G"], // 1H vs 2G
];
export const VENUES = [
    { name: "Lusail Stadium", address: "Lusail, Qatar" },
    { name: "Al Bayt Stadium", address: "Al Khor, Qatar" },
    { name: "Ahmad bin Ali Stadium", address: "Al Rayyan, Qatar" },
    { name: "Al Thumama Stadium", address: "Doha, Qatar" },
    { name: "Education City Stadium", address: "Al Rayyan, Qatar" },
    { name: "Khalifa International Stadium", address: "Doha, Qatar" },
    { name: "Stadium 974", address: "Doha, Qatar" },
    { name: "Al Janoub Stadium", address: "Al Wakrah, Qatar" },
];
export const ALL_TEAM_NAMES = GROUP_LETTERS.flatMap((g) => WORLD_CUP_GROUPS[g]);
//# sourceMappingURL=worldcup.js.map