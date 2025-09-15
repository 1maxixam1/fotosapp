import React, { useEffect, useMemo, useState } from 'react'
import AnimatedBackground from './components/AnimatedBackground.jsx'
import Header from './components/Header.jsx'
import Login from './components/Login.jsx'
import Gallery from './components/Gallery.jsx'
import Admin from './components/Admin.jsx'
import { ensureSeed, getClients, hasUser, getUserPhotos, getUsersAll } from './lib/storage.js'

const App = () => {
  const [view, setView] = useState('login') // login | gallery | admin | public_all
  const [clientCode, setClientCode] = useState('')
  const [privateAccess, setPrivateAccess] = useState(false)
  const [currentUserId, setCurrentUserId] = useState('')

  const clients = useMemo(() => getClients(), [view]) // reload on view change
  const client = clientCode ? clients[clientCode] : null

  useEffect(() => {
    ensureSeed()
  }, [])

  const handlePublic = () => {
    setClientCode('')
    setPrivateAccess(false)
    setView('public_all')
  }

  const handlePrivate = (_codeIgnored, userId) => {
    if (!userId) {
      alert('Ingresa tu ID de usuario para ver fotos privadas.')
      return
    }
    const map = getUsersAll()
    let owner = ''
    for (const code of Object.keys(map)) {
      if ((map[code] || []).includes(userId)) { owner = code; break }
    }
    if (!owner) { alert('ID no autorizado.'); return }
    setClientCode(owner)
    setCurrentUserId(userId)
    setPrivateAccess(true)
    setView('gallery')
  }

  return (
    <div className="font-sans min-h-screen relative">
      <AnimatedBackground />
      {view === 'login' && (
        <Login
          onPublic={handlePublic}
          onPrivate={handlePrivate}
          onMaster={() => setView('admin')}
        />
      )}

{view === 'public_all' && (
  <>
    <Header
      title={'Galería pública'}
      subtitle={'Todas las fotos públicas'}
      onLogout={() => setView('login')}
      onAdmin={() => setView('admin')}
    />
    <Gallery
      client={{ name: 'Públicas', publicPhotos: Object.values(clients).flatMap(c => c.publicPhotos || []) }}
      showPrivate={false}
    />
  </>
)}

      {view === 'gallery' && client && (
        <>
          <Header
            title={client?.name}
            subtitle={`${privateAccess ? 'Acceso Completo' : 'Fotos Públicas'} • ${(privateAccess ? client.publicPhotos.length + client.privatePhotos.length : client.publicPhotos.length)} fotos`}
            onLogout={() => setView('login')}
            onAdmin={() => setView('admin')}
          />
          <Gallery client={client} showPrivate={privateAccess} userPrivatePhotos={privateAccess ? getUserPhotos(client.code, currentUserId) : []} />
        </>
      )}

      {view === 'admin' && (
        <Admin onExit={() => setView('login')} />
      )}
    </div>
  )
}

export default App
