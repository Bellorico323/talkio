import { useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { SendHorizonal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [])

  const handleSend = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    const text = el.value.trim()
    if (!text) return
    onSend(text)
    el.value = ''
    el.style.height = 'auto'
  }, [onSend])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-border bg-background flex flex-col gap-1 px-3 py-2">
      <div
        className={cn(
          'border-input bg-muted flex items-center rounded-2xl border px-3 py-2',
          'focus-within:border-primary focus-within:ring-primary/20 focus-within:ring-2',
          'transition-shadow'
        )}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Write a message..."
          className={cn(
            'flex-1 resize-none bg-transparent outline-none',
            'text-foreground placeholder:text-muted-foreground text-sm leading-relaxed',
            'max-h-30 min-h-5.5 overflow-y-auto'
          )}
          onInput={autoResize}
          onKeyDown={handleKeyDown}
        />
        <Button
          size="icon"
          className="shrink-0 rounded-2xl"
          onClick={handleSend}
        >
          <SendHorizonal className="size-4" />
        </Button>
      </div>
    </div>
  )
}
