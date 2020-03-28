'use strict';

//getting data from api and handle the errors if any
async function fetchJSON(url, cb) {
  try {
    const res = await axios.get(url);
    const data = res.data;
    console.log(data);
    cb(null, data);
  } catch (error) {
    console.log(error);
    cb(error, null);
  }
}

//function to create elements and append them to desired sections
function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.entries(options).forEach(([key, value]) => {
    if (key === 'text') {
      elem.textContent = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}

const sectionRepo = document.querySelector('.repo-container'); //access to the repo section
const ulRepo = createAndAppend('ul', sectionRepo);

//rendering the repo data to show repo section
function renderRepoDetails(repo, ul) {
  ul.innerHTML = '';
  //creating li item for repository name
  const repoLi = createAndAppend('li', ul, {
    text: 'Repository: ',
    class: 'bold',
  });
  //creating a link for repository name
  createAndAppend('a', repoLi, {
    text: repo.name,
    href: repo.html_url,
    target: '_blank',
  });
  //creating li for description of the repository
  createAndAppend('li', ul, {
    text: `Description: ${repo.description}`,
  });
  //creating li for forks of the repository
  createAndAppend('li', ul, {
    text: `Forks: ${repo.forks}`,
  });
  //creating li for last update time of the repository
  createAndAppend('li', ul, {
    text: 'Updated: ' + convertTime(repo.updated_at),
  });
}

const sectionContributors = document.querySelector('.contributors-container'); //access to the contributors section
const ulCont = createAndAppend('ul', sectionContributors, {
  class: 'ulCont',
});

//rendering the contributors data
function renderRepoContributors(repo) {
  const contUrl = repo.contributors_url;
  fetchJSON(contUrl, (err, contributors) => {
    if (err) {
      //appending the error to the page, if there is any
      createAndAppend('div', root, {
        text: err.message,
        class: 'alert-error',
      });
      return;
    }
    createContributorSection(contributors); //if there is no error fire this function
  });
}

//create the contributors section
function createContributorSection(contributors) {
  // const contributors = res.data;
  ulCont.innerHTML = '';
  createAndAppend('li', ulCont, {
    text: 'Contributions',
    class: 'headercontributors',
  });
  contributors.forEach(contributor => {
    const li = createAndAppend('li', ulCont, {
      class: 'liCont',
    });
    createAndAppend('img', li, {
      src: contributor.avatar_url,
    });
    createAndAppend('a', li, {
      text: contributor.login,
      href: contributor.html_url,
      target: '_blank',
    });
    createAndAppend('div', li, {
      text: contributor.contributions,
    });
  });
}

// to make time more 'readible'
function convertTime(time) {
  const dateTime = new Date(time);
  return dateTime.toLocaleString();
}

const select = document.getElementById('select'); //get access to select element
// adding repo names to the select element as options
// and rendering the repo and contributors sections
function createSelection(repos) {
  repos.sort((repoA, repoB) => {
    return repoA.name.localeCompare(repoB.name);
  }); //sorting repos by name
  repos.forEach(repo => {
    const option = createAndAppend('option', select);
    option.innerText = repo.name;
    option.value = repos.indexOf(repo);
    select.appendChild(option);
  });
  select.addEventListener('change', () => {
    //rendering the containers' data when the selected option(repo) has been changed
    renderRepoDetails(repos[select.value], ulRepo);
    renderRepoContributors(repos[select.value], ulCont);
  });
  renderRepoDetails(repos[0], ulRepo); //rendering the first repo as default
  renderRepoContributors(repos[0], ulCont); //rendering first repo's contributors as default
}

const mainContainer = document.querySelector('.main-container'); //get access to the main container
//main function with provided callback function
function main(url) {
  fetchJSON(url, (err, repos) => {
    if (err) {
      //appending the error to the page, if there is any
      createAndAppend('div', root, {
        text: err.message,
        class: 'alert-error',
      });
      return;
    }
    createSelection(repos); //if there is no error fire this function
  });
}
const HYF_REPOS_URL =
  'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL); //attaching the main function to onload event listener
