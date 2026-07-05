import { useEffect, useMemo, useState } from 'react';

export function useRosterFilters(players) {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('number');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Reset về trang 1 mỗi khi bộ lọc thay đổi (effect, không setState lúc render)
    useEffect(() => {
        setCurrentPage(1);
    }, [search, sortField]);

    const displayed = useMemo(() => {
        return players
            .filter(
                (p) =>
                    (p.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
                    String(p.number).includes(search)
            )
            .sort((a, b) => {
                if (sortField === 'number') return (a.number ?? 0) - (b.number ?? 0);
                if (sortField === 'name') return (a.name ?? '').localeCompare(b.name ?? '');
                if (sortField === 'goals') return (b.goals ?? 0) - (a.goals ?? 0);
                return 0;
            });
    }, [players, search, sortField]);

    const totalPages = Math.ceil(displayed.length / itemsPerPage) || 1;
    const safePage = Math.min(currentPage, totalPages);
    const paginatedPlayers = displayed.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

    const handleItemsPerPageChange = (newLimit) => {
        setItemsPerPage(newLimit);
        setCurrentPage(1);
    };

    return {
        search, setSearch,
        sortField, setSortField,
        displayed, paginatedPlayers,
        currentPage: safePage, setCurrentPage,
        totalPages,
        itemsPerPage, handleItemsPerPageChange,
    };
}