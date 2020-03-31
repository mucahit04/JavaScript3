'use strict';

const sectionRepo = document.querySelector('.repo-container');
const ulRepo = createAndAppend('ul', sectionRepo);
const sectionContributors = document.querySelector('.contributors-container');
const ulCont = createAndAppend('ul', sectionContributors, {
  class: 'ulCont',
});
const select = document.getElementById('select');


async function fetchJSON(url) {
  try {
    const res = await axios.get(url);
    if (!res.ok || res.status > 299) {
      throw new Error;
    }
    const data = res.data;
    return data;
  } catch (error) {
    throw error;
  }
}

async function main(url) {
  try {
    const res = await fetchJSON(url);
    createSelection(res);

  } catch (error) {
    errorHandler(error);
  }
}

function errorHandler(err) {
  createAndAppend("div", root, {
    text: err.message || "Failed to fetch!",
    class: "alert-error"
  });
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

//rendering the contributors data
async function renderRepoContributors(repo) {
  try {
    const contUrl = repo.contributors_url;
    const contributors = await fetchJSON(contUrl);
    createContributorSection(contributors);
  } catch (error) {
    errorHandler(error);
  }
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
  renderRepoDetails(repos[select.value], ulRepo);
  renderRepoContributors(repos[select.value], ulCont);
}

// const mainContainer = document.querySelector('.main-container'); //get access to the main container

const HYF_REPOS_URL =
  'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL); //attaching the main function to onload event listener
