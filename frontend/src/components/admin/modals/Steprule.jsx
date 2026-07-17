// import { useEffect, useRef } from 'react';
// import { useFormContext, useWatch } from 'react-hook-form';
// import {
//     Settings, LayoutGrid, Info, Check, RefreshCcw, ChevronUp, ChevronDown, X, Loader2,
// } from 'lucide-react';
// import FormField from '../../ui/FormField';
// import { INPUT } from '../../../data/data';
// import NumberField from '../ui/NumberField';
// import CustomStageBuilder from './CustomStageBuilder';
// import { useRuleTemplatesQuery } from '../../api/wizard.queries';
// import { ruleDtoToFormValues } from '../../schemas/wizard.mappers';
// import {
//     FORMAT_META, KNOCKOUT_LEG_TYPE_META, TIEBREAKER_LABELS, ALL_TIEBREAKERS,
//     getFormatMeta, clampStagesForFormat,
// } from '../../schemas/wizard.constants';
// import { defaultRuleForm, seedInitialCustomStage, type WizardFormValues } from '../../schemas/wizard.schema';

// export default function StepRule() {
//     const { control, register, setValue, getValues } = useFormContext < WizardFormValues > ();
//     const tournamentMode = useWatch({ control, name: 'tournamentMode' });
//     const existingTournamentId = useWatch({ control, name: 'existingTournamentId' });
//     const ruleMode = useWatch({ control, name: 'ruleMode' });
//     const ruleSourceId = useWatch({ control, name: 'ruleSourceId' });
//     const format = useWatch({ control, name: 'rule.format' });
//     const roundRobinStages = useWatch({ control, name: 'rule.round_robin_stages' });
//     const tiebreakerOrder = useWatch({ control, name: 'rule.tiebreaker_order' });
//     const knockoutLegType = useWatch({ control, name: 'season.knockout_leg_type' });

//     const effectiveTournamentId = tournamentMode === 'existing' ? existingTournamentId : null;
//     const { data: ruleTemplates = [], isLoading: isLoadingTemplates } = useRuleTemplatesQuery(
//         ruleMode === 'template' ? effectiveTournamentId : null,
//     );

//     // snapshot để so dirty-state khi ruleMode='template' — ref thuần, không cần global store,
//     // chỉ sống trong vòng đời step này.
//     const templateSnapshotRef = useRef < { id: string; shape: any } | null > (null);
//     const selectedTemplate = ruleTemplates.find((r: any) => String(r.id) === String(ruleSourceId)) ?? null;

//     const activeFormatMeta = getFormatMeta(format);
//     const isCustomFormat = activeFormatMeta.value === 'custom';

//     // Clamp round_robin_stages + zero-out points khi đổi format — mirror useEffect gốc.
//     useEffect(() => {
//         const meta = getFormatMeta(format);
//         if (meta.value === 'custom') {
//             const current = getValues('rule.custom_stages');
//             if (!current || current.length === 0) setValue('rule.custom_stages', seedInitialCustomStage() as any);
//             return;
//         }
//         const clamped = clampStagesForFormat(format, roundRobinStages);
//         if (clamped !== roundRobinStages) setValue('rule.round_robin_stages', clamped);
//         if (!meta.hasGroupPhase) {
//             setValue('rule.points_per_win', 0);
//             setValue('rule.points_per_draw', 0);
//             setValue('rule.points_per_loss', 0);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [format]);

//     const switchRuleMode = (mode: 'blank' | 'template') => {
//         setValue('ruleMode', mode);
//         setValue('ruleSourceId', '');
//         templateSnapshotRef.current = null;
//         setValue('rule', defaultRuleForm);
//     };

//     const applyTemplate = (rule: any) => {
//         const shape = ruleDtoToFormValues(rule);
//         setValue('ruleSourceId', String(rule.id));
//         setValue('rule', shape);
//         templateSnapshotRef.current = { id: String(rule.id), shape };
//     };

//     const clearTemplateSelection = () => {
//         setValue('ruleSourceId', '');
//         templateSnapshotRef.current = null;
//         setValue('rule', defaultRuleForm);
//     };

//     const currentRule = useWatch({ control, name: 'rule' });
//     const isTemplateDirty = ruleMode === 'template' && templateSnapshotRef.current
//         ? JSON.stringify(currentRule) !== JSON.stringify(templateSnapshotRef.current.shape)
//         : false;
//     const willCreateNewRule = ruleMode === 'blank' || (ruleMode === 'template' && isTemplateDirty);
//     const showRuleForm = ruleMode === 'blank' || (ruleMode === 'template' && !!ruleSourceId);

//     const toggleTiebreaker = (key: string) => {
//         const exists = tiebreakerOrder.includes(key);
//         setValue('rule.tiebreaker_order', exists ? tiebreakerOrder.filter(k => k !== key) : [...tiebreakerOrder, key]);
//     };
//     const moveTiebreaker = (index: number, dir: number) => {
//         const arr = [...tiebreakerOrder];
//         const target = index + dir;
//         if (target < 0 || target >= arr.length) return;
//         [arr[index], arr[target]] = [arr[target], arr[index]];
//         setValue('rule.tiebreaker_order', arr);
//     };

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in">
//             <div className="lg:col-span-2 space-y-5">
//                 <div>
//                     <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Nguồn rule</p>
//                     <div className="space-y-3">
//                         <label className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 ${ruleMode === 'blank' ? 'border-blue-500 bg-blue-500/10' : 'border-navy-light bg-navy hover:border-gray-600'}`}>
//                             <input type="radio" className="hidden" checked={ruleMode === 'blank'} onChange={() => switchRuleMode('blank')} />
//                             <Settings className={`w-6 h-6 shrink-0 ${ruleMode === 'blank' ? 'text-blue-400' : 'text-gray-500'}`} />
//                             <span className={`font-bold text-sm ${ruleMode === 'blank' ? 'text-white' : 'text-gray-400'}`}>Tạo rule mới hoàn toàn</span>
//                         </label>
//                         <label className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 ${!effectiveTournamentId ? 'opacity-40 cursor-not-allowed border-navy-light bg-navy' : ruleMode === 'template' ? 'cursor-pointer border-indigo-500 bg-indigo-500/10' : 'cursor-pointer border-navy-light bg-navy hover:border-gray-600'}`}>
//                             <input type="radio" className="hidden" checked={ruleMode === 'template'} disabled={!effectiveTournamentId} onChange={() => switchRuleMode('template')} />
//                             <LayoutGrid className={`w-6 h-6 shrink-0 ${ruleMode === 'template' ? 'text-indigo-400' : 'text-gray-500'}`} />
//                             <span className={`font-bold text-sm ${ruleMode === 'template' ? 'text-white' : 'text-gray-400'}`}>Áp từ rule template có sẵn</span>
//                         </label>
//                     </div>
//                     {!effectiveTournamentId && (
//                         <p className="text-xs text-gray-500 italic flex items-center gap-1.5 mt-2">
//                             <Info className="w-3.5 h-3.5 shrink-0" /> Giải đấu mới chưa có rule nào — chỉ tạo được rule mới.
//                         </p>
//                     )}
//                 </div>

//                 {ruleMode === 'template' && !ruleSourceId && (
//                     <div className="bg-navy-dark/50 p-3 rounded-2xl border border-navy-light space-y-2 max-h-64 overflow-y-auto">
//                         {isLoadingTemplates ? (
//                             <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
//                                 <Loader2 className="w-5 h-5 animate-spin" /> Đang tải rule template...
//                             </div>
//                         ) : ruleTemplates.length === 0 ? (
//                             <p className="text-center text-sm text-gray-500 py-8">Giải đấu này chưa có rule template nào.</p>
//                         ) : (
//                             ruleTemplates.map((rule: any) => {
//                                 const meta = getFormatMeta(rule.format);
//                                 const Icon = meta.icon;
//                                 return (
//                                     <button type="button" key={rule.id} onClick={() => applyTemplate(rule)} className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-navy-light hover:border-blue-500 transition-all text-left">
//                                         <Icon className="w-5 h-5 shrink-0 text-gray-500" />
//                                         <div className="min-w-0 flex-1">
//                                             <p className="font-bold text-sm truncate text-gray-300">{rule.name || `Rule #${rule.id}`}</p>
//                                             <p className="text-xs text-gray-500">
//                                                 {meta.label}
//                                                 {meta.value !== 'custom' && ` · ${rule.points_per_win}-${rule.points_per_draw}-${rule.points_per_loss} điểm (T-H-T)`}
//                                             </p>
//                                         </div>
//                                     </button>
//                                 );
//                             })
//                         )}
//                     </div>
//                 )}

//                 {ruleMode === 'template' && ruleSourceId && (
//                     <div className={`flex flex-col gap-2 p-3.5 rounded-xl border ${willCreateNewRule ? 'border-amber-500/40 bg-amber-500/10' : 'border-emerald-500/40 bg-emerald-500/10'}`}>
//                         <div className="flex items-start gap-2">
//                             {willCreateNewRule ? (
//                                 <>
//                                     <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
//                                     <span className="text-xs text-amber-300 flex-1">Đã chỉnh sửa — khi submit sẽ tạo <b>rule mới</b>, không đổi rule template gốc (#{selectedTemplate?.id}).</span>
//                                 </>
//                             ) : (
//                                 <>
//                                     <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
//                                     <span className="text-xs text-emerald-300 flex-1">Dùng nguyên bản rule <b>#{selectedTemplate?.id} — {selectedTemplate?.name}</b>, không tạo rule mới.</span>
//                                 </>
//                             )}
//                         </div>
//                         <button type="button" onClick={clearTemplateSelection} className="self-start text-xs text-gray-400 hover:text-white flex items-center gap-1">
//                             <RefreshCcw className="w-3.5 h-3.5" /> Đổi template
//                         </button>
//                     </div>
//                 )}

//                 {showRuleForm && (
//                     <div>
//                         <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Thể thức thi đấu</p>
//                         <div className="space-y-2.5">
//                             {FORMAT_META.map(f => {
//                                 const Icon = f.icon;
//                                 const active = format === f.value;
//                                 return (
//                                     <label key={f.value} className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 ${active ? `border-${f.color}-500 bg-${f.color}-500/10` : 'border-navy-light bg-navy hover:border-gray-600'}`}>
//                                         <input type="radio" className="hidden" checked={active} onChange={() => setValue('rule.format', f.value)} />
//                                         <Icon className={`w-6 h-6 shrink-0 ${active ? `text-${f.color}-400` : 'text-gray-500'}`} />
//                                         <div className="min-w-0">
//                                             <span className={`font-bold text-sm block ${active ? 'text-white' : 'text-gray-400'}`}>{f.label}</span>
//                                             <p className="text-[11px] text-gray-500 leading-snug">{f.desc}</p>
//                                         </div>
//                                     </label>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {showRuleForm && (
//                 <div className="lg:col-span-3 bg-navy-dark/50 p-5 rounded-2xl border border-navy-light space-y-5 lg:max-h-[560px] lg:overflow-y-auto">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <FormField label="Tên rule" required>
//                             <input className={INPUT} {...register('rule.name')} placeholder="VD: Luật chuẩn 2026" />
//                         </FormField>

//                         {isCustomFormat ? (
//                             <div className="flex items-end pb-2.5">
//                                 <p className="text-xs text-gray-500 italic flex items-center gap-1.5">
//                                     <Info className="w-3.5 h-3.5 shrink-0" /> Cấu trúc vòng đấu do các stage bên dưới quyết định.
//                                 </p>
//                             </div>
//                         ) : (activeFormatMeta.stagesMode === 'min1' || activeFormatMeta.stagesMode === 'min2') ? (
//                             <NumberField name="rule.round_robin_stages" label="Số vòng bảng liên tiếp" required min={activeFormatMeta.stagesMode === 'min2' ? 2 : 1} />
//                         ) : (
//                             <div className="flex items-end pb-2.5">
//                                 <p className="text-xs text-gray-500 italic flex items-center gap-1.5">
//                                     <Info className="w-3.5 h-3.5 shrink-0" /> round_robin_stages cố định = {roundRobinStages} (BE bắt buộc).
//                                 </p>
//                             </div>
//                         )}
//                     </div>

//                     {!isCustomFormat && (
//                         <div>
//                             <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Điểm số</p>
//                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                                 <NumberField name="rule.points_per_win" label="Điểm Thắng" required min={0} max={10} />
//                                 <NumberField name="rule.points_per_draw" label="Điểm Hòa" required min={0} max={10} />
//                                 <NumberField name="rule.points_per_loss" label="Điểm Thua" required min={0} max={10} />
//                             </div>
//                         </div>
//                     )}

//                     <div>
//                         <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Đội hình & xử thua</p>
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                             <NumberField name="rule.max_players_per_team" label="Số người tối đa / đội" required min={1} max={50} />
//                             <NumberField name="rule.min_players_per_team" label="Số người tối thiểu" required min={1} max={50} />
//                             <NumberField name="rule.forfeit_score" label="Điểm xử thua" required min={0} max={20} />
//                         </div>
//                     </div>

//                     {!isCustomFormat && activeFormatMeta.hasKnockout && (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             {activeFormatMeta.hasGroupPhase && (
//                                 <NumberField name="rule.teams_advance_per_group" label="Số đội đi tiếp / bảng" required min={1} />
//                             )}
//                             <FormField label="Thể thức sân đấu (Knockout)" required>
//                                 <select className={INPUT} {...register('season.knockout_leg_type')}>
//                                     {KNOCKOUT_LEG_TYPE_META.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
//                                 </select>
//                             </FormField>
//                         </div>
//                     )}

//                     <div>
//                         <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Kỷ luật</p>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <NumberField name="rule.yellow_cards_suspension" label="Thẻ vàng tích lũy / treo giò" required min={1} />
//                             <NumberField name="rule.suspension_match_count" label="Số trận bị treo giò" required min={1} />
//                             <NumberField name="rule.fine_per_yellow_card" label="Phạt tiền / thẻ vàng" min={0} allowDecimal />
//                             <NumberField name="rule.fine_per_red_card" label="Phạt tiền / thẻ đỏ" min={0} allowDecimal />
//                         </div>
//                     </div>

//                     <div>
//                         <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Thưởng</p>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <NumberField name="rule.bonus_per_goal" label="Thưởng / bàn thắng" min={0} allowDecimal />
//                             <NumberField name="rule.bonus_per_assist" label="Thưởng / kiến tạo" min={0} allowDecimal />
//                         </div>
//                     </div>

//                     {!isCustomFormat && activeFormatMeta.hasGroupPhase && (
//                         <div>
//                             <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
//                                 Tiêu chí xếp hạng phụ <span className="text-red-400">*</span>
//                             </p>
//                             <div className="space-y-2">
//                                 {tiebreakerOrder.map((key, idx) => (
//                                     <div key={key} className="flex items-center gap-2 bg-navy border border-navy-light rounded-lg px-3 py-2">
//                                         <span className="text-xs font-mono text-gray-500 w-4">{idx + 1}</span>
//                                         <span className="text-sm text-white flex-1">{TIEBREAKER_LABELS[key] ?? key}</span>
//                                         <button type="button" onClick={() => moveTiebreaker(idx, -1)} disabled={idx === 0} className="text-gray-400 hover:text-white disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
//                                         <button type="button" onClick={() => moveTiebreaker(idx, 1)} disabled={idx === tiebreakerOrder.length - 1} className="text-gray-400 hover:text-white disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
//                                         <button type="button" onClick={() => toggleTiebreaker(key)} className="text-gray-500 hover:text-red-400"><X className="w-4 h-4" /></button>
//                                     </div>
//                                 ))}
//                                 {ALL_TIEBREAKERS.filter(k => !tiebreakerOrder.includes(k)).length > 0 && (
//                                     <div className="flex flex-wrap gap-2 pt-1">
//                                         {ALL_TIEBREAKERS.filter(k => !tiebreakerOrder.includes(k)).map(k => (
//                                             <button key={k} type="button" onClick={() => toggleTiebreaker(k)} className="text-xs px-2.5 py-1 rounded-full border border-dashed border-navy-light text-gray-400 hover:text-white hover:border-blue-500">
//                                                 + {TIEBREAKER_LABELS[k]}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {isCustomFormat && <CustomStageBuilder />}
//                 </div>
//             )}
//         </div>
//     );
// }