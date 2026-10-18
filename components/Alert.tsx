type Props = {
  message: string;
  detail?: string;
  tone?: "error" | "info";
  actionLabel?: string;
  onAction?: () => void;
};

export default function Alert({
  message,
  detail,
  tone = "error",
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className={`o-alert is-${tone}`} role="alert">
      <div className="o-alert-text">
        <strong>{message}</strong>
        {detail ? <span>{detail}</span> : null}
      </div>
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
