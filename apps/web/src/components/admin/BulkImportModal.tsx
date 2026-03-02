import { useState, useCallback, useRef } from "react";
import * as XLSX from "xlsx";

interface ParsedRow {
  category: string;
  title: string;
  content: string;
}

interface BulkImportModalProps {
  saving: boolean;
  onImport: (
    entries: { category: string; title: string; content: string }[],
  ) => Promise<boolean>;
  onClose: () => void;
}

export default function BulkImportModal({
  saving,
  onImport,
  onClose,
}: BulkImportModalProps) {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setFileName(file.name);
      setError("");

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

          const parsed: ParsedRow[] = [];

          for (const row of json) {
            // Try multiple column name variations
            const category =
              row["Topic"] || row["topic"] || row["Category"] || row["category"];
            const title =
              row["Question/Issue"] ||
              row["Question"] ||
              row["question"] ||
              row["Title"] ||
              row["title"];
            const content =
              row["Content"] || row["content"] || row["Answer"] || row["answer"];

            if (category && title && content) {
              parsed.push({
                category: String(category).trim(),
                title: String(title).trim(),
                content: String(content).trim(),
              });
            }
          }

          if (parsed.length === 0) {
            setError(
              "No valid rows found. Expected columns: Topic, Question/Issue, Content",
            );
            return;
          }

          setRows(parsed);
        } catch {
          setError("Failed to parse file. Please use .xlsx or .csv format.");
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [],
  );

  const handleImport = useCallback(async () => {
    const success = await onImport(rows);
    if (success) {
      onClose();
    }
  }, [rows, onImport, onClose]);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-harbor-text/10">
          <h3 className="text-lg font-semibold text-harbor-text">
            Bulk Import
          </h3>
          <p className="text-xs text-harbor-text/40 mt-0.5">
            Upload an .xlsx or .csv file with Topic, Question/Issue, and Content
            columns
          </p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {rows.length === 0 ? (
            <div className="text-center py-12">
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFile}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="px-8 py-4 rounded-2xl border-2 border-dashed border-harbor-text/15 hover:border-harbor-accent/40 transition-colors cursor-pointer"
              >
                <div className="text-harbor-text/50 text-sm">
                  {fileName || "Click to select a file"}
                </div>
                <div className="text-harbor-text/25 text-xs mt-1">
                  .xlsx, .xls, or .csv
                </div>
              </button>

              {error && (
                <p className="text-harbor-error text-sm mt-4">{error}</p>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-harbor-text/70">
                  <span className="font-medium">{rows.length}</span> entries
                  ready to import from{" "}
                  <span className="font-medium">{fileName}</span>
                </p>
                <button
                  onClick={() => {
                    setRows([]);
                    setFileName("");
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="text-xs text-harbor-text/40 hover:text-harbor-text cursor-pointer"
                >
                  Clear
                </button>
              </div>

              <div className="border border-harbor-text/10 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-harbor-bg">
                      <th className="text-left px-4 py-2 text-xs font-semibold text-harbor-text/50">
                        Category
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-harbor-text/50">
                        Title
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-harbor-text/50">
                        Content
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-harbor-text/5">
                    {rows.slice(0, 20).map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-harbor-text/70">
                          {row.category}
                        </td>
                        <td className="px-4 py-2 text-harbor-text truncate max-w-[200px]">
                          {row.title}
                        </td>
                        <td className="px-4 py-2 text-harbor-text/50 truncate max-w-[200px]">
                          {row.content}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 20 && (
                  <div className="px-4 py-2 text-xs text-harbor-text/30 bg-harbor-bg text-center">
                    ... and {rows.length - 20} more rows
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-harbor-text/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-harbor-text/50 hover:text-harbor-text hover:bg-harbor-bg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {rows.length > 0 && (
            <button
              onClick={handleImport}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-medium bg-harbor-accent text-white hover:bg-harbor-accent-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? "Importing..." : `Import ${rows.length} Entries`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
