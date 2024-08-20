import { RouterProvider } from 'react-router-dom'
import { appRoute } from './AppRoute'

const App = () => {
  return (
    <div className="bg-zinc-50 text-zinc-800">
      <RouterProvider router={appRoute} />
    </div>
  )
}

export default App
