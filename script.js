document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    let selectedItems = [];

    // Função para carregar dados da API na tabela de consulta
    const loadTableData = async (page) => {
        try {
            const response = await fetch(`URL_DA_API?page=${page}`);
            const data = await response.json();

            const tableBody = document.getElementById('queryTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';

            data.forEach(item => {
                let row = tableBody.insertRow();
                let idCell = row.insertCell(0);
                let nameCell = row.insertCell(1);
                let actionCell = row.insertCell(2);

                idCell.innerHTML = item.id;
                nameCell.innerHTML = item.name;
                
                let selectButton = document.createElement('button');
                selectButton.innerHTML = 'Selecionar';
                selectButton.className = 'btn btn-success select-item';
                selectButton.onclick = () => addToSelectionTable(item);
                actionCell.appendChild(selectButton);
            });
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    // Função para adicionar um item selecionado à tabela de seleção
    const addToSelectionTable = (item) => {
        if (selectedItems.some(selectedItem => selectedItem.id === item.id)) {
            return;
        }

        const selectionTableBody = document.getElementById('selectionTable').getElementsByTagName('tbody')[0];
        let row = selectionTableBody.insertRow();
        let idCell = row.insertCell(0);
        let nameCell = row.insertCell(1);

        idCell.innerHTML = item.id;
        nameCell.innerHTML = item.name;

        selectedItems.push(item);
    };

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage -= 1;
            loadTableData(currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        currentPage += 1;
        loadTableData(currentPage);
    });

    loadTableData(currentPage);
});
