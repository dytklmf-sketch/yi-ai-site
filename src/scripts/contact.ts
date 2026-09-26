document.querySelectorAll<HTMLElement>('[data-contact-panel]').forEach((panel) => {
  const radios = [...panel.querySelectorAll<HTMLInputElement>('input[name="topic"]')];
  const email = panel.querySelector<HTMLAnchorElement>('.inquiry-email');
  const setTopic = (persist = false) => {
    const current = radios.find((radio) => radio.checked);
    if (!current) return;
    const label = current.dataset.label || '';
    if (email) {
      const subject = `${panel.dataset.subject} | ${label}`;
      const body = (panel.dataset.body || '').replace('{topic}', label);
      email.href = `mailto:${panel.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    panel.querySelectorAll<HTMLElement>('[data-topic-preparation]').forEach((item) => {
      item.hidden = item.dataset.topicPreparation !== current.value;
    });
    document.querySelectorAll<HTMLAnchorElement>('.language-link, .footer-bottom a[lang]').forEach((link) => {
      const url = new URL(link.href);
      url.searchParams.set('topic', current.value);
      link.href = url.href;
    });
    if (persist) {
      const url = new URL(location.href);
      url.searchParams.set('topic', current.value);
      history.replaceState(history.state, '', url);
    }
  };
  const restoreTopic = () => {
    const topic = new URLSearchParams(location.search).get('topic');
    (radios.find((radio) => radio.value === topic) || radios[0]).checked = true;
    setTopic();
  };
  radios.forEach((radio) => radio.addEventListener('change', () => setTopic(true)));
  window.addEventListener('popstate', restoreTopic);
  window.addEventListener('pageshow', restoreTopic);
  restoreTopic();
  const copy = panel.querySelector<HTMLButtonElement>('[data-copy]');
  copy?.addEventListener('click', async () => {
    const status = panel.querySelector<HTMLElement>('.copy-status');
    if (!status || copy.disabled) return;
    copy.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(copy.dataset.copy || '');
      status.textContent = copy.dataset.success || '';
      panel.dataset.copyState = 'success';
    } catch {
      status.textContent = copy.dataset.failure || '';
      panel.dataset.copyState = 'failure';
      const id = panel.querySelector<HTMLElement>('.contact-id');
      if (id) {
        id.focus();
        const range = document.createRange();
        range.selectNodeContents(id);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    } finally {
      copy.disabled = false;
    }
  });
});
