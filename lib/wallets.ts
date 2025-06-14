import { promises as fs } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const walletsFile = path.join(dataDir, "wallets.json")

interface WalletEntry {
  userId: string
  chain: string
  address: string
}

async function ensureFile() {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(walletsFile)
  } catch {
    await fs.writeFile(walletsFile, "[]")
  }
}

async function readAll(): Promise<WalletEntry[]> {
  await ensureFile()
  const raw = await fs.readFile(walletsFile, "utf8")
  return JSON.parse(raw) as WalletEntry[]
}

async function writeAll(entries: WalletEntry[]) {
  await fs.writeFile(walletsFile, JSON.stringify(entries, null, 2))
}

export async function getWalletByUser(
  userId: string,
  chain = "solana",
): Promise<string | null> {
  const list = await readAll()
  const found = list.find((w) => w.userId === userId && w.chain === chain)
  return found ? found.address : null
}

export async function saveWalletForUser(
  userId: string,
  address: string,
  chain = "solana",
) {
  const list = await readAll()
  const idx = list.findIndex((w) => w.userId === userId && w.chain === chain)
  if (idx === -1) {
    list.push({ userId, chain, address })
  } else {
    list[idx].address = address
  }
  await writeAll(list)
}