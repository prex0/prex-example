import { useCallback } from 'react'
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner'
import { Header } from '../components/Header'

const ScanView = () => {
  const onScan = useCallback((result: IDetectedBarcode[]) => {
    console.log(result)

    location.href = result[0].rawValue
  }, [])

  return (
    <div>
      <Header title="スキャン" />
      <div className="w-full h-full">
        <div className="mt-14">
          <Scanner onScan={onScan} />
        </div>
      </div>
    </div>
  )
}

export default ScanView
