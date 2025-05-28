import "./style.css";

document.getElementById("rss-from").addEventListener("submit", (event) => {
  event.preventDefault();
  const rssUrl = document.getElementById("rss-url").ariaValueMax;
  new Promise((resolve, reject) => {
    if (rssUrl) {
      resolve(`RSS URL received: ${rssUrl}`);
    } else {
      reject(new Error("URL is empty"));
    }
  })
    .then((message) => {
      console.log(message);
      
      
    })
    .catch((error) => {
      console.error(error.message);
    });
});
