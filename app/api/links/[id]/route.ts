import { NextResponse } from "next/server"
import { getLink, updateLink, deleteLink } from "@/lib/db"

/* ---------- GET ---------- */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const userId = req.headers.get("x-user-id")
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const link = await getLink(userId, id)
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ link })
}

/* ---------- PUT ---------- */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const userId = req.headers.get("x-user-id")
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const updated = await updateLink(userId, id, body)
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ link: updated })
}

/* ---------- DELETE ---------- */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const userId = req.headers.get("x-user-id")
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const ok = await deleteLink(userId, id)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}