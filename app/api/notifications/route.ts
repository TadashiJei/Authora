import { NextResponse } from "next/server"
import { getNotificationsByUser } from "@/lib/db"

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const notifications = await getNotificationsByUser(userId)
  return NextResponse.json({ notifications })
}