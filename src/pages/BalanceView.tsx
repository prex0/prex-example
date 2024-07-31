import React from 'react'
import { Link } from "react-router-dom"
import {
  AiFillMoneyCollect,
  AiOutlineHistory,
  AiOutlineScan,
  AiOutlineSend,
  AiOutlineUser,
  AiOutlineSetting,
} from 'react-icons/ai'
import { CoinBalance } from '../components/CoinBalance'
import { ERC20_ADDRESS } from '../constants'

const ActionIcon = ({
  icon,
  link,
  title
}: {
  icon: React.ReactNode
  link: string
  title: string
}) => {
  return (
    <div className="w-20 flex justify-center">
      <Link to={link}>
        <div className="flex justify-center">{icon}</div>
        <div className="flex justify-center font-bold">{title}</div>
      </Link>
    </div>
  )
}

const BalanceView = () => {
  return (
    <div className="m-2 flex justify-center items-center">
      <div className="mt-8">
        <div className="text-base space-y-3">
          <div className="fixed top-2 z-999 right-2">
            <Link to={'/settings'}>
              <AiOutlineSetting className="w-8 h-8 text-zinc-600" />
            </Link>
          </div>

          <div className="flex justify-center">
            <CoinBalance erc20Address={ERC20_ADDRESS} unit={'demoCoin'} />
          </div>

          <div className="pt-2 flex justify-center space-x-3">
            <Link
              to={'/profile'}
              className="w-20 flex flex-col justify-center items-center space-x-1"
            >
              <AiOutlineUser className="w-10 h-10 text-zinc-600" />
              <div className="text-xs text-zinc-600">プロフィール</div>
            </Link>
            <Link
              to={'/history'}
              className="w-20 flex flex-col justify-center items-center space-x-1"
            >
              <AiOutlineHistory className="w-10 h-10 text-zinc-600" />
              <div className="text-xs text-zinc-600">取引履歴</div>
            </Link>
          </div>

          <div className="fixed bottom-10 z-999 left-0 w-full p-2">
            <div className="px-3 py-2 flex justify-between bg-zinc-900 rounded text-white">
              <ActionIcon
                icon={<AiOutlineSend className="w-14 h-14" />}
                link="transfer"
                title="送る"
              />
              <ActionIcon
                icon={<AiOutlineScan className="w-14 h-14" />}
                link="scan"
                title="スキャン"
              />
              <ActionIcon
                icon={<AiFillMoneyCollect className="w-14 h-14" />}
                link="dreceive"
                title="受け取る"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BalanceView
