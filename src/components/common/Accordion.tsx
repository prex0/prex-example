import React, { ReactNode } from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import { useResizeDetector } from 'react-resize-detector'
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'

const AccordionContainer = ({
  title,
  children
}: {
  title: string
  children: ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false) // 【状態】開閉を記憶
  const { height, ref } = useResizeDetector() // react-resize-detector

  return (
    <dl className="overflow-hidden bg-white">
      <dt
        className="flex items-center cursor-pointer select-none space-x-1"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <span className="text-base text-zinc-800">{title}</span>
        {isOpen === true ? <AiOutlineUp /> : <AiOutlineDown />}
      </dt>
      <dd
        style={{ '--content-height': height + 'px' } as React.CSSProperties}
        className={`
	  overflow-hidden transition-[max-height] duration-500 ease-out-expo
	  ${clsx(isOpen === true ? 'max-h-[var(--content-height)]' : 'max-h-0')}
	`}
      >
        <div ref={ref}>
          <div className="border-t border-gray">{children}</div>
        </div>
      </dd>
    </dl>
  )
}

export { AccordionContainer }
