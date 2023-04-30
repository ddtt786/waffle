console.log("waffle!");

let loaded = false;

if (!localStorage.getItem("block")) {
  localStorage.setItem("block", "[]");
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
      console.log(file);
      res({
        id: d.filename,
        ext: d.imageType,
      });
    });
  });
}

function render() {
  //렌더링
  const SELECT_QUERY =
    ".nextInner section > div > div > div > div > div > ul[class] > li[class]:not([data-content])";
  [...document.querySelectorAll(SELECT_QUERY)].forEach((d) => {
    if (
      [...d.querySelectorAll(".waffle")].length === 0 &&
      !d.querySelector("div > textarea")
    ) {
      try {
        const contents = d.querySelectorAll("div > div")[1].innerText;
        if (!d.querySelectorAll("div > div")[1].querySelector(".waffle_link")) {
          d.querySelectorAll("div > div")[1].innerHTML = linkify(
            clean(contents)
          );
        }

        const blocked = JSON.parse(localStorage.getItem("block"));
        imgs(contents)
          ?.reverse()
          .slice(0, 1)
          .forEach((url) => {
            const banned = blocked.includes(
              d.querySelector("li > div > a").href
            );
            const dom = document.createElement("img");
            dom.src = banned ? "#" : url;
            dom.alt = banned
              ? "이 사용자는 차단되었습니다. 차단을 해제하려면 클릭하세요."
              : "image";
            dom.className = "waffle";
            dom.addEventListener("click", () => {
              if (banned) {
                if (confirm("차단을 풀까요?")) {
                  localStorage.setItem(
                    "block",
                    JSON.stringify(
                      blocked.filter(
                        (u) => u !== d.querySelector("li > div > a").href
                      )
                    )
                  );
                  alert("앞으로 이 사용자가 올린 글의 이미지를 로드합니다.");
                  location.reload();
                }
              } else {
                if (
                  confirm("이 사용자가 올린 글의 이미지를 로드하지 않을까요?")
                ) {
                  blocked.push(d.querySelector("li > div > a").href);
                  localStorage.setItem("block", JSON.stringify(blocked));
                  alert(
                    "앞으로 이 사용자가 올린 글의 이미지를 로드하지 않습니다."
                  );
                  location.reload();
                }
              }
            });
            d.querySelectorAll("div > div")[1].prepend(dom);
          });
      } catch (error) {
        console.log(error);
      }
    }
  });
}

function click() {
  upload().then((d) => {
    navigator.clipboard.writeText(`{{*${d.id}}${d.ext}}`);
  });
}

setInterval(() => {
  if (
    location.pathname === "/community/entrystory/list" &&
    document.querySelector(".nextInner li")
  ) {
    if (!loaded) {
      document.querySelector("div > h2").removeEventListener("click", click);
      document.querySelector("div > h2").addEventListener("click", click);
    }
    render();
  }
}, 1000);
