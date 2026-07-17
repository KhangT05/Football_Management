// import { create } from 'zustand';

// interface WizardUiState {
//     step: 1 | 2 | 3 | 4;
//     setStep: (step: 1 | 2 | 3 | 4) => void;
//     next: () => void;
//     back: (target: 1 | 2 | 3 | 4) => void;
//     reset: () => void;
// }

// // CHỈ giữ vị trí step. Mọi field value (tournamentMode, ruleMode, selectedTournamentId,
// // selectedRuleId, templateSnapshot, logoPreview...) trước đây nằm ở đây đều là *dữ liệu
// // form* hoặc *derive được từ query cache* — chuyển hết sang RHF (useForm) + TanStack Query,
// // tránh 2 nguồn sự thật cho cùng 1 giá trị (RHF field vs zustand field dễ lệch nhau khi 1
// // trong 2 quên sync).
// //
// // Lý do vẫn cần zustand thay vì useState cục bộ trong Modal: Stepper, StepBody và Footer
// // là 3 component tách rời (không lồng nhau trực tiếp) cùng cần đọc/ghi `step` — zustand
// // tránh phải lift state lên Modal rồi prop-drill xuống cả 3, mà vẫn không phải Context
// // riêng chỉ để truyền 1 số nguyên.
// export const useWizardUiStore = create < WizardUiState > ((set) => ({
//     step: 1,
//     setStep: (step) => set({ step }),
//     next: () => set((s) => ({ step: (s.step + 1) as WizardUiState['step'] })),
//     back: (target) => set({ step: target }),
//     reset: () => set({ step: 1 }),
// }));