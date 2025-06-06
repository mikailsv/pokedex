function getDropdownItemTemplate(pokemon) {
    return `
    <li 
    class="dropdown-item cursor-pointer text-capitalize" 
    onclick="showDetails(${pokemon.id})"
    data-bs-toggle="modal"
    data-bs-target="#pokemonDetails">${pokemon.name}</li>
    `;
}

function getBadgeTemplate(type) {
    return `
    <span class="badge rounded-pill text-bg-secondary text-capitalize">${type}</span>
    `;
}