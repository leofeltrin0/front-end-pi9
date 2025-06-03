export const mockResponses: { [key: string]: { message: string; codeBlocks?: { code: string; language: string }[]; files?: { name: string; content: string }[]; images?: string[] } } = {
  'monitorar preços': {
    message: `
[Chain of Thought]
Analisando requisitos para monitoramento de preços...

Configurando crawlers para coleta de dados...

Iniciando coleta de dados dos sites...

Processando informações coletadas...

Gerando insights sobre os preços...

Aqui está o relatório de preços atualizado para a RTX 4070:

| Produto                      | Preço (R$) | Loja        | Avaliação | Destaques                                  |
|------------------------------|------------|-------------|-----------|--------------------------------------------|
| Gigabyte GeForce RTX 4070    | 4.299,00   | Kabum!      | 4.8/5     | Melhor avaliada, Ótimo custo-benefício     |
| Zotac Gaming GeForce RTX 4070| 4.150,00   | Pichau      | 4.5/5     | Preço competitivo                          |
| MSI GeForce RTX 4070 Gaming X| 4.350,00   | TerabyteShop| 4.7/5     | Excelente sistema de refrigeração        |
| Asus Dual GeForce RTX 4070   | 4.200,00   | Chipart     | 4.6/5     | Design compacto, Boa refrigeração         |

Fontes dos dados:
- Kabum!
- Pichau
- TerabyteShop
- Chipart

Recomendações:
- **Melhor Avaliada:** Gigabyte GeForce RTX 4070 (4.8/5)
- **Melhor Custo-Benefício:** Gigabyte GeForce RTX 4070 (R$ 4.299,00)
- **Melhor Refrigeração:** MSI GeForce RTX 4070 Gaming X (Sistema Tri Frozr 3)

`,
    images: [
      'https://images1.kabum.com.br/produtos/fotos/517751/placa-de-video-rtx-4070-super-gigabyte-windforce-nvidia-geforce-12gb-gddr6-dlss-ray-tracing-gv-n407swf3-12gd_1707245338_g.jpg',
      'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/news/geforce-rtx-4070/geforce-rtx-4070-newsfeed.png'
    ]
  },
  'análise': {
    message: `
[Chain of Thought]
Analisando dados de performance e comparativos...

Processando benchmarks e reviews...

Gerando insights sobre o desempenho...

Aqui está a análise detalhada da RTX 4070:

A RTX 4070 oferece um excelente equilíbrio entre performance e eficiência energética, superando a RTX 3080 em benchmarks com um consumo significativamente menor.

**Recomendações:**
- Ideal para quem busca alta performance em jogos e aplicações com menor gasto de energia.
- Considerar upgrades de fontes mais antigas devido ao conector de energia.
`,
    codeBlocks: [
      {
        code: `import pandas as pd
import matplotlib.pyplot as plt

data = {
    'Modelo': ['RTX 4070', 'RTX 3080', 'RX 7800 XT'],
    'Benchmark (Pontos)': [12000, 10500, 11000],
    'Consumo (Watts)': [200, 320, 260]
}

df = pd.DataFrame(data)

print('Análise de Performance:')
print(df)

# Gráfico de Performance
plt.figure(figsize=(8, 4))
sns.barplot(x='Modelo', y='Benchmark (Pontos)', data=df)
plt.title('Comparativo de Performance')
plt.ylabel('Pontuação de Benchmark')
plt.show()

# Gráfico de Consumo
plt.figure(figsize=(8, 4))
sns.barplot(x='Modelo', y='Consumo (Watts)', data=df)
plt.title('Comparativo de Consumo de Energia')
plt.ylabel('Watts')
plt.show()

`,
        language: 'python'
      }
    ]
  },
  'relatório': {
    message: `
[Chain of Thought]
Coletando dados para o relatório completo...

Processando informações de mercado e feedback de usuários...

Gerando visualizações e resumo executivo...

Aqui está o relatório completo sobre a RTX 4070:

**Resumo Executivo:**
A RTX 4070 se estabelece como uma forte concorrente no mercado de GPUs de alto desempenho, oferecendo excelente eficiência e boa performance. O preço de lançamento foi um ponto de discussão, mas a tendência de queda a torna uma opção cada vez mais atraente. A disponibilidade tem sido razoável. O feedback geral dos usuários é positivo, destacando a performance em jogos e o menor consumo de energia.

**Próximos Passos:**
- Continuar monitorando a tendência de preços.
- Analisar o feedback de longo prazo dos usuários.
- Comparar com futuros lançamentos de concorrentes.
`,
    codeBlocks: [
      {
        code: `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from math import pi

data = {
    'Aspecto': ['Performance', 'Preço', 'Consumo', 'Disponibilidade'],
    'Avaliação': [9, 7, 10, 8]
}

df = pd.DataFrame(data)

# Gráfico de Radar (exemplo conceitual)
labels = df['Aspecto'].tolist() + [df['Aspecto'].tolist()[0]]
stats = df['Avaliação'].tolist() + [df['Avaliação'].tolist()[0]]

angles = [n / float(len(labels)) * 2 * pi for n in range(len(labels))]

plt.figure(figsize=(6, 6))
ax = plt.subplot(111, polar=True)

plt.xticks(angles[:-1], labels)

ax.plot(angles, stats, 'o-', linewidth=2)
ax.fill(angles, stats, alpha=0.2)

ax.set_title('Avaliação Geral da RTX 4070', va='bottom')

plt.show()

# Gráfico de Barras para Avaliação
plt.figure(figsize=(8, 4))
sns.barplot(x='Aspecto', y='Avaliação', data=df)
plt.title('Avaliação por Aspecto')
plt.ylim(0, 10)
plt.show()

# Histograma de Feedback (exemplo conceitual)
feedback_scores = [8, 9, 7, 8, 10, 9, 9, 7, 8, 9, 10]
plt.figure(figsize=(8, 4))
plt.hist(feedback_scores, bins=5, edgecolor='black')
plt.title('Distribuição do Feedback de Usuários')
plt.xlabel('Pontuação de Feedback')
plt.ylabel('Frequência')
plt.show()

# Gráfico de Linha para Tendência de Preço (exemplo conceitual)
meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai']
precos_medios = [4500, 4450, 4300, 4250, 4200]
plt.figure(figsize=(8, 4))
plt.plot(meses, precos_medios, marker='o')
plt.title('Tendência de Preço Médio da RTX 4070')
plt.xlabel('Mês')
plt.ylabel('Preço Médio (R$)')
plt.grid(True)
plt.show()

`,
        language: 'python'
      }
    ]
  },
}; 