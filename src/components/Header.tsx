import { ReturnButton } from './ReturnButton'

export const Header = ({
  title,
  returnPath = '/'
}: {
  title: string
  returnPath?: string
}) => {
  return (
    <div className="relative top-0 left-0 box-border z-50 w-full bg-white border-primary border-[1px] text-zinc-800">
      <div className="flex justify-between items-center">
        <div className="flex-none">
          <ReturnButton returnPath={returnPath} />
        </div>
        <div className="grow flex justify-center font-bold text-base">
          {title}
        </div>
        <div className="flex-none w-10"></div>
      </div>
    </div>
  )
}
