export declare const REFRESH_TTL_SEC: number;
export interface RefreshSession {
    user_id: number;
    csrfToken: string;
}
export declare const sessionStore: {
    set(uuid: string, session: RefreshSession): Promise<void>;
    get(uuid: string): Promise<RefreshSession | null>;
    del(uuid: string): Promise<void>;
    /**
   * Atomic GET + DELETE cho refresh token rotation.
   * Dùng GETDEL (Redis >= 6.2) để tránh race window giữa GET và DEL.
   * Nếu hai request gửi cùng lúc với cùng token, chỉ một cái nhận được session.
   */
    getAndDelete(uuid: string): Promise<RefreshSession | null>;
};
/**
 * Fallback về DB nếu Redis lỗi — tránh outage lan sang auth layer.
 * Thundering herd không handle ở đây vì TTL 120s + role change ít thường xuyên.
 * Nếu cần: dùng external lock (SET NX) hoặc single-flight pattern.
 */
export declare function getUserRoles(user_id: number): Promise<string[]>;
export declare function invalidateUserRoles(user_id: number): Promise<void>;
//# sourceMappingURL=session.d.ts.map