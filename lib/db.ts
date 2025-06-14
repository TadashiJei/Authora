import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"
import { sendMail } from "./email"

/* ---------- Types ---------- */

export interface Link {
  id: string
  userId: string
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

export async function getLinksByUser(userId: string): Promise<Link[]> {
  const links = await readLinks()
  return links.filter((l) => l.userId === userId)
}

export async function getLink(userId: string, id: string): Promise<Link | undefined> {
  const links = await readLinks()
  return links.find((l) => l.userId === userId && l.id === id)
}

export async function addLink(
  userId: string,
  payload: {
    name: string
    description: string
    amount?: number
    currency?: string
  },
): Promise<Link> {
  const links = await readLinks()
  const id = randomUUID()
  const created = new Date().toISOString()
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BASE_URL ||
    "http://localhost:3000"
  const url = `${base.replace(/\/+$/, "")}/payment/${userId}/${id}`

  const newLink: Link = {
    id,
    userId,
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
  userId: string,
  id: string,
  patch: Partial<Omit<Link, "id" | "created" | "url" | "userId">>,
): Promise<Link | undefined> {
  const links = await readLinks()
  const idx = links.findIndex((l) => l.userId === userId && l.id === id)
  if (idx === -1) return undefined
  links[idx] = { ...links[idx], ...patch }
  await writeLinks(links)
  return links[idx]
}

export async function deleteLink(userId: string, id: string): Promise<boolean> {
  const links = await readLinks()
  const filtered = links.filter((l) => !(l.userId === userId && l.id === id))
  if (filtered.length === links.length) return false
  await writeLinks(filtered)
  return true
}

/* ---------- Notifications ---------- */

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  time: string
  read: boolean
}

const notificationsFile = path.join(dataDir, "notifications.json")

async function ensureNotificationsFile() {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(notificationsFile)
  } catch {
    await fs.writeFile(notificationsFile, "[]")
  }
}

async function readNotifications(): Promise<Notification[]> {
  await ensureNotificationsFile()
  const raw = await fs.readFile(notificationsFile, "utf8")
  return JSON.parse(raw) as Notification[]
}

/**
 * Return notifications for a user sorted by newest first.
 */
export async function getNotificationsByUser(userId: string): Promise<Notification[]> {
  const list = await readNotifications()
  return list
    .filter((n) => n.userId === userId)
    .sort((a, b) => (a.time < b.time ? 1 : -1))
}

/**
 * Persist a new notification and send an email copy.
 */
export async function addNotification(
  userId: string,
  payload: Pick<Notification, "type" | "title" | "message">,
): Promise<Notification> {
  await ensureNotificationsFile()
  const current = await readNotifications()
  const entry: Notification = {
    id: randomUUID(),
    userId,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    time: new Date().toISOString(),
    read: false,
  }
  current.push(entry)
  await fs.writeFile(notificationsFile, JSON.stringify(current, null, 2))

  // Fire‑and‑forget email
  try {
    await sendMail({
      to: userId, // userId is the email for Civic users
      subject: payload.title,
      text: payload.message,
      html: `<p>${payload.message}</p>`,
    })
  } catch (err) {
    console.error("Email dispatch failed", err)
  }

  return entry
}

export async function recordPayment(
  linkId: string,
  amount: number,
  currency: string,
  txHash: string,
): Promise<Link | undefined> {
  const links = await readLinks()
  const idx = links.findIndex((l) => l.id === linkId)
  if (idx === -1) return undefined
  links[idx].earnings += amount
  links[idx].transactions += 1
  await writeLinks(links)
  try {
    await addNotification(links[idx].userId, {
      type: "payment",
      title: "New support received",
      message: `You received ${amount} ${currency} (tx ${txHash.slice(
        0,
        10,
      )}…)`,
    })
  } catch (err) {
    console.error("payment notification failed", err)
  }
  return links[idx]
}