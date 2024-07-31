import { BaseModal } from './common/BaseModal'
import { AiOutlineClose } from 'react-icons/ai'

export const LocalModal = ({
  isOpen,
  onRequestClose,
  url
}: {
  isOpen: boolean
  onRequestClose: () => void
  url: string
}) => {
  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="absolute top-2 right-2 cursor-pointer">
        <AiOutlineClose
          className="w-8 h-8 text-zinc-800"
          onClick={onRequestClose}
        />
      </div>
      <div className="mt-6 flex justify-center items-center">
        <div className="flex justify-center items-center text-zinc-800">
          <div>
            <div className="my-2">ローカル環境では、Share APIが使用できません。以下のリンクを使用して、コインを受け取ってください。</div>
            <a href={url} target="_blank" rel="noreferrer" className="text-base underline">
              送付リンク
            </a>
          </div>
        </div>
    </div>
    </BaseModal>
  )
}
