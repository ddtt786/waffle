chrome.tabs.onUpdated.addListener((id, status, info) => {
  if (status.status === "complete") {
    if (info.url?.startsWith("https://playentry.org/community/entrystory"))
      chrome.tabs.sendMessage(id, "LOAD");
  }
});
