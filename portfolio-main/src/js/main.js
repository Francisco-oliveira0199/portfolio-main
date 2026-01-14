// src/js/main.js
// Sistema Portfólio Gamer - Francisco Oliveira
// Versão 2.0.2

// Configurações iniciais
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema inicializando...');
    
    // Inicializar funcionalidades
    initLoadingScreen();
    initKonamiCode();
    initSoundEffects();
    initTypingEffect();
    initScrollAnimations();
    initFormHandler();
    
    // Atualizar contadores
    setTimeout(updateMissionCount, 2000);
    setTimeout(updatePlayerStats, 2000);
});

// ==================== 1. TELA DE CARREGAMENTO ====================
function initLoadingScreen() {
    const telaCarregamento = document.getElementById('telaCarregamento');
    const loadingProgress = document.getElementById('loadingProgress');
    const assetCount = document.getElementById('assetCount');
    const memoryLoad = document.getElementById('memoryLoad');
    
    if (!telaCarregamento || !loadingProgress) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loadingProgress.style.width = progress + '%';
        if (assetCount) assetCount.textContent = Math.floor(progress) + '%';
        
        if (progress >= 50 && memoryLoad) memoryLoad.textContent = 'OPTIMAL';
        if (progress >= 75 && memoryLoad) memoryLoad.textContent = 'READY';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                telaCarregamento.style.opacity = '0';
                setTimeout(() => {
                    telaCarregamento.style.display = 'none';
                    console.log('Sistema carregado completamente');
                }, 500);
            }, 500);
        }
    }, 100);
}

// ==================== 2. EASTER EGG: KONAMI CODE ====================
function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateSecretMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateSecretMode() {
    document.body.classList.toggle('secret-mode');
    showNotification('Easter Egg Ativado! Modo Secreto ON!', 'success');
    
    // Efeitos visuais
    const secretElements = document.querySelectorAll('.skill-node, .projeto');
    secretElements.forEach(el => {
        el.style.animation = 'secretPulse 1s infinite';
    });
    
    // Remover efeito após 10 segundos
    setTimeout(() => {
        document.body.classList.remove('secret-mode');
        secretElements.forEach(el => {
            el.style.animation = '';
        });
    }, 10000);
}

// ==================== 3. EFEITOS DE SOM ====================
function initSoundEffects() {
    const clickSound = document.getElementById('clickSound');
    if (!clickSound) return;
    
    const clickableElements = document.querySelectorAll('a, button, .projeto, .skill-node, .nav-link');
    
    clickableElements.forEach(element => {
        element.addEventListener('click', function() {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log("Som não pode ser reproduzido:", e));
            }
        });
    });
}

// ==================== 4. EFEITO DE DIGITAÇÃO ====================
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const text = typingText.textContent;
    typingText.textContent = '';
    let i = 0;
    
    const typeWriter = () => {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        } else {
            // Adicionar cursor piscando
            typingText.classList.add('cursor-blink');
        }
    };
    
    // Iniciar após a tela de carregamento
    setTimeout(typeWriter, 1500);
}

// ==================== 5. FORMULÁRIO COM EMAILJS ====================
function initFormHandler() {
    const enviarBtn = document.getElementById('enviarBtn');
    if (!enviarBtn) return;
    
    // Inicializar EmailJS com sua chave pública
    emailjs.init('PioTALZz5QTSR3wF5');
    console.log('EmailJS inicializado com Public Key: PioTALZz5QTSR3wF5');
    
    enviarBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const discord = document.getElementById('discord') ? document.getElementById('discord').value.trim() : '';
        const mensagem = document.getElementById('mensagem').value.trim();
        
        // Validação básica
        if (!nome || !email || !mensagem) {
            showNotification('Preencha todos os campos obrigatórios! (Nome, Email e Mensagem)', 'error');
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor, insira um email válido!', 'error');
            return;
        }
        
        // Validar tamanho da mensagem
        if (mensagem.length < 10) {
            showNotification('A mensagem precisa ter pelo menos 10 caracteres', 'error');
            return;
        }
        
        // Mudar estado do botão
        enviarBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
        enviarBtn.disabled = true;
        
        // Preparar dados para envio
        const templateParams = {
            to_name: 'Francisco',
            from_name: nome,
            from_email: email,
            discord: discord || 'Não informado',
            message: mensagem,
            reply_to: email,
            subject: `Nova mensagem do portfólio - ${nome}`,
            date: new Date().toLocaleDateString('pt-BR'),
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            page_url: window.location.href,
            user_agent: navigator.userAgent
        };
        
        try {
            // Enviar usando EmailJS
            // SUBSTITUA 'SEU_TEMPLATE_ID' pelo seu Template ID real
            const response = await emailjs.send(
                'service_24mlgi8', 
                'template_o2rx6kp', // ← COLOCAR SEU TEMPLATE ID AQUI
                templateParams
            );
            
            console.log('Email enviado com sucesso:', response.status, response.text);
            showNotification('Mensagem enviada com sucesso! Em breve entrarei em contato.', 'success');
            
            // Limpar formulário
            document.getElementById('nome').value = '';
            document.getElementById('email').value = '';
            if (document.getElementById('discord')) {
                document.getElementById('discord').value = '';
            }
            document.getElementById('mensagem').value = '';
            
            // Feedback visual de sucesso
            enviarBtn.style.backgroundColor = 'var(--cor-sucesso)';
            enviarBtn.style.color = 'var(--cor-preta)';
            setTimeout(() => {
                enviarBtn.style.backgroundColor = '';
                enviarBtn.style.color = '';
            }, 2000);
            
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            showNotification('Erro ao enviar mensagem. Tente novamente ou entre em contato por email/discord.', 'error');
            
            // Feedback visual de erro
            enviarBtn.style.backgroundColor = 'var(--cor-perigo)';
            setTimeout(() => {
                enviarBtn.style.backgroundColor = '';
            }, 2000);
            
        } finally {
            // Restaurar botão
            enviarBtn.innerHTML = '$ ./enviar.sh';
            enviarBtn.disabled = false;
        }
    });
}

// ==================== 6. ANIMAÇÕES DE SCROLL ====================
function initScrollAnimations() {
    // Revelar elementos ao rolar
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Animar barras de progresso
                if (entry.target.classList.contains('skill-node')) {
                    const xpFill = entry.target.querySelector('.xp-fill');
                    if (xpFill) {
                        const width = xpFill.style.width;
                        xpFill.style.width = '0%';
                        setTimeout(() => {
                            xpFill.style.width = width;
                        }, 300);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos
    const elementsToObserve = document.querySelectorAll('.skill-node, .projeto, .section-title');
    elementsToObserve.forEach(el => observer.observe(el));
    
    // Navegação suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== 7. NOTIFICAÇÕES ====================
function showNotification(message, type = 'info') {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos da notificação
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        background: type === 'error' ? 'var(--cor-perigo)' : 
                    type === 'success' ? 'var(--cor-sucesso)' : 'var(--cor-primaria)',
        color: 'white',
        borderRadius: '8px',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '14px',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        maxWidth: '400px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    });
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// ==================== 8. ANIMAÇÕES CSS DINÂMICAS ====================
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Animação do Easter Egg */
        @keyframes secretPulse {
            0%, 100% { box-shadow: 0 0 5px var(--cor-primaria); }
            50% { box-shadow: 0 0 20px var(--cor-primaria), 0 0 30px var(--cor-primaria); }
        }
        
        /* Animações para notificações */
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        /* Cursor piscante */
        .cursor-blink::after {
            content: '_';
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        /* Revelar elementos */
        .revealed {
            animation: fadeUp 0.8s ease forwards;
        }
        
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Transição suave para barras de XP */
        .xp-fill {
            transition: width 1.5s ease-in-out;
        }
        
        /* Estilo para notificações */
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-content i {
            font-size: 16px;
        }
        
        /* Estilo para ícone do Discord */
        .fa-discord {
            color: #7289da;
            transition: all 0.3s ease;
        }
        
        .redes-sociais a:hover .fa-discord {
            color: var(--cor-primaria);
            transform: scale(1.1);
        }
        
        /* Botão desabilitado */
        .enviar-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        /* Loading bar shine effect */
        @keyframes loadingShine {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .loading-progress::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            animation: loadingShine 2s infinite;
        }
    `;
    document.head.appendChild(style);
}

// Inicializar estilos dinâmicos
addDynamicStyles();

// ==================== 9. ATUALIZAR CONTADORES ====================
function updateMissionCount() {
    const missionCountElement = document.querySelector('.mission-count');
    if (!missionCountElement) return;
    
    const activeMissions = document.querySelectorAll('.missao-status.concluida').length;
    missionCountElement.textContent = activeMissions;
    
    // Atualizar nível baseado nas missões concluídas
    const levelElement = document.querySelector('.level');
    if (levelElement) {
        const baseLevel = 10;
        const calculatedLevel = baseLevel + Math.floor(activeMissions / 2);
        levelElement.textContent = calculatedLevel;
    }
}

function updatePlayerStats() {
    const stats = {
        coding: Math.floor(Math.random() * 20) + 80,
        design: Math.floor(Math.random() * 25) + 70,
        debugging: Math.floor(Math.random() * 15) + 85,
        cafe: 100
    };
    
    // Atualizar barras de status (se existirem)
    document.querySelectorAll('.stat-fill').forEach((bar, index) => {
        const keys = Object.keys(stats);
        if (bar && keys[index]) {
            bar.style.width = stats[keys[index]] + '%';
        }
    });
}

// ==================== 10. FUNÇÃO DE TESTE EMAILJS ====================
function testEmailJSConnection() {
    console.log('Testando conexão EmailJS...');
    console.log('Service ID: service_24mlgi8');
    console.log('Public Key: PioTALZz5QTSR3wF5');
    console.log('Email de destino: daschaggasf@gmail.com');
    
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS não foi carregado!');
    } else {
        console.log('EmailJS carregado com sucesso');
    }
}

// Testar conexão após carregamento
setTimeout(testEmailJSConnection, 3000);