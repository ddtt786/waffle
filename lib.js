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

function clean(str) {
  return str.replace(/{{\*\w{32}\}\w{3,4}}/g, "");
}

function imgs(str) {
  const regex = /{{\*(\w{32})}(\w{3,4})}/g;
  const matches = str.matchAll(regex);
  const output = [];

  for (const match of matches) {
    const id = match[1];
    const ext = match[2];
    output.push(
      `https://playentry.org/uploads/${id.slice(0, 2)}/${id.slice(
        2,
        4
      )}/${id}.${ext}`
    );
  }

  return output;
}
