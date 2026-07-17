// import { useFormContext, useWatch } from 'react-hook-form';
// import { Info } from 'lucide-react';
// import FormField from '../../ui/FormField';
// import { INPUT } from '../../../data/data';
// import NumberField from '../ui/NumberField';
// import useToastStore from '../../../store/toastStore';
// import { PITCH_TYPE_META, addDaysStr, todayStr } from '../../schemas/wizard.constants';
// import { getFormatMeta } from '../../schemas/wizard.constants';
// import type { WizardFormValues } from '../../schemas/wizard.schema';

// export default function StepSeason() {
//     const toast = useToastStore();
//     const { control, register, setValue } = useFormContext < WizardFormValues > ();
//     const startDate = useWatch({ control, name: 'season.start_date' });
//     const endDate = useWatch({ control, name: 'season.end_date' });
//     const registrationDeadline = useWatch({ control, name: 'season.registration_deadline' });
//     const isRegistrationOpen = useWatch({ control, name: 'season.is_registration_open' });
//     const format = useWatch({ control, name: 'rule.format' });

//     const todayMin = todayStr();
//     // Mốc hạn đăng ký muộn nhất được phép chọn = 1 ngày trước ngày bắt đầu. input date "max"
//     // là inclusive, để nguyên start_date thì user vẫn chọn trùng ngày được -> trừ 1 ngày.
//     const maxRegistrationDate = startDate ? addDaysStr(startDate, -1) : undefined;

//     // Đổi ngày bắt đầu -> tự dọn các ngày phụ thuộc nếu không còn hợp lệ, tránh next qua
//     // step cuối rồi mới bị validate chặn lại.
//     const handleStartDateChange = (value: string) => {
//         setValue('season.start_date', value);
//         if (value && endDate && endDate < value) {
//             setValue('season.end_date', '');
//             toast.warning('Ngày kết thúc đã bị xóa vì trước ngày bắt đầu mới, vui lòng chọn lại.');
//         }
//         if (value && registrationDeadline && registrationDeadline >= value) {
//             setValue('season.registration_deadline', '');
//             toast.warning('Hạn đăng ký đã bị xóa vì trùng hoặc sau ngày bắt đầu mới, vui lòng chọn lại.');
//         }
//     };

//     const handleRegistrationDeadlineChange = (value: string) => {
//         if (value && startDate && value >= startDate) {
//             toast.warning('Hạn đăng ký phải trước ngày bắt đầu, không được trùng ngày.');
//             return;
//         }
//         if (value && value < todayMin) {
//             toast.warning('Hạn đăng ký không được ở quá khứ.');
//             return;
//         }
//         setValue('season.registration_deadline', value);
//     };

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
//             <div className="lg:col-span-2 bg-navy-dark/50 p-5 rounded-2xl border border-navy-light space-y-4">
//                 <FormField label="Tên mùa giải" required>
//                     <input className={INPUT} {...register('season.name')} placeholder="VD: Season 2026 - Mùa Hè" />
//                 </FormField>
//                 <FormField label="Loại sân thi đấu" required>
//                     <select className={INPUT} {...register('season.pitch_type')}>
//                         {PITCH_TYPE_META.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
//                     </select>
//                 </FormField>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <FormField label="Ngày bắt đầu" required>
//                         <input type="date" min={todayMin} className={INPUT} value={startDate} onChange={e => handleStartDateChange(e.target.value)} />
//                     </FormField>
//                     <FormField label="Ngày kết thúc" required>
//                         <input type="date" min={startDate || todayMin} className={INPUT} value={endDate} onChange={e => setValue('season.end_date', e.target.value)} />
//                     </FormField>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <NumberField name="season.max_teams" label="Số đội tối đa" required min={2} />
//                     <FormField label="Hạn chót đăng ký" required>
//                         <input type="date" min={todayMin} max={maxRegistrationDate} className={INPUT} value={registrationDeadline} onChange={e => handleRegistrationDeadlineChange(e.target.value)} />
//                     </FormField>
//                 </div>
//                 {startDate && (
//                     <p className="text-xs text-gray-500 italic flex items-center gap-1.5">
//                         <Info className="w-3.5 h-3.5 shrink-0" /> Hạn chót đăng ký phải trước ngày bắt đầu (chậm nhất là {maxRegistrationDate}), không được trùng ngày.
//                     </p>
//                 )}
//             </div>

//             <div className="space-y-4">
//                 <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-2 text-xs text-blue-300">
//                     <Info className="w-4 h-4 shrink-0 mt-0.5" />
//                     <span>Season sẽ thi đấu theo thể thức: <span className="font-bold">{getFormatMeta(format).label}</span></span>
//                 </div>
//                 <div className="bg-navy-dark/50 p-4 rounded-2xl border border-navy-light">
//                     <label className="flex items-center cursor-pointer gap-3">
//                         <div className="relative shrink-0">
//                             <input type="checkbox" className="sr-only peer" checked={isRegistrationOpen} onChange={e => setValue('season.is_registration_open', e.target.checked)} />
//                             <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
//                         </div>
//                         <span className="text-sm font-bold text-gray-300">Mở đăng ký ngay</span>
//                     </label>
//                 </div>
//             </div>
//         </div>
//     );
// }