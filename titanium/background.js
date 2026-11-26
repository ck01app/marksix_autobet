chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url) return;

  const isMarkSixPage =
    tab.url.includes('bet.hkjc.com/ch/marksix') ||
    tab.url.includes('bet.hkjc.com/en/marksix');

  if (!isMarkSixPage) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (typeof window.__toggleMarkSixMobileHelper === 'function') {
          window.__toggleMarkSixMobileHelper();
        }
      }
    });
  } catch (err) {
    console.error('Titanium helper toggle failed:', err);
  }
});