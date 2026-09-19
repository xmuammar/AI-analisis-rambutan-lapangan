import { getRawDb } from "@/db";

export const runtime = "edge";
const STATE_ID = "rambutan-lapangan";

function validState(value: unknown): value is { startDate: string; checks: Record<string, unknown>; trees: Record<string, unknown> } {
  if (!value || typeof value !== "object") return false;
  const state = value as Record<string, unknown>;
  return typeof state.startDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(state.startDate)
    && !!state.checks && typeof state.checks === "object"
    && !!state.trees && typeof state.trees === "object";
}

export async function GET() {
  try {
    const row = await getRawDb().prepare(
      "SELECT payload, updated_at AS updatedAt FROM app_state WHERE id = ?"
    ).bind(STATE_ID).first<{ payload: string; updatedAt: number }>();
    return Response.json(row ? { state: JSON.parse(row.payload), updatedAt: row.updatedAt } : { state: null, updatedAt: null });
  } catch (error) {
    console.error("Gagal membaca data rambutan", error);
    return Response.json({ error: "Database sementara tidak dapat dibaca." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { state?: unknown; expectedUpdatedAt?: number | null };
    if (!validState(body.state)) return Response.json({ error: "Format data tidak valid." }, { status: 400 });
    const payload = JSON.stringify(body.state);
    if (new TextEncoder().encode(payload).byteLength > 1_000_000) {
      return Response.json({ error: "Ukuran data melebihi batas." }, { status: 413 });
    }
    const db = getRawDb();
    const current = await db.prepare(
      "SELECT payload, updated_at AS updatedAt FROM app_state WHERE id = ?"
    ).bind(STATE_ID).first<{ payload: string; updatedAt: number }>();
    if (current && body.expectedUpdatedAt !== current.updatedAt) {
      return Response.json({
        error: "Data telah berubah di perangkat lain.",
        state: JSON.parse(current.payload),
        updatedAt: current.updatedAt,
      }, { status: 409 });
    }
    if (!current && body.expectedUpdatedAt !== null) {
      return Response.json({ error: "Versi database tidak sesuai.", state: null, updatedAt: null }, { status: 409 });
    }

    const updatedAt = Date.now();
    await db.prepare(
      `INSERT INTO app_state (id, payload, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`
    ).bind(STATE_ID, payload, updatedAt).run();
    return Response.json({ ok: true, updatedAt });
  } catch (error) {
    console.error("Gagal menyimpan data rambutan", error);
    return Response.json({ error: "Database sementara tidak dapat menyimpan data." }, { status: 503 });
  }
}
