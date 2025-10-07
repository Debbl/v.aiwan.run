import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { routes } from './router'

function App() {
  const pagesRoutes = routes.slice(1)

  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path={routes[0].path} element={routes[0].element} />

        {pagesRoutes.map((r) => (
          <Route
            key={r.id}
            path={r.path}
            element={
              <div>
                <div className='fixed bottom-1 left-2 z-10'>
                  <button
                    type='button'
                    className='text-gray-800 opacity-0 transition-all duration-300 ease-in hover:opacity-100'
                  >
                    <a href='/' className='underline'>
                      {'>cd ..'}
                    </a>
                  </button>
                </div>

                {r.element}
              </div>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default App
