import { NextResponse } from "next/server"
import { getLink, updateLink, deleteLink } from "@/lib/db"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const link = await getLink(params.id)
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ link })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const updated = await updateLink(params.id, body)
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ link: updated })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const ok = await deleteLink(params.id)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}