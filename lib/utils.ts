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