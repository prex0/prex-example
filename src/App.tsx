import { RouterProvider } from "react-router-dom";
import { appRoute } from "./AppRoute";

const App = () => {
 
  return (<div className="text-zinc-800">
    <RouterProvider router={appRoute}/>
  </div>
  )
}

export default App
