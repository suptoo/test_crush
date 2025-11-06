// Data Storage
let dataStore = {
    entries: [],
    filteredEntries: [],
    dateRange: { start: null, end: null }
};

// Chart instances - simplified
let charts = {
    main: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDatePicker();
    loadSampleData();
    initializeCharts();
    attachEventListeners();
    updateStatistics();
    updateLastUpdateTime();
});

// Initialize Flatpickr date range picker
function initializeDatePicker() {
    flatpickr("#dateRange", {
        mode: "range",
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length === 2) {
                dataStore.dateRange.start = selectedDates[0];
                dataStore.dateRange.end = selectedDates[1];
                filterData();
                updateAllVisualizations();
            }
        }
    });
}

// Load actual October 2024 data from the document
function loadSampleData() {
    // Real data from October_Hours_Final_90 document
    const octoberData = [
        { date: "2024-10-01", unrestricted: 2.5, restricted: 1.0, supervision: 1.0, unrestrictedDesc: "Client contact observation during supervision", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-02", unrestricted: 3.5, restricted: 0.0, supervision: 0.0, unrestrictedDesc: "School closed - ISP updates & reinforcement planning", restrictedDesc: "", time: "10:00 AM - 01:30 PM" },
        { date: "2024-10-03", unrestricted: 2.5, restricted: 1.0, supervision: 0.0, unrestrictedDesc: "Token system & behavior expectations planning", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-06", unrestricted: 2.5, restricted: 1.0, supervision: 0.0, unrestrictedDesc: "Teacher collaboration & daily goal planning", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-07", unrestricted: 2.5, restricted: 1.0, supervision: 1.0, unrestrictedDesc: "Supervision", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-08", unrestricted: 2.5, restricted: 1.0, supervision: 0.0, unrestrictedDesc: "Calm corner routine modeling & reinforcement menu", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-09", unrestricted: 2.5, restricted: 1.0, supervision: 0.0, unrestrictedDesc: "ABC data review and behavior adjustments", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-10", unrestricted: 2.5, restricted: 1.0, supervision: 1.0, unrestrictedDesc: "Supervision", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-13", unrestricted: 3.5, restricted: 0.0, supervision: 0.0, unrestrictedDesc: "School closed - data organization & planning", restrictedDesc: "", time: "10:00 AM - 01:30 PM" },
        { date: "2024-10-14", unrestricted: 2.5, restricted: 1.0, supervision: 1.0, unrestrictedDesc: "Supervision", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-15", unrestricted: 2.5, restricted: 1.0, supervision: 0.0, unrestrictedDesc: "Reward system update & visual board writing", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-16", unrestricted: 2.5, restricted: 1.0, supervision: 0.0, unrestrictedDesc: "Behavior replacement planning", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-17", unrestricted: 2.5, restricted: 1.0, supervision: 1.0, unrestrictedDesc: "Supervision", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-20", unrestricted: 3.5, restricted: 0.0, supervision: 0.0, unrestrictedDesc: "School closed - group behavior lesson planning", restrictedDesc: "", time: "10:00 AM - 01:30 PM" },
        { date: "2024-10-21", unrestricted: 2.5, restricted: 1.0, supervision: 1.0, unrestrictedDesc: "Supervision", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-22", unrestricted: 2.5, restricted: 1.0, supervision: 0.0, unrestrictedDesc: "Outside time reinforcement setup", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-23", unrestricted: 2.5, restricted: 1.0, supervision: 0.0, unrestrictedDesc: "Classroom expectation board rewriting", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-24", unrestricted: 2.5, restricted: 1.0, supervision: 1.0, unrestrictedDesc: "Supervision", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-27", unrestricted: 2.5, restricted: 1.0, supervision: 0.0, unrestrictedDesc: "ABC pattern tracking & intervention changes", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-28", unrestricted: 2.5, restricted: 1.0, supervision: 1.0, unrestrictedDesc: "Supervision", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-29", unrestricted: 2.5, restricted: 1.0, supervision: 0.0, unrestrictedDesc: "Generalization & follow-through planning", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-30", unrestricted: 2.5, restricted: 1.0, supervision: 0.0, unrestrictedDesc: "Visual schedule refresh & reinforcement cues", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" },
        { date: "2024-10-31", unrestricted: 2.5, restricted: 1.0, supervision: 1.0, unrestrictedDesc: "Supervision & month review", restrictedDesc: "Helping student with homework and task completion", time: "10:00 AM - 12:30 PM" }
    ];
    
    // Convert to dataStore format
    octoberData.forEach(entry => {
        const totalHours = entry.unrestricted + entry.restricted + entry.supervision;
        dataStore.entries.push({
            date: entry.date,
            hours: totalHours,
            unrestricted: entry.unrestricted,
            restricted: entry.restricted,
            supervision: entry.supervision,
            category: entry.supervision > 0 ? 'Supervised' : (entry.restricted > 0 ? 'Restricted' : 'Unrestricted'),
            notes: `${entry.unrestrictedDesc} | ${entry.restrictedDesc}`.replace(' | ', ''),
            time: entry.time,
            unrestrictedDesc: entry.unrestrictedDesc,
            restrictedDesc: entry.restrictedDesc
        });
    });
    
    dataStore.filteredEntries = [...dataStore.entries];
    sortDataByDate();
}

// Sort data by date
function sortDataByDate() {
    dataStore.entries.sort((a, b) => new Date(a.date) - new Date(b.date));
    dataStore.filteredEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Filter data based on selected criteria
function filterData() {
    const filter = document.getElementById('dataFilter').value;
    let filtered = [...dataStore.entries];
    
    // Apply date range filter
    if (dataStore.dateRange.start && dataStore.dateRange.end) {
        filtered = filtered.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= dataStore.dateRange.start && entryDate <= dataStore.dateRange.end;
        });
    }
    
    // Apply time-based filter
    if (filter === 'weekly') {
        // Group by week
        filtered = aggregateByWeek(filtered);
    } else if (filter === 'monthly') {
        // Group by month
        filtered = aggregateByMonth(filtered);
    }
    
    dataStore.filteredEntries = filtered;
}

// Aggregate data by week
function aggregateByWeek(data) {
    const weekMap = new Map();
    
    data.forEach(entry => {
        const date = new Date(entry.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weekMap.has(weekKey)) {
            weekMap.set(weekKey, { date: weekKey, hours: 0, category: 'Weekly', notes: 'Week aggregate' });
        }
        weekMap.get(weekKey).hours += entry.hours;
    });
    
    return Array.from(weekMap.values());
}

// Aggregate data by month
function aggregateByMonth(data) {
    const monthMap = new Map();
    
    data.forEach(entry => {
        const date = new Date(entry.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthMap.has(monthKey)) {
            monthMap.set(monthKey, { date: monthKey, hours: 0, category: 'Monthly', notes: 'Month aggregate' });
        }
        monthMap.get(monthKey).hours += entry.hours;
    });
    
    return Array.from(monthMap.values());
}

// Initialize all charts - SIMPLIFIED VERSION
function initializeCharts() {
    initializeMainChart();
    initializeCalendarView();
}

// Main Chart - Stacked Bar showing all days
function initializeMainChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    const data = dataStore.filteredEntries;
    
    if (charts.main) charts.main.destroy();
    
    charts.main = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(e => {
                const date = new Date(e.date);
                return `${date.getMonth()+1}/${date.getDate()}`;
            }),
            datasets: [
                {
                    label: 'Unrestricted Hours',
                    data: data.map(e => e.unrestricted || 0),
                    backgroundColor: 'rgba(74, 222, 128, 0.9)',
                    borderColor: '#4ade80',
                    borderWidth: 1
                },
                {
                    label: 'Restricted Hours',
                    data: data.map(e => e.restricted || 0),
                    backgroundColor: 'rgba(251, 191, 36, 0.9)',
                    borderColor: '#fbbf24',
                    borderWidth: 1
                },
                {
                    label: 'Supervision Hours',
                    data: data.map(e => e.supervision || 0),
                    backgroundColor: 'rgba(102, 126, 234, 0.9)',
                    borderColor: '#667eea',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    showDayDetails(data[index]);
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#e2e8f0',
                        font: { size: 14 },
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Click any bar to see detailed breakdown',
                    color: '#94a3b8',
                    font: { size: 13, style: 'italic' },
                    padding: { bottom: 20 }
                },
                tooltip: {
                    callbacks: {
                        footer: (tooltipItems) => {
                            const total = tooltipItems.reduce((sum, item) => sum + item.parsed.y, 0);
                            return `Total: ${total.toFixed(1)} hours\nClick for details`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: { 
                        color: '#94a3b8',
                        maxRotation: 90,
                        minRotation: 45,
                        autoSkip: false,
                        font: { size: 11 }
                    },
                    grid: { color: '#334155' }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: { 
                        color: '#94a3b8',
                        stepSize: 1
                    },
                    grid: { color: '#334155' }
                }
            }
        }
    });
}

// Bar Chart with BACB categories - Every day visible
function initializeBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    const data = dataStore.filteredEntries;
    
    charts.bar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(e => {
                const date = new Date(e.date);
                return `${date.getMonth()+1}/${date.getDate()}`;
            }),
            datasets: [
                {
                    label: 'Unrestricted Hours',
                    data: data.map(e => e.unrestricted || 0),
                    backgroundColor: 'rgba(74, 222, 128, 0.8)',
                    borderColor: '#4ade80',
                    borderWidth: 2,
                    borderRadius: 5
                },
                {
                    label: 'Restricted Hours',
                    data: data.map(e => e.restricted || 0),
                    backgroundColor: 'rgba(251, 191, 36, 0.8)',
                    borderColor: '#fbbf24',
                    borderWidth: 2,
                    borderRadius: 5
                },
                {
                    label: 'Supervision Hours',
                    data: data.map(e => e.supervision || 0),
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: '#667eea',
                    borderWidth: 2,
                    borderRadius: 5
                }
            ]
        },
        options: {
            ...getChartOptions('BACB Hours by Category - Each Day'),
            scales: {
                x: {
                    stacked: true,
                    ticks: { 
                        color: '#94a3b8',
                        maxRotation: 90,
                        minRotation: 45,
                        autoSkip: false,
                        font: { size: 11 }
                    },
                    grid: { color: '#334155' }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: { 
                        color: '#94a3b8',
                        stepSize: 1
                    },
                    grid: { color: '#334155' }
                }
            }
        }
    });
}

// Pie Chart for BACB hour distribution
function initializePieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    // Calculate totals for each category
    let totalUnrestricted = 0;
    let totalRestricted = 0;
    let totalSupervision = 0;
    
    dataStore.filteredEntries.forEach(entry => {
        totalUnrestricted += entry.unrestricted || 0;
        totalRestricted += entry.restricted || 0;
        totalSupervision += entry.supervision || 0;
    });
    
    charts.pie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Unrestricted Hours', 'Restricted Hours', 'Supervision Hours'],
            datasets: [{
                data: [totalUnrestricted, totalRestricted, totalSupervision],
                backgroundColor: [
                    'rgba(74, 222, 128, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(102, 126, 234, 0.8)'
                ],
                borderColor: '#1e293b',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e2e8f0',
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                title: {
                    display: true,
                    text: 'BACB Hour Distribution',
                    color: '#e2e8f0',
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value.toFixed(1)} hrs (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Doughnut Chart for BACB distribution
function initializeDoughnutChart() {
    const ctx = document.getElementById('doughnutChart').getContext('2d');
    
    // Calculate totals for each category
    let totalUnrestricted = 0;
    let totalRestricted = 0;
    let totalSupervision = 0;
    
    dataStore.filteredEntries.forEach(entry => {
        totalUnrestricted += entry.unrestricted || 0;
        totalRestricted += entry.restricted || 0;
        totalSupervision += entry.supervision || 0;
    });
    
    charts.doughnut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Unrestricted', 'Restricted', 'Supervision'],
            datasets: [{
                data: [totalUnrestricted, totalRestricted, totalSupervision],
                backgroundColor: [
                    'rgba(74, 222, 128, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(102, 126, 234, 0.8)'
                ],
                borderColor: '#1e293b',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e2e8f0',
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                title: {
                    display: true,
                    text: 'BACB Category Distribution',
                    color: '#e2e8f0',
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    });
}

// Radar Chart
function initializeRadarChart() {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const categoryData = aggregateByCategory();
    
    charts.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                label: 'Hours by Category',
                data: Object.values(categoryData),
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: '#667eea',
                borderWidth: 3,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        color: '#94a3b8',
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: '#334155'
                    },
                    pointLabels: {
                        color: '#e2e8f0',
                        font: { size: 12 }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#e2e8f0' }
                },
                title: {
                    display: true,
                    text: 'Category Radar View',
                    color: '#e2e8f0',
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    });
}

// Area Chart
function initializeAreaChart() {
    const ctx = document.getElementById('areaChart').getContext('2d');
    const data = dataStore.filteredEntries;
    
    charts.area = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(e => formatDate(e.date)),
            datasets: [{
                label: 'Cumulative Hours',
                data: calculateCumulative(data.map(e => e.hours)),
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.3)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 7
            }]
        },
        options: getChartOptions('Cumulative Hours')
    });
}

// Calculate cumulative sum
function calculateCumulative(data) {
    let sum = 0;
    return data.map(value => {
        sum += value;
        return parseFloat(sum.toFixed(2));
    });
}

// Heatmap
function initializeHeatmap() {
    const container = document.getElementById('heatmap');
    container.innerHTML = '';
    
    const data = dataStore.filteredEntries;
    if (data.length === 0) return;
    
    // Group by week and day
    const weeks = groupByWeek(data);
    
    const width = container.offsetWidth;
    const cellSize = 40;
    const height = weeks.length * (cellSize + 4) + 40;
    
    const svg = d3.select('#heatmap')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const maxHours = d3.max(data, d => d.hours);
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, maxHours]);
    
    weeks.forEach((week, weekIndex) => {
        week.forEach((day, dayIndex) => {
            if (day) {
                const g = svg.append('g')
                    .attr('class', 'heatmap-cell')
                    .style('cursor', 'pointer');
                
                g.append('rect')
                    .attr('x', dayIndex * (cellSize + 4) + 60)
                    .attr('y', weekIndex * (cellSize + 4) + 20)
                    .attr('width', cellSize)
                    .attr('height', cellSize)
                    .attr('rx', 5)
                    .attr('fill', colorScale(day.hours))
                    .attr('stroke', '#334155')
                    .attr('stroke-width', 1);
                
                g.append('text')
                    .attr('x', dayIndex * (cellSize + 4) + 60 + cellSize / 2)
                    .attr('y', weekIndex * (cellSize + 4) + 20 + cellSize / 2)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', day.hours > maxHours / 2 ? '#fff' : '#000')
                    .attr('font-size', '12px')
                    .attr('font-weight', 'bold')
                    .text(day.hours.toFixed(1));
                
                g.on('mouseover', function(event) {
                    showTooltip(event, `${day.date}: ${day.hours} hours`);
                }).on('mouseout', hideTooltip);
            }
        });
        
        // Week label
        svg.append('text')
            .attr('x', 5)
            .attr('y', weekIndex * (cellSize + 4) + 20 + cellSize / 2)
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'middle')
            .attr('fill', '#94a3b8')
            .attr('font-size', '11px')
            .text(`Week ${weekIndex + 1}`);
    });
    
    // Day labels
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach((day, i) => {
        svg.append('text')
            .attr('x', i * (cellSize + 4) + 60 + cellSize / 2)
            .attr('y', 12)
            .attr('text-anchor', 'middle')
            .attr('fill', '#94a3b8')
            .attr('font-size', '11px')
            .text(day);
    });
}

// Group data by week
function groupByWeek(data) {
    if (data.length === 0) return [];
    
    const weeks = [];
    let currentWeek = new Array(7).fill(null);
    
    data.forEach(entry => {
        const date = new Date(entry.date);
        const dayOfWeek = date.getDay();
        
        // If we're starting a new week
        if (dayOfWeek === 0 && currentWeek.some(d => d !== null)) {
            weeks.push([...currentWeek]);
            currentWeek = new Array(7).fill(null);
        }
        
        currentWeek[dayOfWeek] = entry;
    });
    
    // Add the last week
    if (currentWeek.some(d => d !== null)) {
        weeks.push(currentWeek);
    }
    
    return weeks;
}

// Calendar View - Shows EVERY day in October with full details
function initializeCalendarView() {
    const container = document.getElementById('calendarView');
    container.innerHTML = '';
    
    const data = dataStore.filteredEntries;
    
    // Create October 2024 calendar - ALL 31 days
    const year = 2024;
    const month = 9; // October (0-indexed)
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Add month/year header
    const header = document.createElement('div');
    header.style.gridColumn = '1 / -1';
    header.style.textAlign = 'center';
    header.style.fontSize = '1.8em';
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '25px';
    header.style.padding = '15px';
    header.style.background = 'var(--gradient)';
    header.style.borderRadius = '10px';
    header.textContent = 'October 2024';
    container.appendChild(header);
    
    // Add day headers
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.style.textAlign = 'center';
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.color = '#667eea';
        dayHeader.style.padding = '10px';
        dayHeader.style.fontSize = '1.1em';
        dayHeader.textContent = day;
        container.appendChild(dayHeader);
    });
    
    // Create a map of dates to data
    const dateMap = new Map();
    data.forEach(entry => {
        dateMap.set(entry.date, entry);
    });
    
    // Add empty cells for days before October 1st
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.style.minHeight = '120px';
        container.appendChild(emptyCell);
    }
    
    // Add ALL 31 days of October
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day;
        dayDiv.appendChild(dayNumber);
        
        if (dateMap.has(dateStr)) {
            dayDiv.classList.add('has-data');
            const entry = dateMap.get(dateStr);
            
            // Show detailed breakdown
            const infoDiv = document.createElement('div');
            infoDiv.className = 'calendar-day-info';
            
            const totalBadge = document.createElement('div');
            totalBadge.className = 'calendar-hours-badge';
            totalBadge.textContent = `${entry.hours} hrs`;
            infoDiv.appendChild(totalBadge);
            
            const breakdown = document.createElement('div');
            breakdown.style.marginTop = '8px';
            breakdown.style.textAlign = 'left';
            breakdown.innerHTML = `
                <div style="color: #4ade80; margin: 3px 0;">✓ U: ${entry.unrestricted}h</div>
                <div style="color: #fbbf24; margin: 3px 0;">✓ R: ${entry.restricted}h</div>
                <div style="color: #667eea; margin: 3px 0;">✓ S: ${entry.supervision}h</div>
            `;
            infoDiv.appendChild(breakdown);
            
            const clickHint = document.createElement('div');
            clickHint.style.marginTop = '8px';
            clickHint.style.fontSize = '0.75em';
            clickHint.style.color = '#94a3b8';
            clickHint.style.fontStyle = 'italic';
            clickHint.textContent = '👆 Click for details';
            infoDiv.appendChild(clickHint);
            
            dayDiv.appendChild(infoDiv);
            
            dayDiv.addEventListener('click', () => {
                showDayDetails(entry);
            });
        } else {
            // No data for this day
            dayDiv.style.opacity = '0.4';
            const noData = document.createElement('div');
            noData.style.fontSize = '0.85em';
            noData.style.color = '#64748b';
            noData.style.marginTop = '15px';
            noData.textContent = 'No fieldwork';
            dayDiv.appendChild(noData);
        }
        
        container.appendChild(dayDiv);
    }
}

// Show detailed day view in modal
function showDayDetails(entry) {
    const modal = document.getElementById('dayDetailsModal');
    const content = document.getElementById('dayDetailsContent');
    
    const date = new Date(entry.date);
    const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    content.innerHTML = `
        <button class="close-modal" onclick="closeDayDetails()">✕</button>
        
        <h2 style="color: var(--primary-color); margin-bottom: 20px; font-size: 2em;">
            📅 ${dateStr}
        </h2>
        
        <div class="day-detail-section">
            <h3>⏰ Time</h3>
            <p style="font-size: 1.3em; color: var(--text-color);">${entry.time || 'Not specified'}</p>
        </div>
        
        <div class="day-detail-section">
            <h3>📊 Hours Breakdown</h3>
            <div class="hour-breakdown">
                <div class="hour-item" style="border-color: #4ade80;">
                    <div class="hour-label">Unrestricted</div>
                    <div class="hour-value" style="color: #4ade80;">${entry.unrestricted}</div>
                    <div class="hour-label">Hours</div>
                </div>
                <div class="hour-item" style="border-color: #fbbf24;">
                    <div class="hour-label">Restricted</div>
                    <div class="hour-value" style="color: #fbbf24;">${entry.restricted}</div>
                    <div class="hour-label">Hours</div>
                </div>
                <div class="hour-item" style="border-color: #667eea;">
                    <div class="hour-label">Supervision</div>
                    <div class="hour-value" style="color: #667eea;">${entry.supervision}</div>
                    <div class="hour-label">Hours</div>
                </div>
                <div class="hour-item" style="border-color: var(--accent-color);">
                    <div class="hour-label">Total</div>
                    <div class="hour-value" style="color: var(--accent-color);">${entry.hours}</div>
                    <div class="hour-label">Hours</div>
                </div>
            </div>
        </div>
        
        ${entry.unrestrictedDesc ? `
        <div class="day-detail-section">
            <h3>� Unrestricted Activities</h3>
            <div class="activity-description">
                ${entry.unrestrictedDesc}
            </div>
        </div>
        ` : ''}
        
        ${entry.restrictedDesc ? `
        <div class="day-detail-section">
            <h3>🟡 Restricted Activities</h3>
            <div class="activity-description">
                ${entry.restrictedDesc}
            </div>
        </div>
        ` : ''}
        
        <div class="day-chart-container">
            <canvas id="dayPieChart"></canvas>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // Create mini pie chart for this day
    setTimeout(() => {
        const ctx = document.getElementById('dayPieChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Unrestricted', 'Restricted', 'Supervision'],
                datasets: [{
                    data: [entry.unrestricted, entry.restricted, entry.supervision],
                    backgroundColor: [
                        'rgba(74, 222, 128, 0.8)',
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(102, 126, 234, 0.8)'
                    ],
                    borderWidth: 3,
                    borderColor: '#1e293b'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#e2e8f0', font: { size: 14 }, padding: 20 }
                    },
                    title: {
                        display: true,
                        text: 'Hours Distribution for This Day',
                        color: '#e2e8f0',
                        font: { size: 16, weight: 'bold' }
                    }
                }
            }
        });
    }, 100);
}

function closeDayDetails() {
    document.getElementById('dayDetailsModal').style.display = 'none';
}

// Data Table with BACB categories
function initializeDataTable() {
    const container = document.getElementById('dataTable');
    const data = dataStore.filteredEntries;
    
    let html = '<table><thead><tr>';
    html += '<th>Date</th><th>Time</th><th>Unrestricted</th><th>Restricted</th><th>Supervision</th><th>Total</th><th>Unrestricted Activity</th><th>Restricted Activity</th><th>Actions</th>';
    html += '</tr></thead><tbody>';
    
    data.forEach((entry, index) => {
        html += '<tr>';
        html += `<td><strong>${formatDate(entry.date)}</strong></td>`;
        html += `<td style="font-size: 0.85em; color: #94a3b8;">${entry.time || 'N/A'}</td>`;
        html += `<td><span style="background: rgba(74, 222, 128, 0.2); color: #4ade80; padding: 4px 10px; border-radius: 12px; font-weight: bold;">${entry.unrestricted || 0} hrs</span></td>`;
        html += `<td><span style="background: rgba(251, 191, 36, 0.2); color: #fbbf24; padding: 4px 10px; border-radius: 12px; font-weight: bold;">${entry.restricted || 0} hrs</span></td>`;
        html += `<td><span style="background: rgba(102, 126, 234, 0.2); color: #667eea; padding: 4px 10px; border-radius: 12px; font-weight: bold;">${entry.supervision || 0} hrs</span></td>`;
        html += `<td><strong>${entry.hours}</strong></td>`;
        html += `<td style="max-width: 250px;">${entry.unrestrictedDesc || entry.notes}</td>`;
        html += `<td style="max-width: 250px;">${entry.restrictedDesc || ''}</td>`;
        html += `<td><button onclick="deleteEntry(${index})" style="background: #f87171; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px;">Delete</button></td>`;
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Delete entry
function deleteEntry(index) {
    if (confirm('Are you sure you want to delete this entry?')) {
        dataStore.entries.splice(index, 1);
        filterData();
        updateAllVisualizations();
        updateStatistics();
    }
}

// Aggregate by category
function aggregateByCategory() {
    const categoryMap = {};
    
    dataStore.filteredEntries.forEach(entry => {
        if (!categoryMap[entry.category]) {
            categoryMap[entry.category] = 0;
        }
        categoryMap[entry.category] += entry.hours;
    });
    
    // Round values
    Object.keys(categoryMap).forEach(key => {
        categoryMap[key] = parseFloat(categoryMap[key].toFixed(2));
    });
    
    return categoryMap;
}

// Update statistics with BACB-specific metrics
function updateStatistics() {
    const data = dataStore.filteredEntries;
    
    if (data.length === 0) {
        document.querySelector('#totalHours .stat-value').textContent = '0';
        document.querySelector('#unrestrictedCard .stat-value').textContent = '0';
        document.querySelector('#restrictedCard .stat-value').textContent = '0';
        document.querySelector('#supervisionCard .stat-value').textContent = '0';
        document.querySelector('#workingDays .stat-value').textContent = '0';
        return;
    }
    
    // Calculate BACB hour categories
    let totalUnrestricted = 0;
    let totalRestricted = 0;
    let totalSupervision = 0;
    let totalHours = 0;
    
    data.forEach(entry => {
        totalUnrestricted += entry.unrestricted || 0;
        totalRestricted += entry.restricted || 0;
        totalSupervision += entry.supervision || 0;
        totalHours += entry.hours || 0;
    });
    
    // Update stat cards with actual totals
    document.querySelector('#totalHours .stat-value').textContent = totalHours.toFixed(1);
    document.querySelector('#unrestrictedCard .stat-value').textContent = totalUnrestricted.toFixed(1);
    document.querySelector('#restrictedCard .stat-value').textContent = totalRestricted.toFixed(1);
    document.querySelector('#supervisionCard .stat-value').textContent = totalSupervision.toFixed(1);
    document.querySelector('#workingDays .stat-value').textContent = data.length;
    
    // Calculate supervision percentage (BACB requires 5% minimum)
    const supervisionPercent = totalHours > 0 ? (totalSupervision / totalHours * 100) : 0;
    const meetsRequirement = supervisionPercent >= 5;
    
    // Update the change text to show supervision percentage
    const totalCard = document.querySelector('#totalHours .stat-change');
    totalCard.textContent = `${supervisionPercent.toFixed(1)}% Supervision`;
    totalCard.className = meetsRequirement ? 'stat-change positive' : 'stat-change negative';
    
    // Add percentages to other cards
    document.querySelector('#unrestrictedCard .stat-change').textContent = 
        `${((totalUnrestricted/totalHours)*100).toFixed(1)}%`;
    document.querySelector('#restrictedCard .stat-change').textContent = 
        `${((totalRestricted/totalHours)*100).toFixed(1)}%`;
    document.querySelector('#supervisionCard .stat-change').textContent = 
        meetsRequirement ? '✓ Meets BACB 5%' : '✗ Below 5%';
    document.querySelector('#supervisionCard .stat-change').className = 
        meetsRequirement ? 'stat-change positive' : 'stat-change negative';
}

// Update all visualizations
function updateAllVisualizations() {
    destroyAllCharts();
    initializeCharts();
    updateStatistics();
    updateLastUpdateTime();
}

// Destroy all charts
function destroyAllCharts() {
    if (charts.main) charts.main.destroy();
}

// Get chart options
function getChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: '#e2e8f0',
                    font: { size: 12 }
                }
            },
            title: {
                display: true,
                text: title,
                color: '#e2e8f0',
                font: { size: 16, weight: 'bold' }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#667eea',
                borderWidth: 1
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#94a3b8' },
                grid: { color: '#334155' }
            },
            x: {
                ticks: { 
                    color: '#94a3b8',
                    maxRotation: 45,
                    minRotation: 45
                },
                grid: { color: '#334155' }
            }
        }
    };
}

// Format date - clearer display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${month} ${day} (${weekday})`;
}

// Show tooltip
function showTooltip(event, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.left = event.pageX + 10 + 'px';
    tooltip.style.top = event.pageY + 10 + 'px';
    document.body.appendChild(tooltip);
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) tooltip.remove();
}

// Update last update time
function updateLastUpdateTime() {
    const now = new Date();
    document.getElementById('lastUpdate').textContent = now.toLocaleString();
}

// Attach event listeners
function attachEventListeners() {
    // Data filter change
    document.getElementById('dataFilter').addEventListener('change', () => {
        filterData();
        updateAllVisualizations();
    });
    
    // Refresh data
    document.getElementById('refreshData').addEventListener('click', () => {
        updateAllVisualizations();
        alert('Data refreshed!');
    });
    
    // Export data
    document.getElementById('exportData').addEventListener('click', () => {
        const dataStr = JSON.stringify(dataStore.entries, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `data_export_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    });
    
    // Upload data
    document.getElementById('uploadData').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    
    document.getElementById('fileInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    dataStore.entries = data;
                    filterData();
                    updateAllVisualizations();
                    alert('Data imported successfully!');
                } catch (error) {
                    alert('Error importing data: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    });
    
    // Add entry with BACB categories
    document.getElementById('addEntry').addEventListener('click', () => {
        const date = document.getElementById('entryDate').value;
        const unrestricted = parseFloat(document.getElementById('entryUnrestricted').value) || 0;
        const restricted = parseFloat(document.getElementById('entryRestricted').value) || 0;
        const supervision = parseFloat(document.getElementById('entrySupervision').value) || 0;
        const unrestrictedDesc = document.getElementById('entryUnrestrictedDesc').value;
        const restrictedDesc = document.getElementById('entryRestrictedDesc').value;
        const time = document.getElementById('entryTime').value;
        
        if (!date) {
            alert('Please fill in the date!');
            return;
        }
        
        const totalHours = unrestricted + restricted + supervision;
        
        if (totalHours === 0) {
            alert('Please enter at least some hours!');
            return;
        }
        
        dataStore.entries.push({
            date: date,
            hours: totalHours,
            unrestricted: unrestricted,
            restricted: restricted,
            supervision: supervision,
            category: supervision > 0 ? 'Supervised' : (restricted > 0 ? 'Restricted' : 'Unrestricted'),
            notes: `${unrestrictedDesc} | ${restrictedDesc}`.replace(' | ', ''),
            time: time,
            unrestrictedDesc: unrestrictedDesc,
            restrictedDesc: restrictedDesc
        });
        
        sortDataByDate();
        filterData();
        updateAllVisualizations();
        
        // Clear form
        document.getElementById('entryDate').value = '';
        document.getElementById('entryUnrestricted').value = '';
        document.getElementById('entryRestricted').value = '';
        document.getElementById('entrySupervision').value = '';
        document.getElementById('entryUnrestrictedDesc').value = '';
        document.getElementById('entryRestrictedDesc').value = '';
        document.getElementById('entryTime').value = '';
        
        alert('Entry added successfully!');
    });
    
    // Toggle chart visibility
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const chartId = e.target.dataset.chart;
            const canvas = document.getElementById(chartId);
            const container = canvas ? canvas.parentElement : document.getElementById(chartId);
            
            if (container) {
                if (container.style.display === 'none') {
                    container.style.display = 'block';
                    e.target.textContent = '−';
                } else {
                    container.style.display = 'none';
                    e.target.textContent = '+';
                }
            }
        });
    });
    
    // Table search
    document.getElementById('tableSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#dataTable tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
    
    // Set today's date as default
    document.getElementById('entryDate').valueAsDate = new Date();
}
