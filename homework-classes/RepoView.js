'use strict';

{
  const {
    createAndAppend
  } = window.Util;

  const {
    convertTime
  } = window.Util;

  class RepoView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.selectedRepo);
      }
    }

    /**
     * Renders the repository details.
     * @param {Object} repo A repository object.
     */
    render(repo) {
      this.container.innerHTML = '';
      const ul = createAndAppend('ul', this.container);
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
  }

  window.RepoView = RepoView;
}
