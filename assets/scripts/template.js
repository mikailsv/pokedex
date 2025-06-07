function getDropdownItemTemplate(pokemon) {
    return `
    <li 
    class="dropdown-item cursor-pointer text-capitalize"
    data-bs-toggle="modal"
    data-bs-pokemon="${pokemon.name}"
    data-bs-target="#pokemon-details-modal">${pokemon.name}</li>
    `;
}

function getBadgeTemplate(type) {
    return `
    <span class="badge rounded-pill text-bg-secondary text-capitalize">${type}</span>
    `;
}