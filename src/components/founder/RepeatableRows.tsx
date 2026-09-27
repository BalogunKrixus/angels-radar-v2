"use client";

import { useRef, useState } from "react";
import { Input, Textarea, FormField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export interface TeamMemberRow {
  name?: string;
  role?: string;
  bio?: string;
  linkedin?: string;
}

export function TeamMembersField({ initial }: { initial: TeamMemberRow[] }) {
  const [rows, setRows] = useState<{ id: number; data: TeamMemberRow }[]>(
    (initial.length ? initial : [{}]).map((data, i) => ({ id: i, data }))
  );
  const nextId = useRef(rows.length);

  return (
    <div className="space-y-4">
      {rows.map((row, index) => (
        <div key={row.id} className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink-soft">
              {index === 0 ? "Additional team member" : `Team member ${index + 1}`}
            </p>
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => setRows((r) => r.filter((x) => x.id !== row.id))}
                className="text-xs text-danger hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Name" htmlFor={`team_name_${row.id}`}>
              <Input id={`team_name_${row.id}`} name="team_name" defaultValue={row.data.name} />
            </FormField>
            <FormField label="Role" htmlFor={`team_role_${row.id}`}>
              <Input id={`team_role_${row.id}`} name="team_role" defaultValue={row.data.role} />
            </FormField>
          </div>
          <FormField label="Short bio" htmlFor={`team_bio_${row.id}`}>
            <Textarea id={`team_bio_${row.id}`} name="team_bio" rows={2} defaultValue={row.data.bio} />
          </FormField>
          <FormField label="LinkedIn" htmlFor={`team_linkedin_${row.id}`}>
            <Input id={`team_linkedin_${row.id}`} name="team_linkedin" defaultValue={row.data.linkedin} />
          </FormField>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => {
          nextId.current += 1;
          setRows((r) => [...r, { id: nextId.current, data: {} }]);
        }}
      >
        + Add team member
      </Button>
    </div>
  );
}

export interface LinkRow {
  label?: string;
  url?: string;
}

export function LinksField({ initial }: { initial: LinkRow[] }) {
  const [rows, setRows] = useState<{ id: number; data: LinkRow }[]>(
    (initial.length ? initial : [{}]).map((data, i) => ({ id: i, data }))
  );
  const nextId = useRef(rows.length);

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={row.id} className="flex items-end gap-3">
          <FormField label={index === 0 ? "Label" : ""} htmlFor={`link_label_${row.id}`}>
            <Input
              id={`link_label_${row.id}`}
              name="link_label"
              placeholder="e.g. Product Hunt"
              defaultValue={row.data.label}
            />
          </FormField>
          <FormField label={index === 0 ? "URL" : ""} htmlFor={`link_url_${row.id}`}>
            <Input
              id={`link_url_${row.id}`}
              name="link_url"
              placeholder="https://"
              defaultValue={row.data.url}
            />
          </FormField>
          {rows.length > 1 && (
            <button
              type="button"
              onClick={() => setRows((r) => r.filter((x) => x.id !== row.id))}
              className="mb-2.5 text-xs text-danger hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => {
          nextId.current += 1;
          setRows((r) => [...r, { id: nextId.current, data: {} }]);
        }}
      >
        + Add link
      </Button>
    </div>
  );
}
