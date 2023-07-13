import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { routes } from "./router";

function App() {
  const pagesRoutes = routes.slice(1);

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path={routes[0].path} element={routes[0].element} />
        {pagesRoutes.map((r) => (
          <Route
            key={r.id}
            path={r.path}
            element={
              <div>
                <div className="fixed left-0 top-0 z-10">
                  <button className="h-8 w-8 bg-black/40 text-2xl leading-6 text-gray-50 opacity-60 hover:opacity-100">
                    <a href="/">{"<"}</a>
                  </button>
                </div>

                {r.element}
              </div>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
