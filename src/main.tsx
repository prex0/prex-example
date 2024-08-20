import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrexProvider } from '@prex0/prex-react'
import App from './App.tsx'
import './index.css'
import {
  CHAIN_ID,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS
} from './constants.ts'
import ReactModal from 'react-modal'

ReactModal.setAppElement('#root')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrexProvider
      chainId={CHAIN_ID}
      ruleId={Number(import.meta.env.VITE_RULE_ID)}
      apiKey={import.meta.env.VITE_APP_SIG}
      maxFeePerGas={MAX_FEE_PER_GAS}
      maxPriorityFeePerGas={MAX_PRIORITY_FEE_PER_GAS}
    >
      <App />
    </PrexProvider>
  </React.StrictMode>
)
