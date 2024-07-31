import { BaseModal } from './common/BaseModal'
import { QRLink } from './QRLink'
import { AiOutlineClose } from 'react-icons/ai'

export const QRModal = ({
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
        <div>
          <div className="text-zinc-800 text-sm font-bold">
            こちらの２次元コードを、相手に読み取ってもらってください。
          </div>
          <div className="flex justify-center items-center">
            <QRLink url={url} />
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
