"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { copyText } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import * as React from "react"

interface CopyButtonProps extends ButtonProps {
  /** The value that will be copied to the clipboard */
  value: string
  /** Optional message override for toast title */
  toastTitle?: string
  /** Optional message override for toast description */
  toastDescription?: string
}

export default function CopyButton({
  value,
  toastTitle,
  toastDescription,
  onClick,
  ...props
}: CopyButtonProps) {
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e)
    const ok = await copyText(value)
    toast({
      title: toastTitle || (ok ? "Copied!" : "Copy failed"),
      description: toastDescription || value,
    })
  }

  return <Button {...props} onClick={handleClick} />
}