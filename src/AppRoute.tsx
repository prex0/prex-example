import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
  } from "react-router-dom";
import { Layout } from "./pages/Layout";
import BalanceView from './pages/BalanceView'
import MintView from './pages/MintView'
import TransferView from './pages/TransferView'
import ReceiveView from './pages/ReceiveView'
import ProfileView from './pages/ProfileView'
import HistoryView from './pages/HistoryView'
import ScanView from './pages/ScanView'
import DirectTransferView from './pages/DirectTransferView'
import DirectReceiveView from './pages/DirectReceiveView'
import SettingsView from './pages/SettingsView'
import NotFound from "./components/NotFound";



export const appRoute = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout/>}>
        <Route path="/" element={<BalanceView />} />
        <Route path="/mint" element={<MintView />} />
        <Route path="/transfer" element={<TransferView />} />
        <Route path="/receive" element={<ReceiveView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/history" element={<HistoryView />} />
        <Route path="/scan" element={<ScanView />} />
        <Route path="/dtransfer" element={<DirectTransferView />} />
        <Route path="/dreceive" element={<DirectReceiveView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="*" element={<NotFound/>} />
      </Route>
    )
  );
  