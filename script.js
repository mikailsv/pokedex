const refs = {
    dropdownTrigger: document.querySelector('[data-bs-toggle=dropdown]'),
    dropdownMenu: document.querySelector('.dropdown-menu'),
    pokemonInput: document.getElementById('pokemon-input'),
    pokemonModal: document.getElementById('pokemon-details-modal'),
    pokemonModalImage: document.getElementById('modal-image'),
    pokemonModalTitle: document.getElementById('modal-title'),
    pokemonModalBadgeGroup: document.getElementById('modal-badge-group'),
};
const P = new Pokedex.Pokedex({ cacheImages: true });
let pokemons = [];

async function init() {
    let response = await P.getPokemonsList();
    pokemons = response.results.map(function (pokemonEntry) {
        return {
            name: pokemonEntry.name,
            id: pokemonEntry.url.split("/").slice(-2, -1).pop()
        }
    });
}

function search() {
    // TODO: Implement submit event for searching and displaying pokemons, that matches query.
}

const dropdown = new bootstrap.Dropdown(refs.dropdownTrigger);

function handlePokemonInput() {
    const pokemonName = refs.pokemonInput.value.toLowerCase();
    const suggestions = pokemons.filter(pokemon => pokemon.name.startsWith(pokemonName)).slice(0, 4);
    if (suggestions.length == 0 || pokemonName.length == 0) { dropdown.hide(); return; }
    renderPokemonSuggestions(suggestions);
    dropdown.show();
}

function renderPokemonSuggestions(pokemonSuggestions) {
    refs.dropdownMenu.innerHTML = '';
    pokemonSuggestions.forEach(pokemon => refs.dropdownMenu.innerHTML += getDropdownItemTemplate(pokemon));
}

if (refs.pokemonModal) {
    refs.pokemonModal.addEventListener('show.bs.modal', async event => {
        clearPokemonInput();
        const name = event.relatedTarget.getAttribute('data-bs-pokemon');
        try {
            const pokemon = await P.getPokemonByName(name);
            updatePokemonModal(pokemon);
        } catch (error) {
            // TODO: handle error 
        }
    })
    refs.pokemonModal.addEventListener('hide.bs.modal', event => {
        resetPokemonModal();
    })
}

function clearPokemonInput() {
    refs.pokemonInput.value = '';
}

function updatePokemonModal(pokemon) {
    refs.pokemonModalTitle.textContent = pokemon.name;
    renderTypeBadges(pokemon.types.map(typeWrapper => typeWrapper.type.name));
    refs.pokemonModalBadgeGroup.classList.remove('invisible');
    refs.pokemonModal.querySelector('.modal-text-wrapper').classList.remove('placeholder');
    refs.pokemonModalImage.src = pokemon.sprites.other['official-artwork'].front_default;
    refs.pokemonModalImage.classList.remove('invisible');
    refs.pokemonModalImage.onload = () => refs.pokemonModal.querySelector('.modal-image-wrapper').classList.remove('mt-2', 'placeholder');
}

function renderTypeBadges(types) {
    refs.pokemonModalBadgeGroup.innerHTML = '';
    types.forEach(type => refs.pokemonModalBadgeGroup.innerHTML += getBadgeTemplate(type));
}

function resetPokemonModal() {
    refs.pokemonModalBadgeGroup.classList.add('invisible');
    refs.pokemonModal.querySelector('.modal-text-wrapper').classList.add('placeholder');
    refs.pokemonModalImage.removeAttribute('src');
    refs.pokemonModalImage.classList.add('invisible');
    refs.pokemonModal.querySelector('.modal-image-wrapper').classList.add('mt-2', 'placeholder');
}