import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BrowserQRCodeReader } from "@zxing/browser"

/**
 * Tailwind class names merger.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Decode a QR code from an image file and return the embedded text.
 */
export async function decodeQrFromImage(file: File): Promise<string | null> {
  const reader = new BrowserQRCodeReader()
  try {
    const url = URL.createObjectURL(file)
    const result = await reader.decodeFromImageUrl(url)
    URL.revokeObjectURL(url)
    return result.getText()
  } catch (err) {
    console.error("QR decode failed", err)
    return null
  }
}

/**
 * Copy arbitrary text to the clipboard.
 * Returns true on success, false otherwise.
 */
export async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
    // Fallback for very old browsers
    const textarea = document.createElement("textarea")
    textarea.value = value
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const success = document.execCommand("copy")
    document.body.removeChild(textarea)
    return success
  } catch (err) {
    console.error("Clipboard copy failed", err)
    return false
  }
}

/**
 * Export a 2‑D string array to CSV and trigger browser download.
 */
export function exportCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((r) =>
      r
        .map((v) => `"${v.replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Ensure a string is a fully‑qualified HTTP(S) URL; if scheme is missing, prepend https://.
 */
export function ensureHttp(url: string): string {
  if (!url) return url
  return /^https?:\/\//i.test(url) ? url : `https://${url.replace(/^\/+/, "")}`
}

/**
 * Build common JSON headers and optionally append x-user-id when a Civic user is present.
 */
export function buildAuthHeaders(
  user: { id?: string | null; email?: string | null } | null | undefined,
): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(user ? { "x-user-id": user.id || user.email || "" } : {}),
  }
}