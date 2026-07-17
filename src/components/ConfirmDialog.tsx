import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title = 'Are you sure?', message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger, onConfirm, onCancel }: ConfirmProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title} maxWidth={420}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onCancel}>{cancelLabel}</button>
          <button className={danger ? 'btn btn-danger' : 'btn btn-primary'} onClick={onConfirm}>{confirmLabel}</button>
        </>
      }
    >
      <div className="flex items-center gap-12">
        <div className="stat-icon" style={{ background: danger ? 'var(--danger-light)' : 'var(--warning-light)', color: danger ? 'var(--danger)' : 'var(--warning)' }}>
          <AlertTriangle size={22} />
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{message}</p>
      </div>
    </Modal>
  );
}
