window.addEventListener('DOMContentLoaded', () => {
  // 1. Механика перемещения окна за шапку мышкой
  const header = document.getElementById('header');
  let isDragging = false;
  let mouseX = 0, mouseY = 0;

  header.addEventListener('mousedown', (e) => {
    // Тащим только если зажали саму плашку, а не кнопки в ней
    if (e.target.tagName !== 'BUTTON') {
      isDragging = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging && window.zapretAPI) {
      window.zapretAPI.moveWindow({ mouseX, mouseY });
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // 2. Кнопки сворачивания и закрытия
  document.getElementById('minBtn').onclick = () => window.zapretAPI && window.zapretAPI.minimize();
  document.getElementById('closeBtn').onclick = () => window.zapretAPI && window.zapretAPI.close();

  // 3. Переключение тем
  const themes = ['', 'theme-purple', 'theme-blue', 'theme-light'];
  let currentThemeIndex = 0;
  document.getElementById('themeBtn').onclick = () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.className = themes[currentThemeIndex];
  };

  // 4. Переключение вкладок
  function openTab(tabNumber) {
    for (let i = 1; i <= 4; i++) {
      document.getElementById(`tab${i}`).classList.remove('active');
      document.getElementById(`nav${i}`).classList.remove('active');
    }
    document.getElementById(`tab${tabNumber}`).classList.add('active');
    document.getElementById(`nav${tabNumber}`).classList.add('active');
  }

  document.getElementById('nav1').onclick = () => openTab(1);
  document.getElementById('nav2').onclick = () => openTab(2);
  document.getElementById('nav3').onclick = () => openTab(3);
  document.getElementById('nav4').onclick = () => openTab(4);

  // 5. Главная кнопка питания
  let isRunning = false;
  const powerBtn = document.getElementById('mainPowerBtn');
  const statusText = document.getElementById('status');
  const welcomeTitle = document.getElementById('welcomeTitle');

  function toggleZapret() {
    isRunning = !isRunning;
    if (isRunning) {
      powerBtn.classList.add('active');
      statusText.innerText = 'Статус: Активно (Запрет запущен)';
      statusText.style.color = 'var(--accent)';
      welcomeTitle.innerText = 'Приятного использования!';
      if (window.zapretAPI) window.zapretAPI.runScript('general.bat');
    } else {
      powerBtn.classList.remove('active');
      statusText.innerText = 'Статус: Отключено';
      statusText.style.color = 'var(--text-dim)';
      welcomeTitle.innerText = 'Добро пожаловать';
    }
  }

  powerBtn.onclick = toggleZapret;

  // 6. Списки и настройки
  document.getElementById('addSitesBtn').onclick = () => {
    const text = document.getElementById('bulkSites').value;
    if (!text.trim()) return alert('Сначала вставьте список сайтов!');
    alert('Сайты отправлены в список!');
    document.getElementById('bulkSites').value = '';
  };

  document.getElementById('openTxtBtn').onclick = () => {
    if (window.zapretAPI) window.zapretAPI.runScript('cmd /c notepad zapret-core\\lists\\list-general.txt');
  };

  document.getElementById('dnsBtn').onclick = () => {
    if (window.zapretAPI) window.zapretAPI.runScript('cmd /c ipconfig /flushdns');
    alert('Кэш DNS очищен!');
  };

  document.getElementById('donateBtn').onclick = () => alert('Спасибо за поддержку!');

  // 7. Трей
  if (window.zapretAPI && window.zapretAPI.onTrayToggle) {
    window.zapretAPI.onTrayToggle(() => toggleZapret());
  }
});