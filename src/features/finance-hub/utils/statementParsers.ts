export interface ParsedStatementRow {
  date: string;
  narration: string;
  amount: number;
  type: "credit" | "debit";
}

function toIsoDate(raw: string): string {
  const trimmed = raw.trim();
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return trimmed.slice(0, 10);

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);

  return new Date().toISOString().slice(0, 10);
}

function parseAmount(raw: string): number {
  return Number(String(raw).replace(/[^\d.-]/g, "")) || 0;
}

// Expects headers (case-insensitive, any order): Date, Narration/Description,
// Amount, Type (credit/debit) — or separate Debit/Credit amount columns.
function rowsFromRecords(records: Record<string, string>[]): ParsedStatementRow[] {
  return records
    .map((record) => {
      const lower: Record<string, string> = {};
      for (const [key, value] of Object.entries(record)) {
        lower[key.trim().toLowerCase()] = String(value ?? "").trim();
      }

      const date = toIsoDate(lower["date"] || lower["transaction date"] || "");
      const narration = lower["narration"] || lower["description"] || lower["memo"] || "";

      if (lower["debit"] && parseAmount(lower["debit"]) > 0) {
        return { date, narration, amount: parseAmount(lower["debit"]), type: "debit" as const };
      }

      if (lower["credit"] && parseAmount(lower["credit"]) > 0) {
        return { date, narration, amount: parseAmount(lower["credit"]), type: "credit" as const };
      }

      const amount = parseAmount(lower["amount"] || "0");
      const typeRaw = (lower["type"] || "").toLowerCase();
      const type: "credit" | "debit" = typeRaw === "debit" || amount < 0 ? "debit" : "credit";

      return { date, narration, amount: Math.abs(amount), type };
    })
    .filter((row) => row.amount > 0);
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}

export function parseCsvStatement(text: string): ParsedStatementRow[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const records = lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = cells[index] ?? "";
    });
    return record;
  });

  return rowsFromRecords(records);
}

export async function parseXlsxStatement(file: File): Promise<ParsedStatementRow[]> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const records = XLSX.utils.sheet_to_json<Record<string, string>>(firstSheet, { defval: "" });
  return rowsFromRecords(records);
}

// SWIFT MT940: each statement line starts with tag :61:, formatted as
// YYMMDD[MMDD]C|D<amount><type><ref>, immediately followed by a :86: line
// carrying the narration text.
export function parseMt940Statement(text: string): ParsedStatementRow[] {
  const lines = text.split(/\r?\n/);
  const rows: ParsedStatementRow[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(/^:61:(\d{6})(?:\d{4})?([CD])(\d+(?:,\d+)?)/);
    if (!match) continue;

    const [, yymmdd, indicator, amountRaw] = match;
    const year = 2000 + Number(yymmdd.slice(0, 2));
    const month = yymmdd.slice(2, 4);
    const day = yymmdd.slice(4, 6);
    const date = `${year}-${month}-${day}`;
    const amount = parseAmount(amountRaw.replace(",", "."));

    const narrationLine = lines[i + 1]?.trim() ?? "";
    const narration = narrationLine.startsWith(":86:") ? narrationLine.slice(4) : narrationLine;

    if (amount > 0) {
      rows.push({ date, narration, amount, type: indicator === "C" ? "credit" : "debit" });
    }
  }

  return rows;
}

export interface ParsedBulkLedgerRow {
  accountName: string;
  category: string;
  amount: number;
  currencyCode: string;
  countryCode: string;
  type: "credit" | "debit";
  method: string;
  reference: string;
}

// Bulk offline-transaction entry — the "pile of cheques from field agents"
// case: a template-download → fill/paste → upload path, same pattern as
// QuickBooks Batch Transaction Entry / Xero Batch Deposit, rather than one
// manual form submission per row.
export function parseBulkLedgerCsv(text: string): ParsedBulkLedgerRow[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());

  return lines
    .slice(1)
    .map((line) => {
      const cells = parseCsvLine(line);
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = (cells[index] ?? "").trim();
      });

      const amount = parseAmount(record["amount"] || "0");
      const type: "credit" | "debit" = (record["type"] || "").toLowerCase() === "debit" ? "debit" : "credit";

      return {
        accountName: record["accountname"] || record["account name"] || "",
        category: record["category"] || "Platform Fee",
        amount,
        currencyCode: (record["currency"] || "NGN").toUpperCase(),
        countryCode: (record["countrycode"] || record["country code"] || "NG").toUpperCase(),
        type,
        method: record["method"] || "Bank Transfer",
        reference: record["reference"] || "",
      };
    })
    .filter((row) => row.accountName && row.amount > 0);
}

export function buildBulkSampleCsv(): string {
  const headers = ["AccountName", "Category", "Amount", "Currency", "CountryCode", "Type", "Method", "Reference"];
  const rows = [
    ["Northline Farmers Cooperative Union", "Subscription", "1500000", "NGN", "NG", "credit", "Cheque", "CHQ-008130"],
    ["Riverbend Farmers Cooperative Union", "Platform Fee", "620000", "NGN", "NG", "credit", "Cash", "CASH-771201"],
  ];
  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

export function buildSampleCsv(): string {
  const headers = ["Date", "Narration", "Amount", "Type"];
  const rows = [
    ["2026-08-06", "NIP/FLUTTERWAVE/ZOWASEL MARKETPLACE/PO-102948", "5400000", "credit"],
    ["2026-08-05", "TRF TO TERMII TECHNOLOGIES/SMS API BATCH 45", "180000", "debit"],
    ["2026-08-04", "UNKNOWN DEPOSIT/REF-771234", "250000", "credit"],
  ];

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}
