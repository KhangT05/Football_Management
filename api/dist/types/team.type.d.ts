export declare const USER_SELECT: {
    readonly select: {
        readonly id: true;
        readonly name: true;
        readonly email: true;
        readonly phone: true;
    };
};
export declare const TEAM_WITH_OWNER: {
    readonly include: {
        readonly user: {
            readonly select: {
                readonly id: true;
                readonly name: true;
                readonly email: true;
                readonly phone: true;
            };
        };
    };
};
export declare const CAPTAIN_WITH_USER: {
    readonly include: {
        readonly user: {
            readonly select: {
                readonly id: true;
                readonly name: true;
                readonly email: true;
                readonly phone: true;
            };
        };
    };
};
//# sourceMappingURL=team.type.d.ts.map