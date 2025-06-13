import { NextResponse } from "next/server"
import { getLink, updateLink, deleteLink } from "@/lib/db"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get("x-user-id")
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const link = await getLink(userId, params.id)
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ link })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get("x-user-id")
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const updated = await updateLink(userId, params.id, body)
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ link: updated })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const userId = req.headers.get("x-user-id")
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const ok = await deleteLink(userId, params.id)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}