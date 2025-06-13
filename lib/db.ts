import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

/* ---------- Types ---------- */

export interface Link {
  id: string
  name: string
  url: string
  description: string
  amount?: number
  currency?: string
  earnings: number
  transactions: number
  status: "Active" | "Paused"
  created: string
}

/* ---------- File helpers ---------- */

const dataDir = path.join(process.cwd(), "data")
const dataFile = path.join(dataDir, "links.json")

async function ensureFile() {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(dataFile)
  } catch {
    await fs.writeFile(dataFile, "[]")
  }
}

async function readLinks(): Promise<Link[]> {
  await ensureFile()
  const raw = await fs.readFile(dataFile, "utf8")
  return JSON.parse(raw) as Link[]
}

async function writeLinks(links: Link[]) {
  await fs.writeFile(dataFile, JSON.stringify(links, null, 2))
}

/* ---------- CRUD ---------- */

export async function getLinks(): Promise<Link[]> {
  return readLinks()
}

export async function getLink(id: string): Promise<Link | undefined> {
  const links = await readLinks()
  return links.find((l) => l.id === id)
}

export async function addLink(payload: {
  name: string
  description: string
  amount?: number
  currency?: string
}): Promise<Link> {
  const links = await readLinks()
  const id = randomUUID()
  const created = new Date().toISOString()
  const url = `authora.xyz/@creator/${id}`

  const newLink: Link = {
    id,
    name: payload.name,
    description: payload.description,
    amount: payload.amount,
    currency: payload.currency,
    url,
    earnings: 0,
    transactions: 0,
    status: "Active",
    created,
  }

  links.push(newLink)
  await writeLinks(links)
  return newLink
}

export async function updateLink(
  id: string,
  patch: Partial<Omit<Link, "id" | "created" | "url">>,
): Promise<Link | undefined> {
  const links = await readLinks()
  const idx = links.findIndex((l) => l.id === id)
  if (idx === -1) return undefined
  links[idx] = { ...links[idx], ...patch }
  await writeLinks(links)
  return links[idx]
}

export async function deleteLink(id: string): Promise<boolean> {
  const links = await readLinks()
  const filtered = links.filter((l) => l.id !== id)
  if (filtered.length === links.length) return false
  await writeLinks(filtered)
  return true
}