import { NextResponse } from "next/server"
import { recordPayment } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await req.json()
  const amount = Number(body?.amount)
  const currency = body?.currency || "SOL"
  const txHash = body?.txHash || ""

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
  }

  const updated = await recordPayment(id, amount, currency, txHash)
  if (!updated) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 })
  }

  return NextResponse.json({ link: updated }, { status: 201 })
}