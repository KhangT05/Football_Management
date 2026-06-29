import { Article, ArticleMedia, ArticleTag } from "../generated/prisma/client.js";
export type SafeArticle = Article & {
    tags: ArticleTag[];
    media: ArticleMedia[];
    user: {
        id: number;
        name: string;
    };
};
export type ArticleListItem = Omit<Article, "content"> & {
    tags: ArticleTag[];
    user: {
        id: number;
        name: string;
    };
};
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
export declare const ARTICLE_FULL_INCLUDE: {
    readonly include: {
        readonly tags: true;
        readonly media: {
            readonly orderBy: {
                readonly order: "asc";
            };
        };
        readonly user: {
            readonly select: {
                readonly id: true;
                readonly name: true;
            };
        };
    };
};
export declare const ARTICLE_LIST_INCLUDE: {
    readonly include: {
        readonly tags: true;
        readonly user: {
            readonly select: {
                readonly id: true;
                readonly name: true;
            };
        };
    };
};
export declare const ARTICLE_BASE_WHERE: {
    is_active: boolean;
    deleted_at: null;
};
//# sourceMappingURL=article.type.d.ts.map