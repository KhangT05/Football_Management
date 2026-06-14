import { PrismaClient } from "../generated/prisma/client.js";

const VENUES = [
    "Sân bóng An Phú",
    "Sân bóng Bình Minh",
    "Sân bóng Thành Công",
    "Sân bóng Hoàng Gia",
    "Sân bóng Phú Mỹ",
    "Sân bóng Thanh Niên",
    "Sân bóng Đông Á",
    "Sân bóng Tây Đô",
    "Sân bóng Đại Nam",
    "Sân bóng Hòa Bình",
    "Sân bóng Victory",
    "Sân bóng Galaxy",
    "Sân bóng Dragon",
    "Sân bóng Green Field",
    "Sân bóng Golden Star",
    "Sân bóng Tân Sơn",
    "Sân bóng Long Thành",
    "Sân bóng Thống Nhất",
    "Sân bóng Minh Châu",
    "Sân bóng Kim Cương",
    "Sân bóng Blue Sky",
    "Sân bóng Red Star",
    "Sân bóng Future",
    "Sân bóng Champions",
    "Sân bóng Elite",
    "Sân bóng City Sport",
    "Sân bóng River Park",
    "Sân bóng Central",
    "Sân bóng Arena",
    "Sân bóng Pro League",
];

export async function seedVenues(db: PrismaClient): Promise<void> {
    const venues = VENUES.map((name, index) => ({
        name,
        address: `Địa chỉ ${index + 1}, TP.HCM`,
        is_active: true,
    }));

    await db.venue.createMany({
        data: venues,
        skipDuplicates: true,
    });

    console.log(`[VenueSeeder] Seeded ${venues.length} venues`);
}