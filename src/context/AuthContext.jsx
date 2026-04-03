import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const BASE = import.meta.env.VITE_API_URL || 'https://gubi-guvenli-bildirim.onrender.com'

// Fetch with one automatic retry for Render cold-start (network errors)
async function fetchWithRetry(url, retries = 2, delayMs = 4000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      return res
    } catch (err) {
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, delayMs))
      } else {
        throw err
      }
    }
  }
}

export function AuthProvider({ children }) {
  const [teacher, setTeacher] = useState(() => {
    const saved = sessionStorage.getItem('echo_teacher')
    return saved ? JSON.parse(saved) : null
  })

  const login = useCallback(async (username, password) => {
    const res = await fetchWithRetry(`${BASE}/teachers?username=${username}`)
    const teachers = await res.json()
    if (!teachers.length) throw new Error('Kullanıcı adı bulunamadı.')
    const t = teachers[0]
    if (t.password !== password) throw new Error('Şifre hatalı.')
    // fetch counselor info
    const cRes = await fetchWithRetry(`${BASE}/counselors/${t.counselorId}`)
    const counselor = await cRes.json()
    const session = { ...t, counselor }
    sessionStorage.setItem('echo_teacher', JSON.stringify(session))
    setTeacher(session)
    return session
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('echo_teacher')
    setTeacher(null)
  }, [])

  return (
    <AuthContext.Provider value={{ teacher, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
