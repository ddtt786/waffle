/**
 * @param {HTMLElement[]} d
 */
function range(d) {
  chrome.storage.local.get("block", function ({ block }) {
    function blocking(id) {
      block.push(id);
      chrome.storage.local.set({ block });
      location.reload();
    }

    function unblock(id) {
      block = block.filter((u) => u !== id);
      chrome.storage.local.set({ block });
      location.reload();
    }

    d.forEach((dom) => {
      const contents = dom.querySelectorAll("div > div")[1];
      const link = contents.querySelector("a");
      if (!link) return;
      const url = link.href;
      if (url.startsWith("https://playentry.org/uploads")) {
        const user = link.parentElement.parentElement
          .querySelector("li > div > a")
          .href.match(/[a-f\d]{24}/)[0];
        let blocked = block.includes(user);

        const image = document.createElement("img");
        if (!blocked) {
          image.src = url;
        }
        image.alt = "이 사용자는 차단되었습니다. 차단 해제하려면 클릭하세요.";
        image.className = "waffle";
        image.addEventListener("click", () => {
          if (blocked) {
            if (confirm("이 사용자를 차단 해제할까요?")) {
              unblock(user);
            }
          } else {
            if (confirm("이 사용자를 차단할까요?")) {
              blocking(user);
            }
          }
        });

        link.setAttribute("url", url);
        link.innerText = null;
        link.removeAttribute("href");
        link.append(image);
        link.style.display = "flex";
      }
    });
  });
}

async function upload() {
  return new Promise((res, _) => {
    const input = document.createElement("input");
    input.type = "file";
    input.click();
    input.addEventListener("change", async () => {
      const file = input.files[0];
      const form = new FormData();
      form.append("file", file);
      form.append("type", "notcompress");

      const d = await (
        await fetch("https://playentry.org/rest/picture", {
          method: "POST",
          body: form,
        })
      ).json();
      res({
        id: d.filename,
        ext: d.imageType,
      });
    });
  });
}

function click() {
  upload().then((d) => {
    navigator.clipboard.writeText(
      `https://playentry.org/uploads/${d.id.slice(0, 2)}/${d.id.slice(2, 4)}/${
        d.id
      }.${d.ext}`
    );
  });
}

document.querySelector("div > h2").addEventListener("click", click);
