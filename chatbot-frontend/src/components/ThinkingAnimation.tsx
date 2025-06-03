import React, { useEffect, useState } from 'react';

interface ThinkingAnimationProps {
  text?: string;
  onComplete?: () => void;
  duration?: number;
}

export const ThinkingAnimation: React.FC<ThinkingAnimationProps> = ({ 
  text = 'Processando...',
  onComplete,
  duration = 3000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [webProgress, setWebProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spiderPosition, setSpiderPosition] = useState({ x: 0, y: 0 });

  const steps = [
    "Analisando requisitos...",
    "Configurando crawlers...",
    "Iniciando coleta de dados...",
    "Processando informações...",
    "Gerando insights..."
  ];

  useEffect(() => {
    // Mostrar os passos após um pequeno delay
    const stepsTimer = setTimeout(() => {
      setShowSteps(true);
    }, 500);

    // Timer para completar a animação
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    // Animação da web e dos passos
    const webInterval = setInterval(() => {
      setWebProgress(prev => {
        if (prev >= 100) {
          clearInterval(webInterval);
          return 100;
        }
        return prev + 1;
      });

      // Atualizar o passo atual
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        return nextStep >= steps.length ? prev : nextStep;
      });
    }, duration / 100);

    // Animação de rotação e movimento da aranha
    let lastTime = Date.now();
    const spiderInterval = setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      // Rotação suave baseada no tempo
      setRotation(prev => (prev + (deltaTime * 0.1)) % 360);
      
      // Movimento da aranha em um padrão circular
      const time = now / 1000;
      setSpiderPosition({
        x: Math.cos(time * 1.5) * 3,
        y: Math.sin(time * 1.5) * 3
      });
    }, 16); // 60fps

    return () => {
      clearTimeout(timer);
      clearTimeout(stepsTimer);
      clearInterval(webInterval);
      clearInterval(spiderInterval);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl my-4 border border-gray-700/50">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          {/* Web */}
          <div className="absolute inset-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Linhas da web */}
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * (Math.PI / 180);
                const x2 = 50 + 40 * Math.cos(angle);
                const y2 = 50 + 40 * Math.sin(angle);
                const progress = Math.min(webProgress, 100);
                const currentX2 = 50 + (x2 - 50) * (progress / 100);
                const currentY2 = 50 + (y2 - 50) * (progress / 100);
                return (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={currentX2}
                    y2={currentY2}
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="1"
                    className="transition-all duration-100"
                  />
                );
              })}
              {/* Círculos da web */}
              {[...Array(3)].map((_, i) => {
                const radius = 15 + i * 10;
                const progress = Math.min(webProgress, 100);
                const circumference = 2 * Math.PI * radius;
                const dash = (circumference * progress) / 100;
                return (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="1"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - dash}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-100"
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Aranha */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `translate(calc(-50% + ${spiderPosition.x}px), calc(-50% + ${spiderPosition.y}px)) rotate(${rotation}deg)`,
              transition: 'transform 0.016s linear'
            }}
          >
            <span 
              className="text-2xl"
              style={{
                animation: 'spiderFloat 2s ease-in-out infinite',
                display: 'inline-block'
              }}
            >
              🕷️
            </span>
          </div>
        </div>
        
        <div className="text-gray-200 font-medium text-lg">
          {text}
        </div>
        
        <div className="flex gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
        </div>
        
        <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>

      {/* Passos do Chain of Thought */}
      {showSteps && (
        <div className="pl-20 space-y-2">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-center gap-2 transition-all duration-300 ${
                index <= currentStep ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index < currentStep ? 'bg-blue-500' : 'bg-blue-500/30'
              }`} />
              <span className="text-gray-300 text-sm">{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Adicionar a animação globalmente
const style = document.createElement('style');
style.textContent = `
  @keyframes spiderFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }
`;
document.head.appendChild(style); 