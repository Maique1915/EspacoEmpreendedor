document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const html = document.documentElement;

    // --- LÓGICA DO ALTO CONTRASTE ---
    const contrastBtn = document.getElementById('contrast-btn');
    
    // Função para ativar/desativar o contraste
    const toggleContrast = () => {
        body.classList.toggle('high-contrast');
        // Salva a preferência no navegador
        if (body.classList.contains('high-contrast')) {
            localStorage.setItem('highContrast', 'true');
        } else {
            localStorage.removeItem('highContrast');
        }
    };

    // Adiciona o evento de clique ao botão
    contrastBtn.addEventListener('click', toggleContrast);

    // Verifica se a preferência já está salva ao carregar a página
    if (localStorage.getItem('highContrast') === 'true') {
        body.classList.add('high-contrast');
    }


    // --- LÓGICA DO TAMANHO DA FONTE ---
    const increaseFontBtn = document.getElementById('increase-font-btn');
    const decreaseFontBtn = document.getElementById('decrease-font-btn');
    
    // Função para alterar o tamanho da fonte
    const changeFontSize = (amount) => {
        let currentSize = parseFloat(getComputedStyle(html).fontSize);
        // Limita o tamanho para não ficar muito grande ou pequeno
        if ((amount > 0 && currentSize < 24) || (amount < 0 && currentSize > 10)) {
            const newSize = currentSize + amount;
            html.style.fontSize = `${newSize}px`;
            // Salva a preferência
            localStorage.setItem('fontSize', newSize);
        }
    };

    // Adiciona eventos de clique aos botões
    increaseFontBtn.addEventListener('click', () => changeFontSize(1));
    decreaseFontBtn.addEventListener('click', () => changeFontSize(-1));

    // Verifica a preferência de fonte ao carregar a página
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        html.style.fontSize = `${savedFontSize}px`;
    }
});