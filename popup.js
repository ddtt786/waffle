document.getElementById("submit").addEventListener("click", () => {
  try {
    const url = `{{${btoa(document.getElementById("url").value)}}}`;
    new URL(document.getElementById("url").value);
    navigator.clipboard.writeText(url).then(() => {
      warn("복사됨!");
    });
  } catch (error) {
    switch (error.name) {
      case "InvalidCharacterError":
        warn("영어 이외의 문자가 포함돼 있습니다.");
        break;

      case "TypeError":
        warn("url이 아닙니다.");
      default:
        break;
    }
  }
});

function warn(contents) {
  const dom = document.getElementById("warn");
  dom.innerText = contents;
  dom.style.display = "flex";
  setTimeout(() => {
    dom.style.display = "none";
  }, 3000);
}
