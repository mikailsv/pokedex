function getDropdownItemTemplate(pokemon) {
    return `
    <li class="dropdown-item cursor-pointer text-capitalize" onclick="showDetails(${pokemon.id})">${pokemon.name}</li>
    `;
}