import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Info, Plus, Trash2 } from 'lucide-react';
import FormField from '../../ui/FormField';
import { INPUT } from '../../../data/data';
import NumberField from '../../ui/Numberfield';
import useToastStore from '../../../store/toastStore';
import { STAGE_TYPE_META, SEED_MODE_META, newCid } from '../../../schemas/wizard.constants';
import { createDefaultStage } from '../../../schemas/wizard.schema';

export default function CustomStageBuilder() {
    const toast = useToastStore();
    const { control, register } = useFormContext();
    const { fields, append, remove, update } = useFieldArray({ control, name: 'rule.custom_stages' });
    const stages = useWatch({ control, name: 'rule.custom_stages' });

    const addStage = (type) => {
        if (type === 'classification' && fields.length === 0) {
            toast.warning('Tranh hạng không thể là stage đầu tiên — cần có nguồn đội từ stage trước.');
            return;
        }
        const sameTypeCount = stages.filter(s => s.type === type).length;
        const lastStage = stages[stages.length - 1] ?? null;
        append(createDefaultStage(type, newCid(), lastStage ? lastStage._cid : null, sameTypeCount));
    };

    // Xóa bất kỳ stage nào — nếu stage khác đang trỏ nguồn vào nó, gỡ nguồn của chúng về
    // null/'standing' và cảnh báo user chọn lại, tránh tham chiếu treo (_cid không tồn tại).
    const removeStage = (index) => {
        if (fields.length <= 1) { toast.warning('Phải có ít nhất 1 stage.'); return; }
        const removed = stages[index];
        let cascaded = 0;
        stages.forEach((s, i) => {
            if (i !== index && s.source_stage_cid === removed._cid) {
                cascaded++;
                update(i, {
                    ...s,
                    source_stage_cid: null,
                    ...(s.type === 'round_robin' ? { source_rank_range: null } : {}),
                    ...(s.type === 'classification' ? { source_kind: 'standing' } : {}),
                });
            }
        });
        remove(index);
        if (cascaded > 0) {
            toast.warning(`Đã xóa "${removed.name}" — ${cascaded} stage phụ thuộc vào nó đã bị gỡ nguồn, vui lòng chọn lại.`);
        }
    };

    const updateSource = (index, sourceCid) => {
        const s = stages[index];
        const patch = { source_stage_cid: sourceCid };
        if (s.type === 'round_robin') patch.source_rank_range = sourceCid ? [1, s.teams_advance_per_group || 1] : null;
        if (s.type === 'classification') patch.source_kind = 'standing';
        update(index, { ...s, ...patch });
    };

    return (
        <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Pipeline vòng đấu <span className="text-red-400">*</span>
            </p>
            <p className="text-[11px] text-gray-500 italic mb-3 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                Mỗi stage tự chọn nguồn đội (bất kỳ stage nào đứng trước, không bắt buộc liền kề). Xóa/sửa được stage bất kỳ.
            </p>

            <div className="space-y-3">
                {fields.map((field, index) => {
                    const stage = stages[index];
                    if (!stage) return null;
                    const typeLabel = STAGE_TYPE_META.find(t => t.value === stage.type)?.label ?? stage.type;
                    const priorStages = stages.filter((_, i) => i < index);
                    const sourceStage = stages.find(s => s._cid === stage.source_stage_cid) ?? null;

                    return (
                        <div key={field.id} className="bg-navy border border-navy-light rounded-2xl p-4 space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-xs font-bold flex items-center justify-center shrink-0">
                                        {index + 1}
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-300">{typeLabel}</span>
                                </div>
                                {fields.length > 1 && (
                                    <button type="button" onClick={() => removeStage(index)} className="text-gray-500 hover:text-red-400 flex items-center gap-1 text-xs">
                                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                                    </button>
                                )}
                            </div>

                            <FormField label="Tên stage" required>
                                <input className={INPUT} {...register(`rule.custom_stages.${index}.name`)} placeholder="VD: Vòng bảng, Bán kết, Tranh hạng 3" />
                            </FormField>

                            {index > 0 && (
                                <FormField label={stage.type === 'round_robin' ? 'Nguồn đội (tùy chọn)' : 'Nguồn đội'} required={stage.type !== 'round_robin'}>
                                    <select
                                        className={INPUT}
                                        value={stage.source_stage_cid ?? ''}
                                        onChange={(e) => updateSource(index, e.target.value || null)}
                                    >
                                        {stage.type === 'round_robin' && <option value="">— Pool đăng ký mới (độc lập) —</option>}
                                        {stage.type !== 'round_robin' && <option value="" disabled>-- chọn stage nguồn --</option>}
                                        {priorStages.map(s => <option key={s._cid} value={s._cid}>{s.name}</option>)}
                                    </select>
                                </FormField>
                            )}
                            {index === 0 && stage.type === 'knockout' && (
                                <p className="text-[11px] text-gray-500 italic flex items-center gap-1.5">
                                    <Info className="w-3.5 h-3.5 shrink-0" />
                                    Bốc thăm trực tiếp từ danh sách đội đã duyệt — không qua vòng bảng nào trước.
                                </p>
                            )}

                            {stage.type === 'round_robin' && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <NumberField name={`rule.custom_stages.${index}.group_count`} label="Số bảng" required min={1} max={32} />
                                        <NumberField name={`rule.custom_stages.${index}.teams_advance_per_group`} label="Số đội đi tiếp / bảng" required min={1} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <NumberField name={`rule.custom_stages.${index}.points_per_win`} label="Điểm Thắng" required min={0} />
                                        <NumberField name={`rule.custom_stages.${index}.points_per_draw`} label="Điểm Hòa" required min={0} />
                                        <NumberField name={`rule.custom_stages.${index}.points_per_loss`} label="Điểm Thua" required min={0} />
                                    </div>

                                    {stage.source_stage_cid && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <NumberField name={`rule.custom_stages.${index}.source_rank_range.0`} label="Lấy đội từ hạng" required min={1} />
                                            <NumberField name={`rule.custom_stages.${index}.source_rank_range.1`} label="Đến hạng" required min={1} />
                                            {sourceStage?.type === 'round_robin' && (
                                                <p className="col-span-2 text-[11px] text-gray-500 italic flex items-center gap-1.5">
                                                    <Info className="w-3.5 h-3.5 shrink-0" />
                                                    Ví dụ [1,1] = chỉ lấy đội hạng 1 mỗi bảng của "{sourceStage.name}" (tối đa {sourceStage.teams_advance_per_group}).
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {stage.type === 'knockout' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField label="Cách bốc thăm" required>
                                        <select className={INPUT} {...register(`rule.custom_stages.${index}.seed_mode`)}>
                                            {SEED_MODE_META.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                        </select>
                                    </FormField>
                                    {/* <FormField label="Thể thức sân đấu" required>
                                        <select className={INPUT} {...register(`rule.custom_stages.${index}.leg_type`)}>
                                            {KNOCKOUT_LEG_TYPE_META.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                                        </select>
                                    </FormField> */}
                                </div>
                            )}

                            {stage.type === 'classification' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField label="Nguồn đội (loại)" required>
                                        <select className={INPUT} {...register(`rule.custom_stages.${index}.source_kind`)} disabled={sourceStage?.type !== 'knockout'}>
                                            <option value="standing">Theo bảng xếp hạng</option>
                                            <option value="loser_of_stage" disabled={sourceStage?.type !== 'knockout'}>Đội thua ở stage nguồn</option>
                                        </select>
                                    </FormField>
                                    {/* <FormField label="Thể thức sân đấu" required>
                                        <select className={INPUT} {...register(`rule.custom_stages.${index}.leg_type`)}>
                                            {KNOCKOUT_LEG_TYPE_META.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                                        </select>
                                    </FormField> */}
                                    {sourceStage?.type !== 'knockout' && (
                                        <p className="sm:col-span-2 text-[11px] text-gray-500 italic flex items-center gap-1.5">
                                            <Info className="w-3.5 h-3.5 shrink-0" />
                                            "Đội thua ở stage nguồn" chỉ dùng được khi stage nguồn đang chọn là Loại trực tiếp.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
                <button type="button" onClick={() => addStage('round_robin')} className="text-xs px-3 py-1.5 rounded-lg border border-dashed border-navy-light text-gray-400 hover:text-white hover:border-blue-500 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Vòng bảng
                </button>
                <button type="button" onClick={() => addStage('knockout')} className="text-xs px-3 py-1.5 rounded-lg border border-dashed border-navy-light text-gray-400 hover:text-white hover:border-blue-500 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Loại trực tiếp
                </button>
                <button type="button" onClick={() => addStage('classification')} className="text-xs px-3 py-1.5 rounded-lg border border-dashed border-navy-light text-gray-400 hover:text-white hover:border-blue-500 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Tranh hạng
                </button>
            </div>
        </div>
    );
}