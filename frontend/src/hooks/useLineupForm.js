// hooks/useLineupForm.js
import { useEffect, useMemo } from 'react';
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

    useEffect(() => {
        if (!lineupData) return;
        const byId = new Map(lineupData.map(l => [String(l.player_id), l]));
        form.reset({
            players: defaultPlayers.map(p => {
                const existing = byId.get(String(p.player_id));
                return existing
                    ? { ...p, lineup_type: existing.lineup_type, is_captain: !!existing.is_captain }
                    : p;
            }),
        });
    }, [lineupData]);

    return { form };
}