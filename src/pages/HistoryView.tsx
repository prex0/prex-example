import { useEffect, useState } from 'react'
import { Address, isAddressEqual } from 'viem'
import {
  usePrex,
  WalletCoinHistory,
  WalletOnetimeLockHistory
} from '@prex0/prex-react'
import { ERC20_ADDRESS, UNIT_NAME } from '../constants'
import { getFormattedDate } from '../utils/date'
import { LoadingIndicatorDark } from '../components/common'
import { Header } from '../components/Header'
import { Link } from 'react-router-dom'

const HistoryItemContent = ({
  item,
  me
}: {
  me: Address
  item: WalletCoinHistory
}) => {
  if (isAddressEqual(item.sender, me)) {
    return (
      <div>
        <div className="flex justify-between">
          <div>{item.recipientDisplayName}に送りました。</div>
          <div>
            {item.amount} {UNIT_NAME}
          </div>
        </div>
        <div className="flex justify-start">
          <div>
            <div className="text-xs text-zinc-500">
              {getFormattedDate(item.createdAt)}
            </div>
          </div>
        </div>
      </div>
    )
  } else if (isAddressEqual(item.recipient, me)) {
    return (
      <div>
        <div className="flex justify-between">
          <div>{item.senderDisplayName}から受け取りました。</div>
          <div>
            {item.amount} {UNIT_NAME}
          </div>
        </div>
        <div className="flex justify-start">
          <div>
            <div className="text-xs text-zinc-500">
              {getFormattedDate(item.createdAt)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const OnetimeLockHistoryItemContent = ({
  item
}: {
  item: WalletOnetimeLockHistory
}) => {
  const recipientLink =
    item.secret && item.messageId
      ? `${location.origin}/pending?id=${encodeURIComponent(
          item.messageId
        )}&s=${encodeURIComponent(item.secret)}`
      : undefined

  if (item.recipient && item.recipientDisplayName) {
    return (
      <div>
        <div className="flex justify-between">
          <div>{item.recipientDisplayName}に送りました。</div>
          <div>
            {item.amount} {UNIT_NAME}
          </div>
        </div>
        <div className="flex justify-start">
          <div>
            <div className="text-xs text-zinc-500">
              {getFormattedDate(item.createdAt)}
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div className="flex justify-between">
          <div>
            {recipientLink ? (
              <Link to={recipientLink} className="text-blue-700 underline">
                送付しています
              </Link>
            ) : (
              '送付しています'
            )}
          </div>
          <div>
            {item.amount} {UNIT_NAME}
          </div>
        </div>
        <div className="flex justify-start">
          <div>
            <div className="text-xs text-zinc-500">
              {getFormattedDate(item.createdAt)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const HistoryContent = ({ me }: { me: Address }) => {
  const { history } = usePrex()

  if (history === null) {
    return <LoadingIndicatorDark />
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div key={index} className="p-2 bg-white shadow">
          <HistoryItemContent item={item} me={me} />
        </div>
      ))}
    </div>
  )
}

const OnetimeLockHistoryContent = () => {
  const { onetimeLockHistory } = usePrex()

  if (onetimeLockHistory === null) {
    return <LoadingIndicatorDark />
  }

  return (
    <div className="space-y-4">
      {onetimeLockHistory.map((item, index) => (
        <div key={index} className="p-2 bg-white shadow">
          <OnetimeLockHistoryItemContent item={item} />
        </div>
      ))}
    </div>
  )
}

const HistoryView = () => {
  const { wallet, loadHistory, loadOnetimeLockHistory } = usePrex()

  const [tab, setTab] = useState<'history' | 'onetime'>('history')

  useEffect(() => {
    if (tab === 'onetime') loadOnetimeLockHistory(ERC20_ADDRESS)
    else loadHistory(ERC20_ADDRESS)
  }, [tab])

  return (
    <div>
      <Header title="取引履歴" />
      <div className="m-2 flex justify-center items-center">
        <div className="w-full mt-10">
          <div>
            <div className="flex justify-between items-center">
              <div
                className={`text-base ${
                  tab === 'history'
                    ? 'text-zinc-900 font-bold'
                    : 'text-zinc-500'
                }`}
                onClick={() => setTab('history')}
              >
                完了した取引
              </div>
              <div
                className={`text-base ${
                  tab === 'onetime'
                    ? 'text-zinc-900 font-bold'
                    : 'text-zinc-500'
                }`}
                onClick={() => setTab('onetime')}
              >
                リンク送信履歴
              </div>
            </div>
          </div>
          <div className="mt-4 text-base space-y-3">
            {wallet ? (
              tab === 'history' ? (
                <HistoryContent me={wallet.address} />
              ) : (
                <OnetimeLockHistoryContent />
              )
            ) : (
              <LoadingIndicatorDark />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryView
