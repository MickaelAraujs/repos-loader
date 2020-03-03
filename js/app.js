const inputElement = document.querySelector('#text');
const buttonElement = document.querySelector('.button');
const divElement = document.querySelector('.list');

const baseURL = `https://api.github.com/users/`;
const reposPath = `/repos`;

let username = '';

buttonElement.onclick = handleSubmit;

function handleSubmit(event) {
    event.preventDefault();
    main();
}

function main() {
    divElement.innerHTML = '';
    username = inputElement.value;
    inputElement.value = '';
    
    setLoading();
    getRepoList(username);
}

function getRepoList(username) {
    axios.get(`${baseURL}${username}${reposPath}`)
         .then(response => loadRepos(response.data))
         .catch(() => handleError());
}

function loadRepos(repos) {
    unsetLoading();
    
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
