import { Controller, useFormContext } from 'react-hook-form';
import FormField from './FormField';
import { INPUT } from '../../data/data';
import { safeInt, safeFloat } from '../../schemas/wizard.constants';

const blockNonNumericKeys = (e) => {
    if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
};

// Controller thay vì register(name, { valueAsNumber: true }) — valueAsNumber cho NaN khi
// input rỗng (browser number input value === '' -> Number('') = 0 nhưng valueAsNumber cho
// NaN cụ thể), NaN chảy vào RHF state làm mọi so sánh (`< 1`) luôn false, qua mặt zod bên
// dưới vì zod nhận đúng kiểu number (NaN vẫn là typeof 'number'). safeInt/safeFloat chặn
// tại nguồn: input rỗng -> fallback về `min` (không phải 0) nếu field có min, tránh việc
// user xóa trắng ô "Số bảng" rồi rời đi mà state âm thầm còn lại giá trị dưới ngưỡng hợp lệ.
export default function NumberField({ name, label, required, min, max, step, allowDecimal, placeholder }) {
    const { control, formState: { errors } } = useFormContext();
    const fieldError = name.split('.').reduce((acc, key) => acc?.[key], errors);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormField label={label} required={required} error={fieldError?.message}>
                    <input
                        type="number"
                        inputMode={allowDecimal ? 'decimal' : 'numeric'}
                        className={INPUT}
                        value={field.value ?? ''}
                        min={min}
                        max={max}
                        step={step ?? (allowDecimal ? 0.01 : 1)}
                        placeholder={placeholder}
                        onKeyDown={blockNonNumericKeys}
                        onChange={(e) => field.onChange(allowDecimal ? safeFloat(e.target.value, min ?? 0) : safeInt(e.target.value, min ?? 0))}
                        onBlur={field.onBlur}
                    />
                </FormField>
            )}
        />
    );
}