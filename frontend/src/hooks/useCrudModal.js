import { useState, useCallback, useRef } from 'react';

/**
 * useCrudModal
 * ─────────────────────────────────────────────────────
 * Hook quản lý toàn bộ state cho CRUD modal pattern:
 * - Modal open/close (add / edit mode)
 * - Form data + form error
 * - Save loading state
 * - Delete confirmation + delete loading state
 *
 * Thay thế pattern lặp lại ở mọi admin page:
 *   const [modal, setModal] = useState(null);
 *   const [editing, setEditing] = useState(null);
 *   const [form, setForm] = useState(EMPTY);
 *   const [formErr, setFormErr] = useState('');
 *   const [isSaving, setIsSaving] = useState(false);
 *   const [deleting, setDeleting] = useState(null);
 *   const [isDeleting, setIsDeleting] = useState(false);
 *   ... plus openAdd, openEdit, closeModal, handleSave, handleDelete
 *
 * @param {Object} options
 * @param {Object} options.emptyForm  — object form rỗng ban đầu (e.g. { name: '', desc: '' })
 * @param {Function} [options.onSuccess] — callback gọi sau khi save/delete thành công (e.g. refetch)
 *
 * @example
 * const crud = useCrudModal({
 *   emptyForm: { name: '', description: '' },
 *   onSuccess: () => refetch(),
 * });
 *
 * // Mở modal thêm mới
 * crud.openAdd();
 * crud.openAdd({ name: '', tournament_id: defaultId }); // với initial values
 *
 * // Mở modal chỉnh sửa
 * crud.openEdit(item, { name: item.name, description: item.description });
 *
 * // Save (truyền async function)
 * crud.save(async () => {
 *   if (crud.modal === 'add') await api.create(payload);
 *   else await api.update(crud.editing.id, payload);
 *   toast.success('Done!');
 * });
 *
 * // Delete
 * crud.setDeleting(item);  // mở confirm dialog
 * crud.confirmDelete(async () => {
 *   await api.delete(crud.deleting.id);
 *   toast.success('Deleted!');
 * });
 */
export function useCrudModal(options = {}) {
  const { emptyForm = {}, onSuccess } = options;

  const [modal, setModal] = useState(null);       // null | 'add' | 'edit'
  const [editing, setEditing] = useState(null);    // item đang edit
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);  // item chờ xóa
  const [isDeleting, setIsDeleting] = useState(false);

  // Ref cho callback để tránh stale closure
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  /**
   * Mở modal ở chế độ Add
   * @param {Object} [initialForm] — form ban đầu (override emptyForm)
   */
  const openAdd = useCallback((initialForm) => {
    setForm(initialForm ?? emptyForm);
    setFormError('');
    setEditing(null);
    setModal('add');
  }, [emptyForm]);

  /**
   * Mở modal ở chế độ Edit
   * @param {Object} item     — item đang edit (lưu vào `editing`)
   * @param {Object} editForm — form data cho edit mode
   */
  const openEdit = useCallback((item, editForm) => {
    setForm(editForm);
    setFormError('');
    setEditing(item);
    setModal('edit');
  }, []);

  /**
   * Đóng modal và reset state
   */
  const closeModal = useCallback(() => {
    setModal(null);
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
  }, [emptyForm]);

  /**
   * Thực hiện save operation
   * @param {Function} saveFn — async function thực hiện API call.
   *   Caller tự validate form trước khi gọi save().
   *   Nếu saveFn throw error → formError sẽ được set.
   *   Nếu thành công → modal đóng + gọi onSuccess.
   */
  const save = useCallback(async (saveFn) => {
    setIsSaving(true);
    setFormError('');
    try {
      const result = await saveFn();
      closeModal();
      onSuccessRef.current?.();
      return result;
    } catch (err) {
      const msg = err?.response?.data?.message || 'Có lỗi xảy ra.';
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  }, [closeModal]);

  /**
   * Thực hiện delete operation
   * @param {Function} deleteFn — async function thực hiện API delete.
   *   Nếu thành công → đóng confirm dialog + gọi onSuccess.
   */
  const confirmDelete = useCallback(async (deleteFn) => {
    setIsDeleting(true);
    try {
      await deleteFn();
      setDeleting(null);
      onSuccessRef.current?.();
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    // State
    modal,
    editing,
    form,
    setForm,
    formError,
    setFormError,
    isSaving,
    deleting,
    setDeleting,
    isDeleting,
    // Actions
    openAdd,
    openEdit,
    closeModal,
    save,
    confirmDelete,
  };
}
