import { useState, useEffect } from 'react';
import type { PyodideAPI } from 'pyodide';

interface PyodideStatus {
  pyodide: typeof PyodideAPI | null;
  isLoading: boolean;
  error: string | null;
}

interface ExecuteResult {
  output: string;
  error: string;
  plot?: string;
}

export function usePyodide() {
  const [status, setStatus] = useState<PyodideStatus>({
    pyodide: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        // @ts-ignore - Pyodide é carregado globalmente
        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
        });

        // Instalar pacotes necessários
        await pyodide.loadPackage(['numpy', 'matplotlib']);

        // Configurar matplotlib e suprimir avisos
        await pyodide.runPythonAsync(`
import warnings
warnings.filterwarnings('ignore')
import matplotlib
matplotlib.use('AGG')
        `);

        setStatus({
          pyodide,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setStatus({
          pyodide: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Erro ao carregar Pyodide',
        });
      }
    };

    loadPyodide();
  }, []);

  const executePythonCode = async (code: string): Promise<ExecuteResult> => {
    if (!status.pyodide) {
      return {
        output: '',
        error: 'Pyodide não está carregado',
      };
    }

    try {
      // Configurar StringIO para capturar a saída
      await status.pyodide.runPythonAsync(`
import sys
from io import StringIO, BytesIO
import base64
import warnings
warnings.filterwarnings('ignore')
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);

      // Executar o código com matplotlib configurado
      const wrappedCode = `
import warnings
warnings.filterwarnings('ignore')
import matplotlib
matplotlib.use('AGG')
${code}
      `;
      await status.pyodide.runPythonAsync(wrappedCode);

      // Verificar se há um gráfico matplotlib
      const hasPlot = await status.pyodide.runPythonAsync(`
import matplotlib.pyplot as plt
has_plot = len(plt.get_fignums()) > 0
if has_plot:
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', dpi=100)
    buf.seek(0)
    plot_data = base64.b64encode(buf.read()).decode('utf-8')
    plt.close('all')
else:
    plot_data = None
has_plot, plot_data
      `);

      // Capturar saída
      const output = status.pyodide.runPython('sys.stdout.getvalue()');
      const error = status.pyodide.runPython('sys.stderr.getvalue()');

      return {
        output: output || '',
        error: error || '',
        plot: hasPlot[0] ? `data:image/png;base64,${hasPlot[1]}` : undefined,
      };
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Erro ao executar código Python',
      };
    }
  };

  return {
    pyodideStatus: status,
    executePythonCode,
  };
}
