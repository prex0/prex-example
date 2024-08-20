import { useCallback, useState } from 'react'
import { AiOutlineCopy } from 'react-icons/ai'
import { Tooltip } from 'react-tooltip'

export const Clipboard = ({
  value,
  children
}: {
  value: string
  children: React.ReactElement
}) => {
  const [isCopied, setIsCopied] = useState(false)

  const onClick = useCallback(async () => {
    await navigator.clipboard.writeText(value)
    setIsCopied(true)
  }, [value])

  return (
    <div>
      <Tooltip id="clipboard-tooltip" />
      <div
        onClick={onClick}
        className="flex justify-center items-center space-x-1 cursor-pointer"
        data-tooltip-id="clipboard-tooltip"
        data-tooltip-content={isCopied ? 'Copied' : 'Click to copy'}
        data-tooltip-place="top"
      >
        <AiOutlineCopy className="w-5 h-full text-zinc-500" />
        {children}
      </div>
    </div>
  )
}
