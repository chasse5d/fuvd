document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('students-table');
    const tbody = table.querySelector('.data-table__body');
    const searchInput = document.getElementById('table-search');
    const exportBtn = document.getElementById('export-csv');
    const resetBtn = document.getElementById('reset-filters');
    const headers = table.querySelectorAll('.data-table__cell--sortable');
    
    let currentSort = { column: null, direction: 'asc' };
    let originalRows = Array.from(tbody.querySelectorAll('tr'));

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        filterRows(query);
        updateStats();
    });

    function filterRows(query) {
        originalRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const match = text.includes(query);
            row.style.display = match ? '' : 'none';
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
        const rows = Array.from(tbody.querySelectorAll('tr'));
        rows.sort((a, b) => {
            const getCell = (row) => {
                if (column === 'number') return row.cells[0].textContent;
                if (column === 'surname') return row.cells[1].textContent;
                if (column === 'name') return row.cells[2].textContent;
                if (column === 'age') return parseInt(row.cells[3].textContent) || 0;
                if (column === 'group') return row.cells[4].textContent;
                if (column === 'direction') return row.cells[5].textContent;
                if (column === 'form') return row.cells[6].textContent;
                return '';
            };
            
            const aVal = getCell(a);
            const bVal = getCell(b);
            
            if (!isNaN(aVal) && !isNaN(bVal)) {
                return direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return direction === 'asc' 
                ? aVal.localeCompare(bVal, 'ru') 
                : bVal.localeCompare(aVal, 'ru');
        });
        
        rows.forEach(row => tbody.appendChild(row));
    }

    function updateSortIndicators() {
        headers.forEach(h => h.classList.remove('data-table__cell--sorted-asc', 'data-table__cell--sorted-desc'));
        const activeHeader = [...headers].find(h => h.dataset.sort === currentSort.column);
        if (activeHeader) {
            activeHeader.classList.add(`data-table__cell--sorted-${currentSort.direction}`);
        }
    }

    exportBtn.addEventListener('click', () => {
        const headers = ['№', 'Фамилия', 'Имя', 'Возраст', 'Группа', 'Направление', 'Форма'];
        const rows = Array.from(tbody.querySelectorAll('tr'))
            .filter(tr => tr.style.display !== 'none')
            .map(tr => Array.from(tr.querySelectorAll('.data-table__cell'))
                .map(td => td.textContent.replace('Очная', 'Очная').replace('Заочная', 'Заочная').replace('Не поступил', 'Не поступил').trim())
            );
        
        const csv = [
            headers.join(';'),
            ...rows.map(row => row.join(';'))
        ].join('\n');
        
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `fuvd_students_${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
    });

    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSort = { column: null, direction: 'asc' };
        originalRows.forEach(row => {
            row.style.display = '';
            tbody.appendChild(row);
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

    updateStats();
});