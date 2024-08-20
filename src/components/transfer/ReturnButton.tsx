import { AiOutlineLeft } from 'react-icons/ai'
import { Link } from 'react-router-dom'

export const ReturnButton = ({ returnPath = '/' }: { returnPath?: string }) => {
  return (
    <Link className="box-border z-50" to={returnPath}>
      <AiOutlineLeft className="w-10 h-10 text-zinc-600" />
    </Link>
  )
}
