import { useEffect, useMemo, useRef, useState } from 'react'

const useDark = () => {
  const { current: domEl } = useRef(document.documentElement)
  const [isDark, setDark] = useState(
    () =>
      window.matchMedia('(prefers-color-scheme: dark)').matches ||
      domEl.classList.contains('dark'),
  )

  useEffect(() => {
    if (isDark) {
      domEl.classList.add('dark')
    } else {
      domEl.classList.remove('dark')
    }
  }, [domEl.classList, isDark])

  const actions = useMemo(() => {
    const setDarkMode = () => setDark(true)
    const setLightMode = () => setDark(false)
    const toggleDarkMode = () => setDark((prev) => !prev)
    return {
      setDarkMode,
      setLightMode,
      toggleDarkMode,
    }
  }, [])

  return [
    isDark,
    {
      setDark,
      ...actions,
    },
  ]
}

export { useDark }
