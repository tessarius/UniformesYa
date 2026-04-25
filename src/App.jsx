import { useState, useEffect } from 'react'
import { STORAGE_KEY } from './lib/constants'
import WelcomeScreen from './components/WelcomeScreen'
import ItemScreen from './components/ItemScreen'
import EditorScreen from './components/EditorScreen'
import QuoteScreen from './components/QuoteScreen'
import ConfirmationScreen from './components/ConfirmationScreen'
import { AdminLogin, AdminList, AdminDetail } from './components/AdminScreens'
import Icon from './components/Icon'

const loadState = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} }
  catch { return {} }
}

const saveState = (s) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) }
  catch { /* ignore */ }
}

export default function App() {
  const initial = loadState()

  const [screen, setScreen] = useState(initial.screen || 'welcome')
  const [editorData, setEditorData] = useState(initial.editorData || null)
  const [quoteData, setQuoteData] = useState(initial.quoteData || null)
  const [adminAuth, setAdminAuth] = useState(false)
  const [adminScreen, setAdminScreen] = useState('list')
  const [adminQuote, setAdminQuote] = useState(null)

  useEffect(() => {
    saveState({ screen, editorData, quoteData })
  }, [screen, editorData, quoteData])

  const go = (s) => setScreen(s)

  useEffect(() => {
    if (window.location.hash === '#admin') go('admin_login')
  }, [])

  const screens = {
    welcome: <WelcomeScreen onStart={() => go('items')} />,

    items: <ItemScreen onBack={() => go('welcome')} onSelect={() => go('editor')} />,

    editor: (
      <EditorScreen
        savedState={editorData}
        onBack={() => go('items')}
        onConfirm={(data) => { setEditorData(data); go('quote') }}
        onSaveState={(data) => setEditorData(data)}
      />
    ),

    quote: (
      <QuoteScreen
        editorData={editorData}
        onBack={() => go('editor')}
        onConfirm={(data) => { setQuoteData(data); go('confirm') }}
      />
    ),

    confirm: (
      <ConfirmationScreen
        editorData={editorData}
        quoteData={quoteData}
        onBack={() => go('quote')}
        onDone={() => { saveState({}); go('welcome') }}
      />
    ),

    admin_login: <AdminLogin onLogin={() => { setAdminAuth(true); go('admin') }} />,

    admin: adminAuth ? (
      adminScreen === 'list'
        ? <AdminList
            onSelect={(q) => { setAdminQuote(q); setAdminScreen('detail') }}
            onLogout={() => { setAdminAuth(false); go('welcome') }}
          />
        : <AdminDetail
            quote={adminQuote}
            onBack={() => setAdminScreen('list')}
          />
    ) : <AdminLogin onLogin={() => { setAdminAuth(true); go('admin') }} />,
  }

  return (
    <div className="app-shell">
      {screens[screen] || screens.welcome}

      {screen === 'welcome' && (
        <div className="absolute bottom-3 right-3">
          <button onClick={() => go('admin_login')}
            className="bg-white/[0.04] border border-dark-border rounded-lg py-1.5 px-2.5 text-[11px] text-text-muted cursor-pointer">
            Admin
          </button>
        </div>
      )}
    </div>
  )
}
