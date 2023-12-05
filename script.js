$(document).ready(function () {
    let currentPage = 1;
    let totalPages = 0;
    let selectedItems = [];

    const itemsPerPage = 20;

    const loadTableData = async (page) => {
        try {
            const publicKey = 'SUA_PUBLIC_KEY';
            const privateKey = 'SUA_PRIVATE_KEY';
            const timestamp = new Date().getTime();
            const hash = CryptoJS.MD5(`${timestamp}${privateKey}${publicKey}`).toString();

            const response = await fetch(`https://gateway.marvel.com/v1/public/comics?apikey=${publicKey}&ts=${timestamp}&hash=${hash}&offset=${(page - 1) * itemsPerPage}`);
            const data = await response.json();

            totalPages = Math.ceil(data.data.total / itemsPerPage);

            updatePageNumbers();

            $('#queryTable tbody').empty();

            data.data.results.forEach(comic => {
                const row = $('<tr>');
                row.append($('<td>').text(comic.id));
                row.append($('<td>').text(comic.title));

                const imageCell = $('<td>');
                if (comic.thumbnail && comic.thumbnail.path && comic.thumbnail.extension) {
                    const imageUrl = `${comic.thumbnail.path}/portrait_medium.${comic.thumbnail.extension}`;
                    const image = $('<img>').attr('src', imageUrl).addClass('comic-image');
                    imageCell.append(image);
                }
                row.append(imageCell);

                const selectButton = $('<button>').text('Selecionar').addClass('btn btn-success select-item');
                selectButton.on('click', () => addToSelectionTable(comic));
                row.append($('<td>').append(selectButton));

                $('#queryTable tbody').append(row);
            });
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const addToSelectionTable = (comic) => {
        if (selectedItems.some(selectedItem => selectedItem.id === comic.id)) {
            return;
        }

        const row = $('<tr>');
        row.append($('<td>').text(comic.id));
        row.append($('<td>').text(comic.title));

        const imageCell = $('<td>');
        if (comic.thumbnail && comic.thumbnail.path && comic.thumbnail.extension) {
            const imageUrl = `${comic.thumbnail.path}/portrait_medium.${comic.thumbnail.extension}`;
            const image = $('<img>').attr('src', imageUrl).addClass('comic-image');
            imageCell.append(image);
        }
        row.append(imageCell);

        $('#selectionTable tbody').append(row);

        selectedItems.push(comic);
    };

    const updatePageNumbers = () => {
        $('#pageNumbers').empty();

        // Adiciona botões de página de 1 até totalPages, mostrando no máximo 5 páginas por vez
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                const pageButton = $('<button>').text(i).addClass('btn btn-light');
                pageButton.on('click', () => {
                    currentPage = i;
                    loadTableData(currentPage);
                });
                $('#pageNumbers').append(pageButton);
            } else if (
                (currentPage <= 3 && i === currentPage + 3) ||
                (currentPage >= totalPages - 2 && i === currentPage - 3) ||
                (currentPage > 3 && currentPage < totalPages - 2 && i === currentPage + 3)
            ) {
                // Adiciona "..." se houver mais de 5 páginas
                const ellipsis = $('<span>').text('...').addClass('ellipsis');
                $('#pageNumbers').append(ellipsis);
            }
        }
    };

    loadTableData(currentPage);
});
