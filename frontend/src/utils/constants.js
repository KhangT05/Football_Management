/**
 * ============================================================
 * Shared Constants & Helpers
 * ============================================================
 * Tập trung các hằng số và hàm tiện ích dùng chung
 * để tránh copy-paste giữa nhiều component/page.
 */

// ── Avatar color palette ──────────────────────────────────────
export const AVATAR_COLORS = [
  'from-blue-600 to-indigo-600',
  'from-purple-600 to-violet-700',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
  'from-red-600 to-rose-800',
  'from-indigo-600 to-blue-800',
  'from-lime-500 to-green-600',
];

// ── Get initials from name ────────────────────────────────────
export const getInitials = (name) =>
  name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?';

// ── Position labels (full) ────────────────────────────────────
export const POSITION_LABELS = {
  GK: 'Thủ môn',
  DEF: 'Hậu vệ',
  MID: 'Tiền vệ',
  FW: 'Tiền đạo',
};

// ── Position labels (short / abbreviated) ─────────────────────
export const POSITION_LABELS_SHORT = {
  GK: 'TM',
  DEF: 'HV',
  MID: 'TV',
  FW: 'TĐ',
};

// ── Position options for forms ────────────────────────────────
export const POSITION_OPTIONS = [
  { value: 'GK', label: 'GK – Thủ môn' },
  { value: 'DEF', label: 'DEF – Hậu vệ' },
  { value: 'MID', label: 'MID – Tiền vệ' },
  { value: 'FW', label: 'FW – Tiền đạo' },
];
