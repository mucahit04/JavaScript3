"use strict";

//fetching data from api and handle the errors if any
function fetchJSON(url, cb) {
  fetch(url)
    .then(res => {
      //if the request is not successful then throw an error
      console.log(res);
      if (!res.ok) {
        throw Error(`Network error: ${res.status} - ${res.statusText}`);
      }
      return res.json(); //parse the response data into json
    })
    .then(data => cb(null, data)) //in case of successful request, fire callback function with the data
    .catch(err => {
      //append the error to the page via using callback function provided in main function
      console.log(err);
      cb(err, null);
    });
}

//function to create elements and append them to desired sections
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

const sectionRepo = document.querySelector(".repo-container"); //access to the repo section
const ulRepo = createAndAppend("ul", sectionRepo);

//rendering the repo data to show repo section
function renderRepoDetails(repo, ul) {

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

const sectionContributers = document.querySelector(".contributors-container"); //access to the contributors section
const ulCont = createAndAppend("ul", sectionContributers, {
  class: "ulCont"
});
//rendering the data to show the contributors section
function renderRepoContributors(repo, ul) {

  ulCont.innerHTML = "";
  createAndAppend("li", ul, {
    text: "Contributions",
    class: "headerContributers"
  });
  const contUrl = repo.contributors_url;
  fetch(contUrl)
    .then(res => res.json())
    .then(data => {
      data.forEach(contributer => {
        const li = createAndAppend("li", ul, {
          class: "liCont"
        });
        createAndAppend("img", li, {
          src: contributer.avatar_url
        });
        createAndAppend("a", li, {
          text: contributer.login,
          href: contributer.html_url,
          target: "_blank"
        });
        createAndAppend("div", li, {
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

// adding repo names to the select element as options
// and rendering the repo and contributors sections
const select = document.getElementById("select"); //get access to select element

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
    //rendering the containers' data when the selected option(repo) has been changed
    renderRepoDetails(repos[select.value], ulRepo);
    renderRepoContributors(repos[select.value], ulCont);
  });
  renderRepoDetails(repos[0], ulRepo); //rendering the first repo as default
  renderRepoContributors(repos[0], ulCont); //rendering first repo's contributors as default
}

const mainContainer = document.querySelector(".main-container"); //get access to the main container
//main function with provided callback function
function main(url) {
  fetchJSON(url, (err, repos) => {
    if (err) {
      //appending the error to the page, if there is any
      createAndAppend("div", root, {
        text: err.message,
        class: "alert-error"
      });
      return;
    }
    createSelection(repos); //if there is no error fire this function
  });
}
const HYF_REPOS_URL =
  "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";
window.onload = () => main(HYF_REPOS_URL); //attaching the main function to onload event listener