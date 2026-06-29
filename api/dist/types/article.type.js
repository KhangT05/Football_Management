export const ARTICLE_FULL_INCLUDE = {
    include: {
        tags: true,
        media: { orderBy: { order: "asc" } },
        user: { select: { id: true, name: true } },
    },
};
export const ARTICLE_LIST_INCLUDE = {
    include: {
        tags: true,
        user: { select: { id: true, name: true } },
    },
};
export const ARTICLE_BASE_WHERE = { is_active: true, deleted_at: null };
//# sourceMappingURL=article.type.js.map