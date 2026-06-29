import { SeasonTeamJersey } from "../generated/prisma/client.js";

export type SafeSeasonTeamJersey = SeasonTeamJersey;

export const JERSEY_SELECT = {
    id: true,
    type: true,
    primary_color: true,
    secondary_color: true,
    image_url: true,
} as const;