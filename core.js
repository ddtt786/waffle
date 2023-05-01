/**
 * @param {HTMLElement[]} d
 */
function range(d) {
  chrome.storage.local.get("block", function ({ block }) {
    d.forEach((dom) => {
      const contents = dom.querySelectorAll("div > div")[1];
      [...contents.querySelectorAll("a")].forEach((link) => {
        const url = link.href;
        if (url.startsWith("https://playentry.org/uploads")) {
          const user = link.parentElement.parentElement
            .querySelector("li > div > a")
            .href.match(/[a-f\d]{24}/)[0];
          const blocked = block.includes(user);

          const image = document.createElement("img");
          if (!blocked) {
            image.src = url;
          }
          image.alt = "이 사용자는 차단되었습니다. 차단 해제하려면 클릭하세요.";
          image.className = "waffle";
          image.addEventListener("click", () => {
            if (blocked) {
              if (confirm("이 사용자를 차단 해제할까요?")) {
                block.filter((u) => u !== user);
                chrome.storage.local.set({ block });
                image.src = url;
              }
            } else {
              if (confirm("이 사용자를 차단할까요?")) {
                block.push(user);
                chrome.storage.local.set({ block });
                image.removeAttribute("src");
              }
            }
          });

          link.innerText = null;
          link.removeAttribute("href");
          link.append(image);
          link.style.display = "flex";
        }
      });
    });
  });
}
