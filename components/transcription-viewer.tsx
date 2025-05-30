"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface TranscriptionViewerProps {
  content: string | null | undefined
}

export function TranscriptionViewer({ content }: TranscriptionViewerProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  
  const displayContent = content || "No content available"
  const hasContent = !!content && content.trim().length > 0
  
  const handleCopy = async () => {
    if (!hasContent) {
      toast({
        title: "Error",
        description: "No content to copy",
        variant: "destructive",
      })
      return
    }
    
    try {
      await navigator.clipboard.writeText(content as string)
      setCopied(true)
      
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      })
      
      // Reset copied status after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      })
    }
  }
  
  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="relative">
        <p className={`whitespace-pre-wrap ${!hasContent ? 'text-muted-foreground italic' : ''}`}>
          {displayContent}
        </p>
        {hasContent && (
          <div className="absolute top-0 right-0">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCopy}
              className="copy-button"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  )
} 