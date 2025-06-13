import { NextResponse } from "next/server"
import { getLinks, addLink } from "@/lib/db"

export async function GET() {
  const links = await getLinks()
  return NextResponse.json({ links })
}

export async function POST(req: Request) {
  const body = await req.json()
  if (!body.name || !body.description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const link = await addLink(body)
  return NextResponse.json({ link }, { status: 201 })
}