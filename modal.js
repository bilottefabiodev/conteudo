(function() {
  // Inject CSS link
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/modal.css';
  document.head.appendChild(link);

  // Group link specific to Conteudo Essencial
  const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/DLvGGQLfOlfB8sNSCpd3XN';

  // Build Modal HTML
  const modalHTML = `
    <div class="modal-overlay" id="reg-modal-overlay">
      <div class="modal-backdrop" id="reg-modal-backdrop"></div>
      <div class="modal-content" id="reg-modal-content">
        <button class="modal-close-btn" id="reg-modal-close">&times;</button>
        
        <div id="reg-modal-form-view">
          <div class="modal-header">
            <span class="modal-tag">Vaga Gratuita</span>
            <h2 class="modal-title">Finalize sua Inscrição</h2>
            <p class="modal-subtitle">Preencha para liberar seu acesso ao Grupo.</p>
          </div>
          <form id="reg-modal-form" class="modal-form">
            <div class="form-group">
              <label>Email Profissional</label>
              <input id="reg-email" name="email" type="email" required placeholder="seu@melhoremail.com" autocomplete="email">
            </div>
            <div class="form-group">
              <label>WhatsApp</label>
              <div class="phone-input-group">
                <div class="ddi-select-wrapper">
                  <select id="reg-ddi" name="ddi">
                    <option value="+55">🇧🇷 +55</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+351">🇵🇹 +351</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+34">🇪🇸 +34</option>
                  </select>
                </div>
                <input id="reg-phone" name="phone" type="tel" required maxlength="15" placeholder="(11) 99999-9999" autocomplete="tel">
              </div>
            </div>
            <div class="form-group">
              <label>Seu Momento Atual</label>
              <select id="reg-profile" name="profile" required>
                <option value="" disabled selected>Selecione uma opção...</option>
                <option value="Estou começando do zero e não produzo conteudo">Estou começando do zero e não produzo conteudo</option>
                <option value="Já tenho serviço/mentoria e não produzo conteudo">Já tenho serviço/mentoria e não produzo conteudo</option>
                <option value="Já tenho serviço/mentoria e produzo conteudo com constancia">Já tenho serviço/mentoria e produzo conteudo com constancia</option>
              </select>
            </div>
            <button type="submit" id="reg-submit-btn" class="submit-btn disabled" disabled>
              <span id="reg-submit-text">Entrar no Grupo VIP</span>
            </button>
            <div class="privacy-msg">
              <span>🔒 Seus dados estão protegidos. Zero spam.</span>
            </div>
          </form>
        </div>

        <div id="reg-modal-success-view" class="success-state" style="display:none;">
          <div class="success-icon">✓</div>
          <h3 class="modal-title">Inscrição Confirmada!</h3>
          <p class="modal-subtitle">Estamos te levando para o Grupo VIP no WhatsApp...</p>
          <div class="redirecting-msg">
            <div class="spinner"></div>
            <span>Redirecionando...</span>
          </div>
          <a href="${WHATSAPP_GROUP_LINK}" class="fallback-link" target="_blank" rel="noopener noreferrer">
            Se não abrir automaticamente, clique aqui.
          </a>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Logic
  const overlay = document.getElementById('reg-modal-overlay');
  const closeBtn = document.getElementById('reg-modal-close');
  const backdrop = document.getElementById('reg-modal-backdrop');
  const form = document.getElementById('reg-modal-form');
  const emailInput = document.getElementById('reg-email');
  const phoneInput = document.getElementById('reg-phone');
  const ddiSelect = document.getElementById('reg-ddi');
  const profileSelect = document.getElementById('reg-profile');
  const submitBtn = document.getElementById('reg-submit-btn');
  const submitText = document.getElementById('reg-submit-text');
  const formView = document.getElementById('reg-modal-form-view');
  const successView = document.getElementById('reg-modal-success-view');

  window.openRegistrationModal = function(href) {
    if (href) { /* update link if needed */ }
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    validateForm();
  };

  const closeModal = function() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Phone mask
  phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    let limited = value.slice(0, 11);
    let formatted = limited;
    if (limited.length > 2 && limited.length <= 7) {
      formatted = `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else if (limited.length > 7) {
      formatted = `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }
    e.target.value = formatted;
    validateForm();
  });

  const validateForm = () => {
    const emailValid = emailInput.value.length > 5 && emailInput.value.includes('@');
    const phoneValid = phoneInput.value.replace(/\D/g, '').length >= 10;
    const profileValid = profileSelect.value !== '';
    
    if (emailValid && phoneValid && profileValid) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('disabled');
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add('disabled');
    }
  };

  emailInput.addEventListener('input', validateForm);
  profileSelect.addEventListener('change', validateForm);

  // Submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitText.textContent = 'Processando...';

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return '';
    };

    const urlParams = new URLSearchParams(window.location.search);
    const cleanDDI = ddiSelect.value.replace('+', '');
    const cleanPhone = phoneInput.value.replace(/\D/g, '');
    const fullPhoneNumber = `${cleanDDI}${cleanPhone}`;

    const payload = {
      email: emailInput.value,
      phone: fullPhoneNumber,
      profile: profileSelect.value,
      utm_source: urlParams.get('utm_source') || 'Instagram',
      utm_medium: urlParams.get('utm_medium') || 'direto',
      utm_campaign: urlParams.get('utm_campaign') || 'nenhuma',
      utm_content: urlParams.get('utm_content') || 'nenhum',
      origin: 'Conteúdo Essencial',
      date: new Date().toISOString(),
      client_user_agent: navigator.userAgent,
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc') || urlParams.get('fbclid'),
      event_source_url: window.location.href
    };

    try {
      await fetch('https://foda-n8n-webhook.nxjcjs.easypanel.host/webhook/lead-lht', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error(err);
    }

    formView.style.display = 'none';
    successView.style.display = 'block';

    setTimeout(() => {
      window.location.assign(WHATSAPP_GROUP_LINK);
    }, 2000);
  });

})();
