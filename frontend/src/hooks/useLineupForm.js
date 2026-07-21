// hooks/useLineupForm.js
import { useEffect, useMemo, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildLineupFormSchema } from '../schemas/lineup.schema';
import { mapPosition } from '../utils/position';

export function useLineupForm({ roster, squadLimit, lineupData }) {
    const schema = useMemo(() => buildLineupFormSchema(squadLimit), [squadLimit]);

    const defaultPlayers = useMemo(() => roster.map(p => ({
        player_id: p.player_id,
        name: p.name,
        jersey_number: parseInt(p.jersey_number, 10) || 1,
        position: mapPosition(p.position),
        lineup_type: 'none',
        is_captain: false,
    })), [roster]);

    const form = useForm({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: { players: defaultPlayers },
    });

    useFieldArray({ control: form.control, name: 'players' }); // giữ để RHF track array identity

    // FIX (roster/lineup race condition): trước đây effect chỉ depend vào
    // [lineupData]. Khi lineupData (thường rỗng cho match mới, resolve
    // NHANH vì BE không có gì để trả) resolve TRƯỚC khi roster (round-trip
    // khác, có thể chậm hơn) load xong, effect chạy đúng 1 lần với
    // `defaultPlayers` vẫn đang là closure rỗng (roster=[] lúc đó) -> form
    // reset ra players:[] vĩnh viễn. roster load xong sau đó, defaultPlayers
    // tính lại đúng (useMemo theo roster) nhưng effect KHÔNG chạy lại vì
    // lineupData không đổi nữa -> players kẹt rỗng dù roster.length > 0.
    //
    // Sửa: theo dõi cả defaultPlayers (tức cả roster) lẫn lineupData. Dùng
    // ref để tránh reset lặp vô ích khi cả 2 tham chiếu đổi nhưng nội dung
    // hiệu quả giống lần trước (vd lineupData vẫn là mảng rỗng mới nhưng
    // roster cũng chưa đổi gì) — so sánh theo JSON là đủ rẻ cho form size
    // roster tối đa 20 cầu thủ/team, không cần deep-equal library.
    const lastAppliedKey = useRef(null);

    useEffect(() => {
        // Chưa có roster thật (đang loading hoặc rỗng thật sự) — không reset,
        // tránh ghi đè players đang có bằng mảng rỗng khi query đang pending.
        if (defaultPlayers.length === 0) return;

        const byId = new Map((lineupData ?? []).map(l => [String(l.player_id), l]));
        const nextPlayers = defaultPlayers.map(p => {
            const existing = byId.get(String(p.player_id));
            return existing
                ? { ...p, lineup_type: existing.lineup_type, is_captain: !!existing.is_captain }
                : p;
        });

        const key = JSON.stringify(nextPlayers);
        if (key === lastAppliedKey.current) return; // tránh reset thừa, giữ dirty state của user nếu không có gì đổi
        lastAppliedKey.current = key;

        form.reset({ players: nextPlayers });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultPlayers, lineupData]);

    return { form };
}