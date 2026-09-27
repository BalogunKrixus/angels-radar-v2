import { Card, CardHeader } from "@/components/ui/Card";
import { Select, Textarea, FormField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { statusLabel } from "@/lib/constants";

export function StatusUpdateForm({
  action,
  idField,
  idValue,
  statusOptions,
  currentStatus,
  currentNote,
  showNote = true,
}: {
  action: (formData: FormData) => Promise<void>;
  idField: string;
  idValue: string;
  statusOptions: readonly string[];
  currentStatus: string;
  currentNote?: string | null;
  showNote?: boolean;
}) {
  return (
    <Card>
      <CardHeader title="Review" description="Change status and notify the applicant." />
      <form action={action} className="space-y-4">
        <input type="hidden" name={idField} value={idValue} />
        <FormField label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={currentStatus}>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </Select>
        </FormField>
        {showNote && (
          <FormField
            label="Note to applicant"
            htmlFor="adminNote"
            hint="Shown to them for changes-requested or rejected."
          >
            <Textarea id="adminNote" name="adminNote" defaultValue={currentNote ?? ""} rows={3} />
          </FormField>
        )}
        <SubmitButton pendingText="Updating…">Update status</SubmitButton>
      </form>
    </Card>
  );
}
