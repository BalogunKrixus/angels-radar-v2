import { FormField } from "@/components/ui/Field";

export function FileInput({
  name,
  label,
  accept,
  hint,
  currentLabel,
}: {
  name: string;
  label: string;
  accept: string;
  hint?: string;
  currentLabel?: string | null;
}) {
  return (
    <FormField label={label} htmlFor={name} hint={hint}>
      {currentLabel && (
        <p className="mb-1.5 text-xs text-ink-soft">
          Current file: <span className="text-ink">{currentLabel}</span>
        </p>
      )}
      <input
        id={name}
        name={name}
        type="file"
        accept={accept}
        className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-md file:border-0 file:bg-paper file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-border/60"
      />
    </FormField>
  );
}
