export interface BaseEntity {
    id: number;
    isActive: boolean;
    created_at: Date;
    updated_at: Date | null;
}
export interface AuditableEntity extends BaseEntity {
    createdBy: number | null;
    updatedBy: number | null;
    deletedAt: Date | null;
    deletedBy: number | null;
    isDeleted: boolean;
}