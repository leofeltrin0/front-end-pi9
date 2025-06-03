import { useEffect, useState } from 'react'
import Chat from './components/Chat'
import { ModelSelect } from './components/ModelSelect'
import { useChat } from './hooks/useChat'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const {
    availableModels,
    selectedModel,
    setSelectedModel,
  } = useChat();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Barra Lateral */}
      <aside className="w-64 border-r bg-card p-4 flex flex-col shadow-md">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <img src="/logo.jpg" alt="Logo" className="h-10 w-10" />
          <h2 className="text-xl font-semibold">Arachinidata IA</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Modelo</h3>
            <ModelSelect 
              models={availableModels}
              selected={selectedModel}
              onSelectChange={setSelectedModel}
            />
          </div>
          {/* Outras opções de configuração */}
          <div>
            <h3 className="text-sm font-medium mb-2">Outras Configurações</h3>
            <div className="p-2 text-muted-foreground">Em breve...</div>
          </div>
        </div>

      </aside>

      {/* Área Principal do Chat */}
      <main className="flex-1 flex flex-col">
        <Chat />
      </main>
    </div>
  )
}

export default App
