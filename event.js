const body = document.querySelector("body");

chrome.runtime.onMessage.addListener((req) => {
  if (req === "LOAD") {
    const list = [
      ...document
        .querySelector(".nextInner section")
        .querySelectorAll("ul > li[class]"),
    ];
    if (list.length != 0) range(list);
  }
});

chrome.storage.local.get("block", function (block) {
  if (Object.keys(block).length === 0) {
    chrome.storage.local.set({ block: [] });
  }
});

const observer = new MutationObserver(() => {
  const list = [
    ...document
      .querySelector(".nextInner section")
      .querySelectorAll("ul > li[class]"),
  ];
  if (list.length != 0) range(list);
});

observer.observe(body, { childList: true, subtree: true });
