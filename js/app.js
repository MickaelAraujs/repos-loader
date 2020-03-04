const inputElement = document.querySelector('#text');
const buttonElement = document.querySelector('.button');
const divElement = document.querySelector('.list');

const baseURL = `https://api.github.com/users/`;
const reposPath = `/repos`;

let username = '';

const pageInfo = {
    page: 1,
    total: 1
};

buttonElement.onclick = handleSubmit;

function handleSubmit(event) {
    event.preventDefault();
    main();
}

function main() {
    divElement.innerHTML = '';
    
    username = inputElement.value;
    inputElement.value = '';
    
    setTotalPages(username);
    setLoading();
    getRepoList(username, pageInfo.total);
}

function getRepoList(username,page) {
    axios.get(`${baseURL}${username}${reposPath}?page=${page}`)
         .then(response => loadRepos(response.data))
         .catch(() => handleError());
}

function loadRepos(repos) {
    unsetLoading();
    
    divElement.innerHTML = '';
    
    loadPageButtons();
    
    const ulElement = document.createElement('ul');
    
    repos.forEach(repo => {
        const liElement = document.createElement('li');
        const liText = document.createTextNode(repo.name);
        
        liElement.appendChild(liText);
        ulElement.appendChild(liElement);
    })
    
    divElement.appendChild(ulElement);
}

function setLoading() {
    const loadingElement = document.createElement('p');
    const loadingText = document.createTextNode('carregando lista de repositórios ...');

    loadingElement.appendChild(loadingText);
    document.querySelector('.loader').appendChild(loadingElement);
}

function unsetLoading() {
    document.querySelector('.loader').innerHTML = '';
}

function handleError() {
    unsetLoading();
    
    const errorDiv = document.createElement('div');
    errorDiv.setAttribute('class','error-div');

    const errorTitle = document.createElement('h1');
    const errorText = document.createTextNode('Error 404: usuário inexistente :(');
    errorTitle.appendChild(errorText);

    const pElement = document.createElement('p');
    const pText = document.createTextNode('verifique se o nome do usuário foi digitado corretamente e tente novamente');
    pElement.appendChild(pText);

    errorDiv.appendChild(errorTitle);
    errorDiv.appendChild(pElement);

    divElement.appendChild(errorDiv);
}

function setTotalPages(username) {
    axios.get(`${baseURL}${username}`)
         .then(response => {
             const { public_repos } = response.data;
             pageInfo.total = totalPages(public_repos);
         })
}

function totalPages(numberOfRepos) {
    return Math.ceil(numberOfRepos / 30);
}

function prevPage() {
    if (pageInfo.page === 1) {
        addClassToElement(document.querySelector('.button-container #prev'));
        return;
    }

    pageInfo.page = pageInfo.page - 1;
    getRepoList(username,pageInfo.page);
}

function nextPage() {
    if (pageInfo.page === pageInfo.total) {
        addClassToElement(document.querySelector('.button-container #next'));
        return;
    }

    pageInfo.page = pageInfo.page + 1;
    getRepoList(username,pageInfo.page);
}

function loadPageButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('class','button-container');
    divElement.appendChild(buttonContainer);

    const buttonPrev = document.createElement('button');
    const prevText = document.createTextNode('Anterior');
    buttonPrev.appendChild(prevText);
    buttonPrev.setAttribute('onclick','prevPage()');
    buttonPrev.setAttribute('class','page-button');
    buttonPrev.setAttribute('id','prev');
    
    const buttonNext = document.createElement('button');
    const nextText = document.createTextNode('Próxima');
    buttonNext.appendChild(nextText);
    buttonNext.setAttribute('onclick','nextPage()');
    buttonNext.setAttribute('class','page-button');
    buttonNext.setAttribute('id','next');

    if (pageInfo.total === 1) {
        addClassToElement(buttonPrev);
        addClassToElement(buttonNext);
    } else if (pageInfo.page === 1) {
        addClassToElement(buttonPrev);
    } else if (pageInfo.page === pageInfo.total) {
        addClassToElement(buttonNext);
    }

    buttonContainer.appendChild(buttonPrev);
    buttonContainer.appendChild(buttonNext);
}

function addClassToElement(element) {
    element.classList.add('disabled');
}
