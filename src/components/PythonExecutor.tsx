import { useEffect, useRef, useState } from 'react';

// Carregamento dinâmico do Pyodide
let pyodidePromise: any = null;
const loadPyodideInstance = async () => {
  if (!pyodidePromise) {
    pyodidePromise = window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
    });
  }
  return pyodidePromise;
};

interface PythonExecutorProps {
  code: string;
}

export const PythonExecutor = ({ code }: PythonExecutorProps) => {
  const [output, setOutput] = useState<string>('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runPython = async () => {
      setLoading(true);
      setOutput('');
      setImageSrc(null);
      try {
        // @ts-ignore
        const pyodide = await loadPyodideInstance();
        await pyodide.loadPackage(['matplotlib', 'micropip']);
        await pyodide.runPythonAsync(`
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt
import io, base64, sys
sys.stdout = io.StringIO()
`);
        await pyodide.runPythonAsync(code + `\nplt.tight_layout()`);
        const pyCode = `buf = io.BytesIO()\nplt.savefig(buf, format='png')\nbuf.seek(0)\nimg_str = base64.b64encode(buf.read()).decode('utf-8')\nprint(img_str)`;
        const imgStr = await pyodide.runPythonAsync(pyCode + '\nplt.close()');
        setImageSrc('data:image/png;base64,' + imgStr.trim());
        setOutput('');
      } catch (err: any) {
        setOutput(err.toString());
      }
      setLoading(false);
    };
    runPython();
    // eslint-disable-next-line
  }, [code]);

  return (
    <div className="my-4">
      {loading && <div className="text-sm text-muted-foreground">Executando código Python...</div>}
      {imageSrc && (
        <img src={imageSrc} alt="Gráfico Python" className="max-w-full border rounded-md my-2" />
      )}
      {output && (
        <div ref={outputRef} className="bg-destructive/10 text-destructive p-2 rounded-md text-xs whitespace-pre-wrap">
          {output}
        </div>
      )}
    </div>
  );
}; 