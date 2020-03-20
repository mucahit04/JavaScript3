"use strict";
const select = document.getElementById("select");

function fetchJSON(url, cb) {
  fetch(url)
    .then(res => res.json())
    .then(data => cb(null, data))
    .catch(err =>
      cb(new Error(`Network error: ${err.status} - ${err.statusText}`))
    );
}

function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.entries(options).forEach(([key, value]) => {
    if (key === "text") {
      elem.textContent = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}
const sectionRepo = document.querySelector(".repo-container");
const ul = createAndAppend("ul", sectionRepo);

function renderRepoDetails(repo) {
  ul.innerHTML = "";
  //creating li item for repository name
  const repoLi = createAndAppend("li", ul, {
    text: "Repository: ",
    class: "bold"
  });
  //creating a link for repository name
  createAndAppend("a", repoLi, {
    text: repo.name,
    href: repo.html_url,
    target: "_blank"
  });
  //creating li for description of the repository
  createAndAppend("li", ul, {
    text: `Description: ${repo.description}`
  });
  //creating li for forks of the repository
  createAndAppend("li", ul, {
    text: `Forks: ${repo.forks}`
  });
  //creating li for last update time of the repository
  createAndAppend("li", ul, {
    text: "Updated: " + convertTime(repo.updated_at)
  });
}

const sectionContributers = document.querySelector(".contributors-container");
const ulCont = createAndAppend("ul", sectionContributers, {
  class: "ulCont"
});


function renderRepoContributers(repo) {
  ulCont.innerHTML = "";
  const headerContributers = createAndAppend('li', ulCont, {
    text: "Contributions",
    class: "headerContributers"
  });
  const contUrl = repo.contributors_url;
  fetch(contUrl)
    .then(res => res.json())
    .then(data => {
      data.forEach(contributer => {
        const li = createAndAppend("li", ulCont, {
          class: "liCont"
        });
        const img = createAndAppend("img", li, {
          src: contributer.avatar_url
        });
        const login = createAndAppend("a", li, {
          text: contributer.login,
          href: contributer.html_url,
          target: "_blank"
        });
        const div = createAndAppend("div", li, {
          text: contributer.contributions
        });
      });
    })
    .catch(err => console.log(err));
}
// to make time more 'readible'
function convertTime(time) {
  const dateTime = new Date(time);
  return dateTime.toLocaleString();
}

function createSelection(repos) {
  repos.sort((repoA, repoB) => {
    return repoA.name.localeCompare(repoB.name);
  }); //sorting repos by name
  repos.forEach(repo => {
    const option = createAndAppend("option", select);
    option.innerText = repo.name;
    option.value = repos.indexOf(repo);
    select.appendChild(option);
  });
  select.addEventListener("change", () => {
    renderRepoDetails(repos[select.value]);
    renderRepoContributers(repos[select.value]);
  });
  renderRepoDetails(repos[0]);
  renderRepoContributers(repos[0]);
}

function main(url) {
  fetchJSON(url, (err, repos) => {
    if (err) {
      createAndAppend("div", root, {
        text: err.message,
        class: "alert-error"
      });
      return;
    }
    createSelection(repos);
  });
}
const HYF_REPOS_URL =
  "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";
window.onload = () => main(HYF_REPOS_URL);