import { useCallback, useState } from 'react'
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner'
import { Header } from '../components/Header'

const ScanView = () => {
  const [error, setError] = useState<string | null>(null)

  const onScan = useCallback((result: IDetectedBarcode[]) => {
    console.log(result)

    location.href = result[0].rawValue
  }, [])

  const onError = useCallback((error: unknown) => {
    console.error(error)

    setError('スキャンに失敗しました。スキャン機能が許可されているかご確認ください。')
  }, [])

  return (
    <div>
      <Header title="スキャン" />
      <div className="w-full h-full">
        <div className="mt-14">
          <Scanner onScan={onScan} onError={onError}/>
        </div>
        <div className='text-xs text-red-600'>
          {error ? error : null}
        </div>
      </div>
    </div>
  )
}

export default ScanView
