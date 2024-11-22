// structures/entitlements.ts

export enum EntitlementType {
    PURCHASE = 1,
    PREMIUM_SUBSCRIPTION = 2,
    DEVELOPER_GIFT = 3,
    TEST_MODE_PURCHASE = 4,
    FREE_PURCHASE = 5,
    USER_GIFT = 6,
    PREMIUM_PURCHASE = 7,
    APPLICATION_SUBSCRIPTION = 8,
}

export interface Entitlement {
    id: string;
    sku_id: string;
    application_id: string;
    user_id?: string;
    type: EntitlementType;
    deleted: boolean;
    starts_at?: string;
    ends_at?: string;
    guild_id?: string;
    consumed?: boolean;
}
