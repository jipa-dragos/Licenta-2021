import { useState, useCallback, useRef, useEffect } from 'react'

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false)

  const activeHttpRequest = useRef([])

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true)

      const httpAbortCtrll = new AbortController()
      activeHttpRequest.current.push(httpAbortCtrll)

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrll.signal,
        })

        const responseData = await response.json()

        activeHttpRequest.current = activeHttpRequest.current.filter(reqCtrl => reqCtrl !== httpAbortCtrll )

        if (!response.ok) {
          throw new Error(responseData.message)
        }
        setIsLoading(false)

        return responseData
      } catch (err) {
        setIsLoading(false)
        throw err
      }
    },
    []
  )

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort())
    }
  }, [])

  return { isLoading, sendRequest }
}