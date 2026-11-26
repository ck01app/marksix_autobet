chrome.action.onClicked.addListener(async (tab) => {
  console.log('Action clicked:', tab.id, tab.url);
  if (!tab.id || !tab.url) return;

  const isMarkSixPage =
    tab.url.includes('bet.hkjc.com/ch/marksix') ||
    tab.url.includes('bet.hkjc.com/en/marksix');

  if (!isMarkSixPage) {
    console.log('Not a Mark Six page, skipped.');
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (typeof window.__toggleMarkSixHelper === 'function') {
          window.__toggleMarkSixHelper();
        } else {
          console.warn('__toggleMarkSixHelper not found');
        }
      }
    });
  } catch (err) {
    console.error('Failed to inject or toggle helper:', err);
  }
});