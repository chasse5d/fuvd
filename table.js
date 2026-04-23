document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('students-table');
    const tbody = table.querySelector('.data-table__body');
    const searchInput = document.getElementById('table-search');
    const exportBtn = document.getElementById('export-csv');
    const resetBtn = document.getElementById('reset-filters');
    const headers = table.querySelectorAll('.data-table__cell--sortable');
    
    let currentSort = { column: null, direction: 'asc' };
    let originalRows = Array.from(tbody.querySelectorAll('tr')).map(tr => tr.cloneNode(true));

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        filterRows(query);
        updateStats();
    });

    function filterRows(query) {
        originalRows.forEach((row, index) => {
            const text = row.textContent.toLowerCase();
            const match = text.includes(query);
            const domRow = tbody.children[index];
            if (domRow) {
                domRow.style.display = match ? '' : 'none';
            }
        });
    }

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.direction = 'asc';
            }
            sortTable(column, currentSort.direction);
            updateSortIndicators();
        });
    });

    function sortTable(column, direction) {
        const sortedRows = [...originalRows].sort((a, b) => {
            const getCellText = (row, colIndex) => {
                const cell = row.cells[colIndex];
                return cell ? cell.textContent.trim() : '';
            };

            let aVal, bVal;
            switch(column) {
                case 'number': aVal = parseInt(getCellText(a, 0)) || 0; bVal = parseInt(getCellText(b, 0)) || 0; break;
                case 'surname': aVal = getCellText(a, 1); bVal = getCellText(b, 1); break;
                case 'name': aVal = getCellText(a, 2); bVal = getCellText(b, 2); break;
                case 'age': aVal = parseInt(getCellText(a, 3)) || 0; bVal = parseInt(getCellText(b, 3)) || 0; break;
                case 'group': aVal = getCellText(a, 4); bVal = getCellText(b, 4); break;
                case 'direction': aVal = getCellText(a, 5); bVal = getCellText(b, 5); break;
                case 'form': aVal = getCellText(a, 6); bVal = getCellText(b, 6); break;
                default: return 0;
            }

            if (!isNaN(aVal) && !isNaN(bVal)) {
                return direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return direction === 'asc' 
                ? aVal.localeCompare(bVal, 'ru') 
                : bVal.localeCompare(aVal, 'ru');
        });

        tbody.innerHTML = '';
        sortedRows.forEach(row => {
            tbody.appendChild(row.cloneNode(true));
        });
        originalRows = sortedRows.map(r => r.cloneNode(true));
    }

    function updateSortIndicators() {
        headers.forEach(h => h.classList.remove('data-table__cell--sorted-asc', 'data-table__cell--sorted-desc'));
        const activeHeader = [...headers].find(h => h.dataset.sort === currentSort.column);
        if (activeHeader) {
            activeHeader.classList.add(`data-table__cell--sorted-${currentSort.direction}`);
        }
    }

    exportBtn.addEventListener('click', () => {
        const visibleRows = Array.from(tbody.querySelectorAll('tr'))
            .filter(tr => tr.style.display !== 'none');

        const csvContent = [
            ['№', 'Фамилия', 'Имя', 'Возраст', 'Группа', 'Направление', 'Форма'].join(';'),
            ...visibleRows.map(tr => 
                Array.from(tr.querySelectorAll('.data-table__cell'))
                    .map(td => td.textContent.replace(/[\n\r]+/g, '').trim())
                    .join(';')
            )
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `fuvd_students_${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
    });

    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSort = { column: null, direction: 'asc' };
        tbody.innerHTML = '';
        originalRows.forEach(row => {
            tbody.appendChild(row.cloneNode(true));
        });

        updateSortIndicators();
        updateStats();
    });

    function updateStats() {
        const visible = tbody.querySelectorAll('tr:not([style*="display: none"])');
        document.getElementById('results-count').textContent = `Показано: ${visible.length} из ${originalRows.length}`;
        
        const fulltime = Array.from(visible).filter(tr => 
            tr.querySelector('.badge--primary')
        ).length;
        const parttime = Array.from(visible).filter(tr => 
            tr.querySelector('.badge--warning')
        ).length;
        
        document.getElementById('fulltime-count').textContent = fulltime;
        document.getElementById('parttime-count').textContent = parttime;
    }

    tbody.innerHTML = '';
    originalRows.forEach(row => {
        tbody.appendChild(row.cloneNode(true));
    });
    updateStats();
});