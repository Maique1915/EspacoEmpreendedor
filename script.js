document.addEventListener('DOMContentLoaded', function() {
    // ===================================================================
    // SLIDER AUTOMÁTICO ADAPTADO PARA O MÓDULO DE BANNERS DO JOOMLA
    // ===================================================================
    const sliderContainer = document.querySelector('.mod-banners');

    // Só executa o código do slider se o contêiner existir na página
    if (sliderContainer) {
        const slides = sliderContainer.querySelectorAll('.mod-banners__item');

        if (slides.length > 1) { // Só ativa o slider se houver mais de um slide
            let currentIndex = 0;
            let slideInterval;

            // -- Injeta os controles que não existem no HTML do módulo --
            const prevBtn = document.createElement('button');
            prevBtn.className = 'slider-nav prev';
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.setAttribute('aria-label', 'Slide Anterior');

            const nextBtn = document.createElement('button');
            nextBtn.className = 'slider-nav next';
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.setAttribute('aria-label', 'Próximo Slide');

            const paginationContainer = document.createElement('div');
            paginationContainer.className = 'slider-pagination';

            sliderContainer.appendChild(prevBtn);
            sliderContainer.appendChild(nextBtn);
            sliderContainer.appendChild(paginationContainer);
            // -----------------------------------------------------------

            // Criar pontos de paginação
            slides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('pagination-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetInterval();
                });
                paginationContainer.appendChild(dot);
            });

            // Ativa o primeiro slide
            slides[0].classList.add('active');
            const paginationDots = paginationContainer.querySelectorAll('.pagination-dot');

            function goToSlide(index) {
                slides[currentIndex].classList.remove('active');
                if(paginationDots[currentIndex]) paginationDots[currentIndex].classList.remove('active');
                
                currentIndex = index;
                
                slides[currentIndex].classList.add('active');
                if(paginationDots[currentIndex]) paginationDots[currentIndex].classList.add('active');
                
                // Para slider do tipo "fade", a opacidade é controlada pelo CSS.
                // Para slider do tipo "slide", seria necessário um transform:
                // sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                // O CSS que te passei anteriormente usa 'opacity', então não precisa da linha acima.
            }

            function nextSlide() {
                let nextIndex = (currentIndex + 1) % slides.length;
                goToSlide(nextIndex);
            }

            function prevSlide() {
                let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
                goToSlide(prevIndex);
            }

            function startInterval() {
                slideInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
            }
            
            function resetInterval() {
                clearInterval(slideInterval);
                startInterval();
            }

            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });

            // Iniciar autoplay
            startInterval();
        }
    }


    // ===================================================================
    // BOTÃO "VOLTAR AO TOPO"
    // ===================================================================
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===================================================================
    // ANIMAÇÕES AO ROLAR A PÁGINA (SCROLL)
    // ===================================================================
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                
                if (entry.target.classList.contains('counter-number')) {
                    startCounter(entry.target);
                }
                
                if (!entry.target.classList.contains('counter-number')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1
    });
    
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll, .animate-balloon, .animate-slide-in-pair');
    elementsToAnimate.forEach(el => animationObserver.observe(el));


    // ===================================================================
    // FUNCIONALIDADE DOS CONTADORES (COUNTERS)
    // ===================================================================
    function startCounter(counterElement) {
        const target = +counterElement.getAttribute('data-target');
        let current = 0;
        const increment = target / 100; // Define o incremento para completar em 100 passos
        const stepTime = 20; // Duração de cada passo (20ms)

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                counterElement.innerText = target;
            } else {
                counterElement.innerText = Math.ceil(current);
            }
        }, stepTime);
        
        animationObserver.unobserve(counterElement);
    }
    const counters = document.querySelectorAll('.counter-number');
    counters.forEach(counter => animationObserver.observe(counter));


    // ===================================================================
    // SLIDER DA TIMELINE
    // ===================================================================
    const timelineContainer = document.querySelector('.timeline-slides-container');
    if (timelineContainer) {
        const timelineSlides = document.querySelectorAll('.timeline-slide');
        const timelineNextBtn = document.querySelector('.timeline-nav-btn.next');
        const timelinePrevBtn = document.querySelector('.timeline-nav-btn.prev');
        let timelineIndex = 0;

        function getVisibleSlides() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }

        function updateTimeline() {
            const visibleSlides = getVisibleSlides();
            const totalSlides = timelineSlides.length;
            const maxIndex = Math.max(0, totalSlides - visibleSlides);
            
            if (timelineIndex > maxIndex) timelineIndex = maxIndex;
            
            const slideWidth = timelineSlides[0].offsetWidth;
            timelineContainer.style.transform = `translateX(-${timelineIndex * slideWidth}px)`;

            timelinePrevBtn.disabled = timelineIndex === 0;
            timelineNextBtn.disabled = timelineIndex >= maxIndex;
        }

        timelineNextBtn.addEventListener('click', () => {
            const visibleSlides = getVisibleSlides();
            if (timelineIndex < timelineSlides.length - visibleSlides) {
                timelineIndex++;
                updateTimeline();
            }
        });

        timelinePrevBtn.addEventListener('click', () => {
            if (timelineIndex > 0) {
                timelineIndex--;
                updateTimeline();
            }
        });
        
        window.addEventListener('resize', updateTimeline);
        updateTimeline();
    }


    // ===================================================================
    // FUNCIONALIDADE DO MODAL DE INFORMAÇÕES
    // ===================================================================
    const modal = document.getElementById('info-modal');
if (modal) {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const modalContentData = {
        'abrir-empresa': {
            title: 'Abra aqui sua empresa',
            content: `
                <h4>Alvará Online</h4>
                <p>A Junta Comercial do Estado do Rio de Janeiro – JUCERJA - em parceria com o município de Petrópolis, firmou convênio para a implantação da 1ª Delegacia da Jucerja no Estado do Rio de Janeiro. A implantação da delegacia em Petrópolis facilitou a abertura de empresas na cidade. O serviço é oferecido no Espaço Empreendedor. Atualmente, pode-se emitir alvará eletronicamente em um prazo mínimo de 24 horas.</p>
            `
        },
        'nota-imperial': {
            title: 'Nota Imperial eletrônica',
            content: `
                <p>A Nota Imperial Eletrônica é um facilitador para os prestadores de serviços em Petrópolis e também para os contadores. O documento é emitido e armazenado pelo sistema da Prefeitura para registrar as operações e prestações de serviços sujeitos ao ISS - Imposto Sobre Serviços.</p>
                <a href="https://www.petropolis.rj.gov.br/pmp/index.php/servicos-na-web/fazenda/nota-imperial.html" target="_blank" rel="noopener noreferrer">Acesse aqui o serviço</a>
            `
        },
        'balcao': {
            title: 'Balcão de emprego',
            content: `
                <p>O Balcão de Empregos da Prefeitura de Petrópolis é um serviço do Departamento de Trabalho e Renda (Detra) que conecta trabalhadores a oportunidades de emprego na cidade.</p>
                <h4>Serviços Oferecidos:</h4>
                <ul>
                    <li>Cadastro de currículos no sistema do Balcão de Empregos.</li>
                    <li>Orientação profissional.</li>
                    <li>Encaminhamento para vagas de emprego disponíveis.</li>
                </ul>
                <hr>
                <p><strong>Onde se cadastrar:</strong><br>
                O cadastro pode ser feito presencialmente no Departamento de Trabalho e Renda (Detra/Casa do Trabalhador), localizado na Rua Doutor Porciúncula, s/nº, Centro (prédio do Centro Administrativo Frei Antônio Moser, antigo Hipershopping Petrópolis).<br>
                <strong>Horário:</strong> Segunda a sexta-feira, das 8h às 16h (fechado para almoço de 13h às 14h).</p>
            `
        },
        'mei': {
            title: 'MEI – Microempreendedor Individual',
            content: `
                <p>O MEI é o pequeno empresário individual que atende as seguintes condições:</p>
                <ul>
                    <li>Tem faturamento limitado a R$ 81.000,00 por ano;</li>
                    <li>Não participa como sócio, administrador ou titular de outra empresa;</li>
                    <li>Tem no máximo, um empregado.</li>
                </ul>
                <h4>VANTAGENS EM SER MEI</h4>
                <ul>
                    <li><strong>COBERTURA DO INSS:</strong> Com o CNPJ, o MEI está coberto pela Previdência com auxílio-doença, aposentadoria por idade ou invalidez e auxílio-maternidade.</li>
                    <li><strong>NOTA FISCAL MEI:</strong> Com o CNPJ, o MEI pode emitir Nota Fiscal Eletrônica.</li>
                    <li><strong>IMPOSTO FIXO, MENSAL E BARATO:</strong> O MEI paga 5% do salário mínimo de imposto, valor fixo e mensal.</li>
                    <li><strong>CONTA BANCÁRIA EMPRESARIAL:</strong> Pode ter conta jurídica e solicitar financiamentos.</li>
                    <li><strong>FATURAMENTO MÁXIMO:</strong> Até R$ 6.750/mês (R$ 81 mil por ano).</li>
                    <li><strong>NÃO PRECISA DE CONTADOR:</strong> Controles simplificados.</li>
                    <li><strong>FUNCIONÁRIO DO MEI:</strong> Pode registrar um empregado com tributação reduzida.</li>
                </ul>
                <p>Para se formalizar, compareça ao Espaço Empreendedor:<br>Hipershopping Alto da Serra - Rua Teresa, nº 1515 – Sobreloja - Secretaria de Desenvolvimento Econômico (ao lado do boliche) – Petrópolis/RJ CEP 25635-530 • Telefone: (24) 2242-8750</p>
            `
        }
    };

    function openModal(targetId) {
        const data = modalContentData[targetId];
        if (!data) return;
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.dataset.modalTarget;
            openModal(targetId);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}



    // ===================================================================
    // NAVEGAÇÃO MOBILE (MENU HAMBÚRGUER)
    // ===================================================================
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileNavToggle && mainNav) {
        const body = document.body;
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-active');
            body.classList.toggle('body-no-scroll');
            body.classList.toggle('nav-open');
            const isExpanded = mainNav.classList.contains('nav-active');
            mobileNavToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

});