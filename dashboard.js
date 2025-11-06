// Initialize Supabase
const SUPABASE_URL = 'https://pydjyurvukyhfyojrhpu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZGp5dXJ2dWt5aGZ5b2pyaHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDY3MjgsImV4cCI6MjA2OTQ4MjcyOH0.apfIlOx8hptjKDyMti5TT0hc1wpCnUrnRhHM5zAUkpU';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let currentUser = null;
let currentMonth = '2025-10'; // October 2025
let entries = [];
let mainChart = null;
let extractedData = []; // Store extracted data from document

// Signature variables
let signatureCanvas = null;
let signatureCtx = null;
let isDrawing = false;
let signatureStrokes = [];
let currentStroke = [];

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    await checkAuth();
    initializeSignaturePad();
    await loadMonthData();
});

// Check authentication
async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = user;
    document.getElementById('welcomeText').textContent = 
        `Welcome back, ${user.user_metadata.full_name || user.email}!`;
}

// Logout
async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
}

// Load month data from Supabase
async function loadMonthData() {
    const [year, month] = currentMonth.split('-');
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;
    
    try {
        const { data, error } = await supabase
            .from('fieldwork_hours')
            .select('*')
            .eq('user_id', currentUser.id)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: true });
        
        if (error) throw error;
        
        entries = data || [];
        updateDashboard();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data: ' + error.message);
    }
}

// Update dashboard
function updateDashboard() {
    updateStatistics();
    updateChart();
    updateCalendar();
    updateTitles();
}

// Update titles
function updateTitles() {
    const date = new Date(currentMonth + '-01');
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    document.getElementById('currentMonthTitle').textContent = monthName;
    document.getElementById('monthYearLabel').textContent = monthName.toUpperCase() + ' TOTAL';
    document.getElementById('chartTitle').textContent = `📊 ${monthName} - Daily Hours Breakdown`;
    document.getElementById('calendarTitle').textContent = `📆 ${monthName} Calendar - Click Any Day for Details`;
}

// Update statistics
function updateStatistics() {
    let totalUnrestricted = 0;
    let totalRestricted = 0;
    let totalSupervision = 0;
    let totalHours = 0;
    
    entries.forEach(entry => {
        totalUnrestricted += entry.unrestricted || 0;
        totalRestricted += entry.restricted || 0;
        totalSupervision += entry.supervision || 0;
        totalHours += (entry.unrestricted || 0) + (entry.restricted || 0) + (entry.supervision || 0);
    });
    
    document.getElementById('totalHours').textContent = totalHours.toFixed(1);
    document.getElementById('unrestrictedHours').textContent = totalUnrestricted.toFixed(1);
    document.getElementById('restrictedHours').textContent = totalRestricted.toFixed(1);
    document.getElementById('supervisionHours').textContent = totalSupervision.toFixed(1);
    document.getElementById('workingDays').textContent = entries.length;
    
    // Percentages
    if (totalHours > 0) {
        document.getElementById('unrestrictedPercent').textContent = 
            ((totalUnrestricted/totalHours)*100).toFixed(1) + '%';
        document.getElementById('restrictedPercent').textContent = 
            ((totalRestricted/totalHours)*100).toFixed(1) + '%';
        
        const supervisionPercent = (totalSupervision/totalHours)*100;
        const meetsRequirement = supervisionPercent >= 5;
        
        document.getElementById('supervisionPercent').textContent = 
            supervisionPercent.toFixed(1) + '% Supervision';
        document.getElementById('supervisionPercent').className = 
            meetsRequirement ? 'stat-change positive' : 'stat-change negative';
        
        document.getElementById('supervisionStatus').textContent = 
            meetsRequirement ? '✓ Meets BACB 5%' : '✗ Below 5%';
        document.getElementById('supervisionStatus').className = 
            meetsRequirement ? 'stat-change positive' : 'stat-change negative';
    }
}

// Update chart
function updateChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    if (mainChart) {
        mainChart.destroy();
    }
    
    mainChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: entries.map(e => {
                const date = new Date(e.date);
                return `${date.getMonth()+1}/${date.getDate()}`;
            }),
            datasets: [
                {
                    label: 'Unrestricted Hours',
                    data: entries.map(e => e.unrestricted || 0),
                    backgroundColor: 'rgba(74, 222, 128, 0.9)',
                    borderColor: '#4ade80',
                    borderWidth: 1
                },
                {
                    label: 'Restricted Hours',
                    data: entries.map(e => e.restricted || 0),
                    backgroundColor: 'rgba(251, 191, 36, 0.9)',
                    borderColor: '#fbbf24',
                    borderWidth: 1
                },
                {
                    label: 'Supervision Hours',
                    data: entries.map(e => e.supervision || 0),
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
                    showDayDetails(entries[index]);
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

// Update calendar
function updateCalendar() {
    const container = document.getElementById('calendarView');
    container.innerHTML = '';
    
    const [year, month] = currentMonth.split('-');
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    // Create a map of dates to data
    const dateMap = new Map();
    entries.forEach(entry => {
        dateMap.set(entry.date, entry);
    });
    
    // Month header
    const header = document.createElement('div');
    header.style.gridColumn = '1 / -1';
    header.style.textAlign = 'center';
    header.style.fontSize = '1.8em';
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '25px';
    header.style.padding = '15px';
    header.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    header.style.borderRadius = '10px';
    header.textContent = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    container.appendChild(header);
    
    // Day headers
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
    
    // Empty cells before first day
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.style.minHeight = '120px';
        container.appendChild(emptyCell);
    }
    
    // Calendar days
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`;
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day;
        dayDiv.appendChild(dayNumber);
        
        if (dateMap.has(dateStr)) {
            dayDiv.classList.add('has-data');
            const entry = dateMap.get(dateStr);
            const totalHours = (entry.unrestricted || 0) + (entry.restricted || 0) + (entry.supervision || 0);
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'calendar-day-info';
            
            const totalBadge = document.createElement('div');
            totalBadge.className = 'calendar-hours-badge';
            totalBadge.textContent = `${totalHours.toFixed(1)} hrs`;
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

// Show day details
function showDayDetails(entry) {
    const modal = document.getElementById('dayDetailsModal');
    const date = new Date(entry.date);
    const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const totalHours = (entry.unrestricted || 0) + (entry.restricted || 0) + (entry.supervision || 0);
    
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 1000;">
            <div style="background: var(--card-bg); padding: 40px; border-radius: 20px; max-width: 1000px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative;">
                <button onclick="closeDayDetails()" style="position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%; background: #f87171; color: white; border: none; font-size: 24px; cursor: pointer;">✕</button>
                
                <h2 style="color: var(--primary-color); margin-bottom: 20px; font-size: 2em;">📅 ${dateStr}</h2>
                
                <div style="margin: 25px 0; padding: 20px; background: var(--bg-color); border-radius: 12px; border-left: 4px solid var(--primary-color);">
                    <h3 style="color: var(--accent-color); margin-bottom: 15px;">⏰ Time</h3>
                    <p style="font-size: 1.3em;">${entry.time || 'Not specified'}</p>
                </div>
                
                <div style="margin: 25px 0; padding: 20px; background: var(--bg-color); border-radius: 12px; border-left: 4px solid var(--primary-color);">
                    <h3 style="color: var(--accent-color); margin-bottom: 15px;">📊 Hours Breakdown</h3>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                        <div style="background: var(--card-bg); padding: 20px; border-radius: 10px; text-align: center; border: 2px solid #4ade80;">
                            <div style="color: var(--text-secondary); font-size: 0.9em; margin-bottom: 10px;">UNRESTRICTED</div>
                            <div style="font-size: 2.5em; font-weight: bold; color: #4ade80;">${entry.unrestricted}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9em; margin-top: 10px;">HOURS</div>
                        </div>
                        <div style="background: var(--card-bg); padding: 20px; border-radius: 10px; text-align: center; border: 2px solid #fbbf24;">
                            <div style="color: var(--text-secondary); font-size: 0.9em; margin-bottom: 10px;">RESTRICTED</div>
                            <div style="font-size: 2.5em; font-weight: bold; color: #fbbf24;">${entry.restricted}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9em; margin-top: 10px;">HOURS</div>
                        </div>
                        <div style="background: var(--card-bg); padding: 20px; border-radius: 10px; text-align: center; border: 2px solid #667eea;">
                            <div style="color: var(--text-secondary); font-size: 0.9em; margin-bottom: 10px;">SUPERVISION</div>
                            <div style="font-size: 2.5em; font-weight: bold; color: #667eea;">${entry.supervision}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9em; margin-top: 10px;">HOURS</div>
                        </div>
                        <div style="background: var(--card-bg); padding: 20px; border-radius: 10px; text-align: center; border: 2px solid var(--accent-color);">
                            <div style="color: var(--text-secondary); font-size: 0.9em; margin-bottom: 10px;">TOTAL</div>
                            <div style="font-size: 2.5em; font-weight: bold; color: var(--accent-color);">${totalHours.toFixed(1)}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9em; margin-top: 10px;">HOURS</div>
                        </div>
                    </div>
                </div>
                
                ${entry.unrestricted_desc ? `
                <div style="margin: 25px 0; padding: 20px; background: var(--bg-color); border-radius: 12px; border-left: 4px solid var(--primary-color);">
                    <h3 style="color: var(--accent-color); margin-bottom: 15px;">🟢 Unrestricted Activities</h3>
                    <div style="background: var(--bg-color); padding: 15px; border-radius: 8px; border-left: 3px solid var(--primary-color);">
                        ${entry.unrestricted_desc}
                    </div>
                </div>
                ` : ''}
                
                ${entry.restricted_desc ? `
                <div style="margin: 25px 0; padding: 20px; background: var(--bg-color); border-radius: 12px; border-left: 4px solid var(--primary-color);">
                    <h3 style="color: var(--accent-color); margin-bottom: 15px;">🟡 Restricted Activities</h3>
                    <div style="background: var(--bg-color); padding: 15px; border-radius: 8px; border-left: 3px solid var(--primary-color);">
                        ${entry.restricted_desc}
                    </div>
                </div>
                ` : ''}
                
                ${entry.supervisor_name ? `
                <div style="margin: 25px 0; padding: 20px; background: var(--bg-color); border-radius: 12px; border-left: 4px solid var(--primary-color);">
                    <h3 style="color: var(--accent-color); margin-bottom: 15px;">👨‍🏫 Supervisor</h3>
                    <div style="background: var(--bg-color); padding: 15px; border-radius: 8px; border-left: 3px solid var(--primary-color); font-size: 1.2em;">
                        ${entry.supervisor_name}
                    </div>
                </div>
                ` : ''}
                
                ${entry.signature ? `
                <div style="margin: 25px 0; padding: 20px; background: var(--bg-color); border-radius: 12px; border-left: 4px solid var(--primary-color);">
                    <h3 style="color: var(--accent-color); margin-bottom: 15px;">✍️ Digital Signature</h3>
                    <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid var(--border-color); text-align: center;">
                        <img src="${entry.signature}" style="max-width: 100%; height: auto; max-height: 200px;" alt="Signature">
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeDayDetails() {
    document.getElementById('dayDetailsModal').style.display = 'none';
}

// Month navigation
function changeMonth(direction) {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 1 + direction, 1);
    currentMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('monthSelect').value = currentMonth;
    loadMonthData();
}

// Show month selector modal
function showMonthSelector() {
    const months = [];
    for (let year = 2024; year <= 2026; year++) {
        for (let month = 1; month <= 12; month++) {
            const value = `${year}-${String(month).padStart(2, '0')}`;
            const date = new Date(year, month - 1, 1);
            const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            months.push({ value, label });
        }
    }
    
    const select = document.getElementById('monthSelect');
    select.innerHTML = months.map(m => 
        `<option value="${m.value}" ${m.value === currentMonth ? 'selected' : ''}>${m.label}</option>`
    ).join('');
}

// Show add entry modal
function showAddEntryModal() {
    document.getElementById('entryModal').style.display = 'flex';
    // Set default date to today
    document.getElementById('entryDate').valueAsDate = new Date();
    // Reset signature
    clearSignature();
}

function closeEntryModal() {
    document.getElementById('entryModal').style.display = 'none';
    // Clear form
    document.getElementById('entryDate').value = '';
    document.getElementById('entryTime').value = '';
    document.getElementById('entryUnrestricted').value = '';
    document.getElementById('entryRestricted').value = '';
    document.getElementById('entrySupervision').value = '';
    document.getElementById('entrySupervisorName').value = '';
    document.getElementById('entryUnrestrictedDesc').value = '';
    document.getElementById('entryRestrictedDesc').value = '';
    clearSignature();
}

// Initialize Signature Pad
function initializeSignaturePad() {
    signatureCanvas = document.getElementById('signatureCanvas');
    if (!signatureCanvas) return;
    
    signatureCtx = signatureCanvas.getContext('2d');
    signatureCtx.strokeStyle = '#000';
    signatureCtx.lineWidth = 2;
    signatureCtx.lineCap = 'round';
    signatureCtx.lineJoin = 'round';
    
    // Mouse events
    signatureCanvas.addEventListener('mousedown', startDrawing);
    signatureCanvas.addEventListener('mousemove', draw);
    signatureCanvas.addEventListener('mouseup', stopDrawing);
    signatureCanvas.addEventListener('mouseleave', stopDrawing);
    
    // Touch events for digital pen/touch screens
    signatureCanvas.addEventListener('touchstart', handleTouchStart);
    signatureCanvas.addEventListener('touchmove', handleTouchMove);
    signatureCanvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = signatureCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    currentStroke = [{x, y}];
    signatureCtx.beginPath();
    signatureCtx.moveTo(x, y);
    
    // Hide placeholder
    document.getElementById('signaturePlaceholder').style.display = 'none';
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = signatureCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    currentStroke.push({x, y});
    signatureCtx.lineTo(x, y);
    signatureCtx.stroke();
}

function stopDrawing() {
    if (isDrawing && currentStroke.length > 0) {
        signatureStrokes.push([...currentStroke]);
        currentStroke = [];
    }
    isDrawing = false;
    
    // Update preview
    if (signatureStrokes.length > 0) {
        updateSignaturePreview();
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    signatureCanvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    signatureCanvas.dispatchEvent(mouseEvent);
}

function clearSignature() {
    if (!signatureCtx) return;
    
    signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    signatureStrokes = [];
    currentStroke = [];
    document.getElementById('signaturePlaceholder').style.display = 'block';
    document.getElementById('signaturePreview').style.display = 'none';
}

function undoSignature() {
    if (signatureStrokes.length === 0) return;
    
    signatureStrokes.pop();
    redrawSignature();
    
    if (signatureStrokes.length === 0) {
        document.getElementById('signaturePlaceholder').style.display = 'block';
        document.getElementById('signaturePreview').style.display = 'none';
    } else {
        updateSignaturePreview();
    }
}

function redrawSignature() {
    signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    
    signatureStrokes.forEach(stroke => {
        if (stroke.length === 0) return;
        
        signatureCtx.beginPath();
        signatureCtx.moveTo(stroke[0].x, stroke[0].y);
        
        stroke.forEach(point => {
            signatureCtx.lineTo(point.x, point.y);
        });
        
        signatureCtx.stroke();
    });
}

function updateSignaturePreview() {
    const preview = document.getElementById('signaturePreview');
    const previewImg = document.getElementById('signatureImage');
    
    previewImg.src = signatureCanvas.toDataURL('image/png');
    preview.style.display = 'block';
}

function getSignatureData() {
    if (signatureStrokes.length === 0) return null;
    return signatureCanvas.toDataURL('image/png');
}

// Save entry
async function saveEntry() {
    const date = document.getElementById('entryDate').value;
    const time = document.getElementById('entryTime').value;
    const unrestricted = parseFloat(document.getElementById('entryUnrestricted').value) || 0;
    const restricted = parseFloat(document.getElementById('entryRestricted').value) || 0;
    const supervision = parseFloat(document.getElementById('entrySupervision').value) || 0;
    const supervisorName = document.getElementById('entrySupervisorName').value.trim();
    const unrestrictedDesc = document.getElementById('entryUnrestrictedDesc').value;
    const restrictedDesc = document.getElementById('entryRestrictedDesc').value;
    const signatureData = getSignatureData();
    
    if (!date) {
        alert('Please enter a date!');
        return;
    }
    
    if (unrestricted === 0 && restricted === 0 && supervision === 0) {
        alert('Please enter at least some hours!');
        return;
    }
    
    // Validate BACB monthly limit
    const totalHours = unrestricted + restricted + supervision;
    if (totalHours > 130) {
        alert('⚠️ Warning: Total hours exceed BACB monthly maximum of 130 hours!\nPlease adjust your entry.');
        return;
    }
    
    try {
        const entryData = {
            user_id: currentUser.id,
            date: date,
            time: time,
            unrestricted: unrestricted,
            restricted: restricted,
            supervision: supervision,
            supervisor_name: supervisorName,
            unrestricted_desc: unrestrictedDesc,
            restricted_desc: restrictedDesc,
            signature: signatureData
        };
        
        const { data, error } = await supabase
            .from('fieldwork_hours')
            .insert([entryData]);
        
        if (error) {
            // Check for duplicate entry
            if (error.code === '23505') {
                throw new Error('An entry already exists for this date. Please edit the existing entry or choose a different date.');
            }
            throw error;
        }
        
        alert('✓ Entry saved successfully!');
        closeEntryModal();
        
        // Reload if entry is for current month
        const entryMonth = date.substring(0, 7);
        if (entryMonth === currentMonth) {
            await loadMonthData();
        }
    } catch (error) {
        console.error('Error saving entry:', error);
        alert('Error saving entry: ' + error.message);
    }
}

// ========================================
// DOCUMENT UPLOAD & IMPORT FUNCTIONALITY
// ========================================

function showUploadModal() {
    document.getElementById('uploadModal').style.display = 'flex';
    // Reset upload form
    document.getElementById('documentUpload').value = '';
    document.getElementById('uploadProgress').style.display = 'none';
    document.getElementById('uploadResult').style.display = 'none';
    document.getElementById('extractedPreview').style.display = 'none';
    document.getElementById('importBtn').style.display = 'none';
    extractedData = [];
}

function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
    extractedData = [];
}

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileName = file.name.toLowerCase();
    
    // Show progress
    document.getElementById('uploadProgress').style.display = 'block';
    document.getElementById('uploadResult').style.display = 'none';
    document.getElementById('extractedPreview').style.display = 'none';
    updateProgress(10);
    
    try {
        if (fileName.endsWith('.docx')) {
            await processWordDocument(file);
        } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
            await processExcelDocument(file);
        } else if (fileName.endsWith('.csv')) {
            await processCSVDocument(file);
        } else if (fileName.endsWith('.txt')) {
            await processTextDocument(file);
        } else {
            throw new Error('Unsupported file format');
        }
        
        updateProgress(100);
        showSuccess(`✓ Successfully extracted ${extractedData.length} entries from ${file.name}`);
        displayExtractedPreview();
        
    } catch (error) {
        console.error('Error processing file:', error);
        showError('Error processing file: ' + error.message);
        updateProgress(0);
    }
}

function updateProgress(percent) {
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('progressPercent').textContent = percent + '%';
}

function showSuccess(message) {
    const resultDiv = document.getElementById('uploadResult');
    resultDiv.innerHTML = `
        <div style="padding: 20px; background: rgba(74, 222, 128, 0.1); border: 2px solid #4ade80; border-radius: 10px; color: #4ade80;">
            <strong>${message}</strong>
        </div>
    `;
    resultDiv.style.display = 'block';
}

function showError(message) {
    const resultDiv = document.getElementById('uploadResult');
    resultDiv.innerHTML = `
        <div style="padding: 20px; background: rgba(248, 113, 113, 0.1); border: 2px solid #f87171; border-radius: 10px; color: #f87171;">
            <strong>${message}</strong>
        </div>
    `;
    resultDiv.style.display = 'block';
}

// Process Word Document (.docx)
async function processWordDocument(file) {
    updateProgress(30);
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;
    
    updateProgress(60);
    extractedData = parseTextContent(text);
    updateProgress(90);
}

// Process Excel Document (.xlsx, .xls)
async function processExcelDocument(file) {
    updateProgress(30);
    
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    
    updateProgress(60);
    extractedData = parseExcelData(jsonData);
    updateProgress(90);
}

// Process CSV Document
async function processCSVDocument(file) {
    updateProgress(30);
    
    const text = await file.text();
    const lines = text.split('\n');
    const data = lines.map(line => line.split(','));
    
    updateProgress(60);
    extractedData = parseExcelData(data);
    updateProgress(90);
}

// Process Text Document
async function processTextDocument(file) {
    updateProgress(30);
    
    const text = await file.text();
    
    updateProgress(60);
    extractedData = parseTextContent(text);
    updateProgress(90);
}

// Parse text content to extract fieldwork data
function parseTextContent(text) {
    const entries = [];
    const lines = text.split('\n');
    
    // Common patterns
    const datePatterns = [
        /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g,  // MM/DD/YYYY or DD/MM/YYYY
        /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/g,    // YYYY-MM-DD
        /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/gi
    ];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Try to find dates
        let dateMatch = null;
        for (const pattern of datePatterns) {
            const match = line.match(pattern);
            if (match) {
                dateMatch = match[0];
                break;
            }
        }
        
        if (dateMatch) {
            // Parse the date
            const date = parseDate(dateMatch);
            if (!date) continue;
            
            // Look for hours in the same line or nearby lines
            const context = lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 5)).join(' ');
            
            const unrestricted = extractHours(context, ['unrestricted', 'direct', 'client contact']);
            const restricted = extractHours(context, ['restricted', 'indirect', 'planning']);
            const supervision = extractHours(context, ['supervision', 'supervised', 'supervisor']);
            
            if (unrestricted > 0 || restricted > 0 || supervision > 0) {
                entries.push({
                    date: date,
                    unrestricted: unrestricted,
                    restricted: restricted,
                    supervision: supervision,
                    time: extractTime(context),
                    unrestricted_desc: extractDescription(context, 'unrestricted'),
                    restricted_desc: extractDescription(context, 'restricted')
                });
            }
        }
    }
    
    return entries;
}

// Parse Excel/CSV data
function parseExcelData(data) {
    const entries = [];
    
    if (data.length < 2) return entries;
    
    // Find column indices
    const headers = data[0].map(h => String(h).toLowerCase());
    const dateCol = headers.findIndex(h => h.includes('date'));
    const unrestrictedCol = headers.findIndex(h => h.includes('unrestricted') || h.includes('direct'));
    const restrictedCol = headers.findIndex(h => h.includes('restricted') || h.includes('indirect'));
    const supervisionCol = headers.findIndex(h => h.includes('supervision') || h.includes('supervised'));
    const timeCol = headers.findIndex(h => h.includes('time') || h.includes('hours'));
    
    // Process rows
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        
        const dateStr = dateCol >= 0 ? row[dateCol] : row[0];
        const date = parseDate(dateStr);
        
        if (date) {
            const unrestricted = unrestrictedCol >= 0 ? parseFloat(row[unrestrictedCol]) || 0 : 0;
            const restricted = restrictedCol >= 0 ? parseFloat(row[restrictedCol]) || 0 : 0;
            const supervision = supervisionCol >= 0 ? parseFloat(row[supervisionCol]) || 0 : 0;
            
            if (unrestricted > 0 || restricted > 0 || supervision > 0) {
                entries.push({
                    date: date,
                    unrestricted: unrestricted,
                    restricted: restricted,
                    supervision: supervision,
                    time: timeCol >= 0 ? row[timeCol] : '',
                    unrestricted_desc: '',
                    restricted_desc: ''
                });
            }
        }
    }
    
    return entries;
}

// Helper function to parse dates
function parseDate(dateStr) {
    if (!dateStr) return null;
    
    // Try standard formats
    let date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
    }
    
    // Try MM/DD/YYYY
    const match1 = String(dateStr).match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (match1) {
        let month = parseInt(match1[1]);
        let day = parseInt(match1[2]);
        let year = parseInt(match1[3]);
        
        if (year < 100) year += 2000;
        
        // Try MM/DD/YYYY first
        if (month <= 12) {
            date = new Date(year, month - 1, day);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }
        
        // Try DD/MM/YYYY
        if (day <= 12) {
            date = new Date(year, day - 1, month);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }
    }
    
    return null;
}

// Helper function to extract hours
function extractHours(text, keywords) {
    for (const keyword of keywords) {
        const pattern = new RegExp(keyword + '\\D+(\\d+(?:\\.\\d+)?)', 'i');
        const match = text.match(pattern);
        if (match) {
            return parseFloat(match[1]);
        }
    }
    return 0;
}

// Helper function to extract time
function extractTime(text) {
    const timePattern = /(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s*[-–to]+\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/i;
    const match = text.match(timePattern);
    return match ? match[0] : '';
}

// Helper function to extract description
function extractDescription(text, type) {
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
        if (sentence.toLowerCase().includes(type)) {
            return sentence.trim();
        }
    }
    return '';
}

// Display extracted data preview
function displayExtractedPreview() {
    if (extractedData.length === 0) return;
    
    const previewDiv = document.getElementById('previewContent');
    const totalHours = extractedData.reduce((sum, e) => sum + e.unrestricted + e.restricted + e.supervision, 0);
    const totalUnrestricted = extractedData.reduce((sum, e) => sum + e.unrestricted, 0);
    const totalRestricted = extractedData.reduce((sum, e) => sum + e.restricted, 0);
    const totalSupervision = extractedData.reduce((sum, e) => sum + e.supervision, 0);
    
    previewDiv.innerHTML = `
        <div style="margin-bottom: 20px; padding: 15px; background: var(--card-bg); border-radius: 8px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; text-align: center;">
                <div>
                    <div style="color: var(--text-secondary); font-size: 0.85em;">Total Entries</div>
                    <div style="font-size: 1.8em; font-weight: bold; color: var(--primary-color);">${extractedData.length}</div>
                </div>
                <div>
                    <div style="color: var(--text-secondary); font-size: 0.85em;">Total Hours</div>
                    <div style="font-size: 1.8em; font-weight: bold; color: var(--accent-color);">${totalHours.toFixed(1)}</div>
                </div>
                <div>
                    <div style="color: var(--text-secondary); font-size: 0.85em;">Unrestricted</div>
                    <div style="font-size: 1.8em; font-weight: bold; color: #4ade80;">${totalUnrestricted.toFixed(1)}</div>
                </div>
                <div>
                    <div style="color: var(--text-secondary); font-size: 0.85em;">Restricted</div>
                    <div style="font-size: 1.8em; font-weight: bold; color: #fbbf24;">${totalRestricted.toFixed(1)}</div>
                </div>
                <div>
                    <div style="color: var(--text-secondary); font-size: 0.85em;">Supervision</div>
                    <div style="font-size: 1.8em; font-weight: bold; color: #667eea;">${totalSupervision.toFixed(1)}</div>
                </div>
            </div>
        </div>
        
        <div style="max-height: 200px; overflow-y: auto;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: var(--card-bg); position: sticky; top: 0;">
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid var(--border-color);">Date</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 2px solid var(--border-color);">Unrestricted</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 2px solid var(--border-color);">Restricted</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 2px solid var(--border-color);">Supervision</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 2px solid var(--border-color);">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${extractedData.map(entry => {
                        const total = entry.unrestricted + entry.restricted + entry.supervision;
                        return `
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 8px;">${new Date(entry.date).toLocaleDateString()}</td>
                                <td style="padding: 8px; text-align: center; color: #4ade80;">${entry.unrestricted}</td>
                                <td style="padding: 8px; text-align: center; color: #fbbf24;">${entry.restricted}</td>
                                <td style="padding: 8px; text-align: center; color: #667eea;">${entry.supervision}</td>
                                <td style="padding: 8px; text-align: center; font-weight: bold;">${total.toFixed(1)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('extractedPreview').style.display = 'block';
    document.getElementById('importBtn').style.display = 'block';
}

// Import extracted data to Supabase
async function importExtractedData() {
    if (extractedData.length === 0) {
        alert('No data to import');
        return;
    }
    
    const btn = document.getElementById('importBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="loading"></span> Importing...';
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const entry of extractedData) {
        try {
            const entryData = {
                user_id: currentUser.id,
                date: entry.date,
                time: entry.time || '',
                unrestricted: entry.unrestricted || 0,
                restricted: entry.restricted || 0,
                supervision: entry.supervision || 0,
                unrestricted_desc: entry.unrestricted_desc || '',
                restricted_desc: entry.restricted_desc || ''
            };
            
            const { data, error } = await supabase
                .from('fieldwork_hours')
                .insert([entryData]);
            
            if (error) {
                if (error.code === '23505') {
                    // Duplicate entry, skip
                    skipCount++;
                } else {
                    console.error('Error importing entry:', error);
                    errorCount++;
                }
            } else {
                successCount++;
            }
        } catch (error) {
            console.error('Error importing entry:', error);
            errorCount++;
        }
    }
    
    btn.disabled = false;
    btn.innerHTML = '✓ Import All Entries';
    
    // Show results
    let message = `Import completed!\n\n`;
    message += `✓ Successfully imported: ${successCount} entries\n`;
    if (skipCount > 0) message += `⊘ Skipped (already exist): ${skipCount} entries\n`;
    if (errorCount > 0) message += `✗ Failed: ${errorCount} entries\n`;
    
    alert(message);
    
    // Reload data and close modal
    await loadMonthData();
    closeUploadModal();
}
