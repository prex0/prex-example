import { ReactNode } from 'react'
import Modal from 'react-modal'

export const ModalTitle = ({ children }: { children: ReactNode }) => {
  return <div className="my-0 text-md font-medium">{children}</div>
}

export const BaseModal = ({
  isOpen,
  onRequestClose,
  children,
  height = 370
}: {
  isOpen: boolean
  onRequestClose: () => void
  children: ReactNode
  maxWidth?: number
  height?: number
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={true}
      style={{
        overlay: {
          zIndex: 100,
          backgroundColor: '#ffffff10',
          backdropFilter: 'blur(2px)'
        },
        content: {
          borderRadius: 8,
          backgroundColor: '#ffffff',
          border: '1px solid #2A2F3B',
          height: height,
          width: '100%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
      }}
    >
      {children}
    </Modal>
  )
}
