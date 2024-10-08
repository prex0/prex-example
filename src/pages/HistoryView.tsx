import { useEffect, useState } from 'react'
import { Address, formatUnits, isAddressEqual } from 'viem'
import {
  usePrex,
  TransferHistory,
  LinkTransferHistory
} from '@prex0/prex-react'
import { ERC20_ADDRESS, TOKEN_DECIMALS, UNIT_NAME } from '../constants'
import { getFormattedDate } from '../utils/date'
import { LoadingIndicatorDark } from '../components/common'
import { Header } from '../components/Header'
import { Link } from 'react-router-dom'

const HistoryItemContent = ({
  item,
  me
}: {
  me: Address
  item: TransferHistory
}) => {
  if (isAddressEqual(item.sender, me)) {
    return (
      <div>
        <div className="flex justify-between">
          <div>{item.recipientDisplayName}に送りました。</div>
          <div>
            {formatUnits(BigInt(item.amount), TOKEN_DECIMALS)} {UNIT_NAME}
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
            {formatUnits(BigInt(item.amount), TOKEN_DECIMALS)} {UNIT_NAME}
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

const LinkTransferHistoryItemContent = ({
  item
}: {
  item: LinkTransferHistory
}) => {
  const recipientLink =
    item.secret && item.messageId
      ? `${location.origin}/pending?id=${encodeURIComponent(
          item.messageId
        )}&s=${encodeURIComponent(item.secret)}`
      : undefined

  if (item.status === 'CANCELLED') {
    return (
      <div>
        <div className="flex justify-between">
          <div>キャンセルされました</div>
          <div>
            {formatUnits(BigInt(item.amount), TOKEN_DECIMALS)} {UNIT_NAME}
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
  } else if (item.status === 'LIVE') {
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
            {formatUnits(BigInt(item.amount), TOKEN_DECIMALS)} {UNIT_NAME}
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
          <div>{item.recipientDisplayName}に送りました。</div>
          <div>
            {formatUnits(BigInt(item.amount), TOKEN_DECIMALS)} {UNIT_NAME}
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

const LinkTransferLockHistoryContent = () => {
  const { linkTransferHistory } = usePrex()

  if (linkTransferHistory === null) {
    return <LoadingIndicatorDark />
  }

  return (
    <div className="space-y-4">
      {linkTransferHistory.map((item, index) => (
        <div key={index} className="p-2 bg-white shadow">
          <LinkTransferHistoryItemContent item={item} />
        </div>
      ))}
    </div>
  )
}

const HistoryView = () => {
  const { wallet, loadHistory, loadLinkTransferHistory } = usePrex()

  const [tab, setTab] = useState<'history' | 'onetime'>('history')

  useEffect(() => {
    if (tab === 'onetime') loadLinkTransferHistory(ERC20_ADDRESS)
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
                <LinkTransferLockHistoryContent />
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
