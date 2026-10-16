document.querySelectorAll('.mermaid-source .copy').forEach(button => {
  button.addEventListener('click', async () => {
    const code = button.closest('.codebar').nextElementSibling.querySelector('code');
    const feedback = document.querySelector('.copy-feedback');
    try {
      await navigator.clipboard.writeText(code.textContent);
      feedback.textContent = 'Source Mermaid tersalin.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      feedback.textContent = 'Source dipilih. Tekan Ctrl / ⌘ C untuk menyalin.';
    }
  });
});
