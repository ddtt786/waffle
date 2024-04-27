/**
 * @param {HTMLElement} contents
 */
async function range(contents) {
  const block = (await chrome.storage.local.get()).block;
  const list = [...contents.querySelectorAll("ul > li[class]")];

  //이미지 업로드 버튼
  [...document.querySelectorAll("#Write")].forEach((writer, i) => {
    const writebox = writer.parentElement.parentElement.parentElement;
    if (!writebox.querySelector(".genimg")) {
      console.log(writebox);
      const genimg = document.createElement("a");
      genimg.className = "genimg";
      genimg.role = "button";
      genimg.addEventListener("click", () => {
        upload().then((d) => {
          navigator.clipboard.writeText(
            `playentry.org//uploads/${d.id.slice(0, 2)}/${d.id.slice(2, 4)}/${
              d.id
            }.${d.ext}`
          );
        });
      });
      console.log(writebox.querySelectorAll("div>div>a"));
      writebox.querySelectorAll("div>div>a")[i == 0 ? 1 : 0].after(genimg);
    }
  });

  list.forEach((post) => {
    const link = post.querySelectorAll("div > a")[2];
    const url = link.href;
    const user = post
      .querySelector("li > div > a")
      .href.match(/[a-f\d]{24}/)[0];
    const blocked = block.includes(user);

    if ([...post.querySelectorAll("ul > li > .block")].length != 0) return;

    //차단 버튼
    const menu = document.createElement("li");
    post.querySelector("ul").append(menu);
    const blockButton = document.createElement("a");
    blockButton.className = "block";
    blockButton.innerText = blocked ? "차단해제" : "차단하기";
    blockButton.addEventListener("click", () => {
      if (blocked) {
        chrome.storage.local.set({ block: block.filter((u) => u !== user) });
        clear(contents);
        range(contents);
      } else {
        block.push(user);
        chrome.storage.local.set({ block });
        clear(contents);
        range(contents);
      }
    });
    menu.append(blockButton);

    if (
      !url.startsWith("http://playentry.org//uploads/") ||
      link.parentElement.querySelector("img")
    )
      return;
    link.innerText = "";

    const box = document.createElement("div");
    box.className = "imgbox";
    link.append(box);
    const image = document.createElement("img");
    image.src = link.href.replace("http://", "https://");

    if (!blocked) {
      box.append(image);
    } else {
      box.innerText = "차단된 유저입니다.";
    }
  });
}

/**
 * @param {HTMLElement} contents
 */
function clear(contents) {
  const list = [...contents.querySelectorAll("ul > li[class]")];
  list.forEach((post) => {
    const block = post.querySelector(".block");
    const box = post.querySelector(".imgbox");
    if (block) block.remove();
    if (box) box.remove();
  });
}
