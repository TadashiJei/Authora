import { NextResponse } from "next/server"
import { getNotificationsByUser, addNotification } from "@/lib/db"

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const notifications = await getNotificationsByUser(userId)
  return NextResponse.json({ notifications })
}

export async function POST(req: Request) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  if (!body?.type || !body?.title || !body?.message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const notification = await addNotification(userId, {
    type: body.type,
    title: body.title,
    message: body.message,
  })
  return NextResponse.json({ notification }, { status: 201 })
}