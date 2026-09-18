"use client";

export function PhotoPick({
  label = "Select photo",
  file,
  onFile,
  disabled,
}: {
  label?: string;
  file?: File | null;
  onFile: (file: File) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label
        className={`inline-flex cursor-pointer items-center rounded-full border border-cream/70 px-5 py-2 text-sm hover:bg-cream hover:text-plum ${disabled ? "pointer-events-none opacity-40" : ""}`}
      >
        {label}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            const next = e.target.files?.[0];
            e.target.value = "";
            if (next) onFile(next);
          }}
        />
      </label>
      {file ? <span className="text-sm text-cream-dim">{file.name}</span> : null}
    </div>
  );
}
