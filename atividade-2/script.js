// Define constants
const maxPokemon = 151; // Kanto region Pokémon
const pageSize = 10; // Pokémon per page
let pokemonData = []; // Store Pokémon data for the current page
let currentPage = 1; // Track current page

// Function to fetch Pokémon list for the current page
function fetchAllPokemon(page = 1) {
    currentPage = page;
    const offset = (page - 1) * pageSize;
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`;

    // Show loading indicator
    $('.loading').removeClass('d-none').html('Loading Pokémon data...');
    $('.pokemon-table').addClass('d-none');
    $('#pagination').empty();

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch Pokémon list for page ${page}`);
            }
            return response.json();
        })
        .then(data => {
            const promises = data.results.map(pokemon => 
                fetch(pokemon.url).then(res => {
                    if (!res.ok) {
                        throw new Error(`Failed to fetch details for ${pokemon.name}`);
                    }
                    return res.json();
                })
            );

            return Promise.all(promises);
        })
        .then(results => {
            pokemonData = results.map(data => ({
                id: data.id,
                name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
                image: data.sprites.front_default,
                types: data.types.map(type => type.type.name).join(', '),
                height: data.height / 10 + ' m',
                weight: data.weight / 10 + ' kg',
                abilities: data.abilities.map(ability => ability.ability.name).join(', ')
            }));

            pokemonData.sort((a, b) => a.id - b.id);
            populateTable();
            updatePagination();
        })
        .catch(error => {
            console.error('Error fetching Pokémon data:', error);
            $('.loading').html('<p class="text-danger">Error loading Pokémon data. Please try again later.</p>');
        });
}

// Function to populate the HTML table with Pokémon data
function populateTable() {
    const $tableBody = $('#pokemonTableBody');
    $tableBody.empty();

    pokemonData.forEach(pokemon => {
        const row = `
            <tr>
                <td>${pokemon.id}</td>
                <td>${pokemon.name}</td>
                <td><img src="${pokemon.image}" alt="${pokemon.name}" class="pokemon-img"></td>
                <td>${pokemon.types}</td>
                <td>${pokemon.height}</td>
                <td>${pokemon.weight}</td>
                <td>${pokemon.abilities}</td>
            </tr>
        `;
        $tableBody.append(row);
    });

    $('.loading').addClass('d-none');
    $('.pokemon-table').removeClass('d-none');
}

// Function to update pagination controls using Bootstrap Pagination
function updatePagination() {
    const $pagination = $('#pagination');
    $pagination.empty();

    // Calculate total pages
    const totalPages = Math.ceil(maxPokemon / pageSize);
    const maxPagesToShow = 4; // Show up to 4 page numbers

    // Calculate the range of pages to display
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    // Adjust startPage if endPage is at the maximum
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Create Bootstrap pagination
    const $nav = $('<nav aria-label="Pokémon pagination"></nav>');
    const $ul = $('<ul class="pagination"></ul>');

    // Previous button
    $ul.append(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="fetchAllPokemon(${currentPage - 1}); return false;" aria-label="Previous">
                <span aria-hidden="true">«</span>
            </a>
        </li>
    `);

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        $ul.append(`
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="fetchAllPokemon(${i}); return false;">${i}</a>
            </li>
        `);
    }

    // Next button
    $ul.append(`
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="fetchAllPokemon(${currentPage + 1}); return false;" aria-label="Next">
                <span aria-hidden="true">»</span>
            </a>
        </li>
    `);

    $nav.append($ul);
    $pagination.append($nav);
}

// Start fetching Pokémon data for the first page
fetchAllPokemon(1);