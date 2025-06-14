import { NextResponse } from "next/server"
import { getWalletByUser } from "@/lib/wallets"

export async function GET(
  req: Request,
  { params }: { params: { userId: string } },
) {
  const address = await getWalletByUser(params.userId)
  if (!address) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json({ address })
}