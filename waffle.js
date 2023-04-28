console.log("eewqwqw");
function urlchecker(inputString) {
  const pattern = /{{(.*?)}}/g;
  const matches = inputString.match(pattern);

  if (matches) {
    const extractedText = matches
      .map((match) => match.replace("{{", "").replace("}}", ""))
      .filter((text) => {
        try {
          new URL(atob(text));
          return true;
        } catch (error) {
          return false;
        }
      })
      .map((d) => {
        return atob(d);
      });
    return extractedText;
  } else {
    return null;
  }
}

function render() {
  //렌더링
  const SELECT_QUERY =
    ".nextInner section > div > div > div > div > div > ul[class] > li[class]:not([data-content])";
  [...document.querySelectorAll(SELECT_QUERY)].forEach((d) => {
    if (
      [...d.querySelectorAll("img")].length === 0 &&
      !d.querySelector("div > textarea")
    ) {
      function clean(d) {
        const pattern = /{{(.*?)}}/g;
        const cleanedText = d.replace(pattern, "");
        return cleanedText;
      }
      try {
        const contents = d.querySelectorAll("div > div")[1].innerText;
        d.querySelectorAll("div > div")[1].innerText = clean(contents);
        urlchecker(contents)?.forEach((url) => {
          const dom = document.createElement("img");
          dom.src = url;
          dom.className = "waffle";
          d.querySelectorAll("div > div")[1].prepend(dom);
        });
      } catch (error) {
        console.log(error);
      }
    }
  });
}

setInterval(() => {
  if (
    location.pathname === "/community/entrystory/list" &&
    document.querySelector(".nextInner li")
  ) {
    render();
  }
}, 10);
