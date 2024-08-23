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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

ReactModal.setAppElement('#root')

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrexProvider
      chainId={CHAIN_ID}
      ruleId={Number(import.meta.env.VITE_POLICY_ID)}
      apiKey={import.meta.env.VITE_API_KEY}
      maxFeePerGas={MAX_FEE_PER_GAS}
      maxPriorityFeePerGas={MAX_PRIORITY_FEE_PER_GAS}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </PrexProvider>
  </React.StrictMode>
)
