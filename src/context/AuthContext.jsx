import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [teacher, setTeacher] = useState(() => {
    const saved = sessionStorage.getItem('echo_teacher')
    return saved ? JSON.parse(saved) : null
  })

  const login = useCallback(async (username, password) => {
    const res = await fetch(`http://localhost:3001/teachers?username=${username}`)
    const teachers = await res.json()
    if (!teachers.length) throw new Error('Kullanıcı adı bulunamadı.')
    const t = teachers[0]
    if (t.password !== password) throw new Error('Şifre hatalı.')
    // fetch counselor info
    const cRes = await fetch(`http://localhost:3001/counselors/${t.counselorId}`)
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
