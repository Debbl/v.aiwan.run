import { RouterProvider } from "react-router";
import router from "./router";

function App() {
  return (
    <div className="flex items-center mt-32 flex-col">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
