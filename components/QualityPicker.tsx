type Option = {
  id: string;
  label: string;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
};

export default function QualityPicker({
  options,
  value,
  onChange,
  label = "Pilih kualitas",
}: Props) {
  if (options.length < 2) {
    return null;
  }

  return (
    <div className="o-segment" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={option.id === value}
          className={option.id === value ? "is-on" : ""}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
