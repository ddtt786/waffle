console.log("waffle!");

function linkify(text) {
  const urlRegex = /((http[s]?|ftp):\/\/[^"\s]+)(?![^<]*>|[^<>]*<\/)/g;

  const linkedText = text.replace(urlRegex, (match) => {
    return `<a href="${match}" rel="nofollow" class="waffle_link">${match}</a>`;
  });

  const div = document.createElement("div");
  div.innerHTML = linkedText;

  const links = div.getElementsByTagName("a");
  for (let i = 0; i < links.length; i++) {
    links[i].setAttribute("target", "_blank");
  }

  return div.innerHTML;
}

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
        if (!d.querySelectorAll("div > div")[1].querySelector(".waffle_link")) {
          d.querySelectorAll("div > div")[1].innerHTML = linkify(
            clean(contents)
          );
        }
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
