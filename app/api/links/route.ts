import { NextResponse } from "next/server"
import { getLinksByUser, addLink } from "@/lib/db"

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const links = await getLinksByUser(userId)
  return NextResponse.json({ links })
}

export async function POST(req: Request) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  if (!body.name || !body.description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const link = await addLink(userId, body)
  return NextResponse.json({ link }, { status: 201 })
}