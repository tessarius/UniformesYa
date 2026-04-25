// ─── APP ROOT — routing + localStorage persistence ─────────────────────────

const STORAGE_KEY = 'uniformesya_state';

const loadState = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch(e) { return {}; }
};

const saveState = (s) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
  catch(e) {}
};

const App = () => {
  const initial = loadState();

  const [screen,     setScreen]     = React.useState(initial.screen     || 'welcome');
  const [editorData, setEditorData] = React.useState(initial.editorData || null);
  const [quoteData,  setQuoteData]  = React.useState(initial.quoteData  || null);
  // Admin
  const [adminAuth,   setAdminAuth]   = React.useState(false);
  const [adminScreen, setAdminScreen] = React.useState('list');
  const [adminQuote,  setAdminQuote]  = React.useState(null);

  // Persist on change
  React.useEffect(() => {
    saveState({ screen, editorData, quoteData });
  }, [screen, editorData, quoteData]);

  const go = (s) => setScreen(s);

  // ── Admin shortcut via URL hash ──────────────────────────────────────────
  React.useEffect(() => {
    if (window.location.hash === '#admin') go('admin_login');
  }, []);

  const screens = {
    welcome: (
      <WelcomeScreen onStart={() => go('items')}/>
    ),

    items: (
      <ItemScreen
        onBack={() => go('welcome')}
        onSelect={() => go('editor')}
      />
    ),

    editor: (
      <EditorScreen
        savedState={editorData}
        onBack={() => go('items')}
        onConfirm={(data) => {
          setEditorData(data);
          go('quote');
        }}
        onSaveState={(data) => setEditorData(data)}
      />
    ),

    quote: (
      <QuoteScreen
        editorData={editorData}
        onBack={() => go('editor')}
        onConfirm={(data) => {
          setQuoteData(data);
          go('confirm');
        }}
      />
    ),

    confirm: (
      <ConfirmationScreen
        editorData={editorData}
        quoteData={quoteData}
        onBack={() => go('quote')}
        onDone={() => {
          saveState({});
          go('welcome');
        }}
      />
    ),

    admin_login: (
      <AdminLogin onLogin={() => { setAdminAuth(true); go('admin'); }}/>
    ),

    admin: adminAuth ? (
      adminScreen === 'list'
        ? <AdminList
            onSelect={(q) => { setAdminQuote(q); setAdminScreen('detail'); }}
            onLogout={() => { setAdminAuth(false); go('welcome'); }}
          />
        : <AdminDetail
            quote={adminQuote}
            onBack={() => setAdminScreen('list')}
          />
    ) : <AdminLogin onLogin={() => { setAdminAuth(true); go('admin'); }}/>,
  };

  return (
    <div style={{
      minHeight:'100vh', background:'#080F1E',
      fontFamily:'DM Sans, sans-serif',
      maxWidth:430, margin:'0 auto',
      position:'relative',
    }}>
      {screens[screen] || screens.welcome}

      {/* Admin access hint (subtle) */}
      {screen === 'welcome' && (
        <div style={{position:'fixed',bottom:12,right:12}}>
          <button onClick={() => go('admin_login')}
            style={{background:'rgba(255,255,255,0.04)',border:'1px solid #1C3050',borderRadius:8,
              padding:'6px 10px',fontSize:11,color:'#3D5878',cursor:'pointer',fontFamily:'inherit'}}>
            Admin
          </button>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
