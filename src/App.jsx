import React, { useMemo, useState } from 'react'
import LeavesBackground from './components/LeavesBackground.jsx'
      import Login from './components/Login.jsx'
import Admin from './components/Admin.jsx'
import PublicList from './components/PublicList.jsx'
import Gallery from './components/Gallery.jsx'
import { getClients, getClientByUserId } from './lib/storage.js'

export default function App() {
  const [view, setView] = useState('login')
  const [clientCode, setClientCode] = useState('')
  const [userId, setUserId] = useState('')
  const clients = useMemo(() => getClients(), [view])

  const openPublic = () => setView('public')
  const openAdmin = () => setView('admin')
  const enterWithId = (id) => {
    const found = getClientByUserId(id)
    if (!found) { alert('ID no encontrado'); return }
    setClientCode(found.code); setUserId(id); setView('gallery')
  }
  const openClientPublic = (code) => { setClientCode(code); setUserId(''); setView('gallery') }
  const backHome = () => { setView('login'); setClientCode(''); setUserId('') }

  return (
    <div className="min-h-screen relative">\n            <LeavesBackground />
      {view === 'login' && <Login onPublic={openPublic} onPrivate={enterWithId} onAdmin={openAdmin} />}
      {view === 'public' && <PublicList clients={Object.values(clients)} onOpenClient={(c)=>openClientPublic(c.code)} onBack={backHome} />}
      {view === 'admin' && <Admin onExit={backHome} />}
      {view === 'gallery' && <Gallery clientCode={clientCode} userId={userId} onBack={backHome} />}
    </div>
  )
}
