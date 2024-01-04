import SlimSelect from 'slim-select';
import { Notify } from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './js/cat-api';

////////////////////////////////////////////////////////////

const breedSelectEl = document.querySelector('.breed-select');
const catInfoEl = document.querySelector('.cat-info');
const loaderEl = document.querySelector('.loader');
const errorEl = document.querySelector('.error');

////////////////////////////////////////////////////////////
const displaySelect = new SlimSelect({
    select: breedSelectEl
  });

// for creating the options
function chooseBreed(data) {
  fetchBreeds(data)
    .then(data => {
    errorEl.classList.add('is-hidden');  
    
    loaderEl.textContent = '';
    loaderEl.classList.replace('loader', 'is-hidden');

    let optionsMarkup = [...data.map(({ name, id }) => {
        return {value:id,text:name};
    })];

    displaySelect.setData(optionsMarkup);
    breedSelectEl.classList.remove('is-hidden'); // Show select element after options are added
    })
    .catch(onError);
}

chooseBreed();

////////////////////////////////////////////////////////////

function createMarkup(event) {
  // Show loader while loading
  loaderEl.classList.replace('is-hidden', 'loader');
  // Hide select element and cat info markup while loading
  breedSelectEl.classList.add('is-hidden');
  catInfoEl.classList.add('is-hidden');

  const breedId = event.target.value;
  //   get the option value using event.target.value
  //   console.log(event.target);
  //   console.log(event.target.value);

  fetchCatByBreed(breedId)
    .then(data => {
      loaderEl.classList.replace('loader', 'is-hidden');
      breedSelectEl.classList.remove('is-hidden');

      const { url, breeds } = data[0];
      const { name, description, temperament } = breeds[0];

      catInfoEl.innerHTML = `
      <img class="image" src="${url}" alt="${name}" width="400"/>
      <div class="box">
        <h2 class="title">${name}</h2>
        <p class="text">${description}</p>
        <p class="text"><strong class="subtitle">Temperament:</strong> ${temperament}</p>
      </div>
      `;
      catInfoEl.classList.remove('is-hidden');
      Notify.success('Successfully Loaded!',{
        cssAnimationStyle: 'zoom',
        cssAnimationDuration: 250,
        position: 'center-top',
        opacity: .8,
        fontSize: '18px',
        pauseOnHover: true,
        fontFamily: 'Roboto',
      });
    })
    .catch(onError);
}

breedSelectEl.addEventListener('change', createMarkup);

////////////////////////////////////////////////////////////

function onError() {
  // Show error Message
  errorEl.classList.remove('is-hidden');
  //   Hide select element
  breedSelectEl.classList.add('is-hidden');
}