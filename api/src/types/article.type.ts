import { Article, ArticleMedia, ArticleTag } from "../generated/prisma/client.js";

// ─── SafeArticle — full detail với relations ──────────────────────────────────

export type SafeArticle = Article & {
    tags: ArticleTag[];
    media: ArticleMedia[];
    user: { id: number; name: string };
};

// ─── ArticleListItem — list view, bỏ content nặng ────────────────────────────

export type ArticleListItem = Omit<Article, "content"> & {
    tags: ArticleTag[];
    user: { id: number; name: string };
};

// ─── Query ────────────────────────────────────────────────────────────────────

export interface ArticleQueryRequest {
    page?: number;
    per_page?: number;
    q?: string;
    sort?: string;
    direction?: "asc" | "desc";
    status?: string;
    season_id?: number;
    match_id?: number;
    team_id?: number;
    user_id?: number;
    tag?: string;
}

export const ARTICLE_FULL_INCLUDE = {
    include: {
        tags: true,
        media: { orderBy: { order: "asc" as const } },
        user: { select: { id: true, name: true } },
    },
} as const;

export const ARTICLE_LIST_INCLUDE = {
    include: {
        tags: true,
        user: { select: { id: true, name: true } },
    },
} as const;

export const ARTICLE_BASE_WHERE = { is_active: true, deleted_at: null };