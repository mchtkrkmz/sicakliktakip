// Data Storage (Local cache)
let measurements = [];
let isCloudReady = false;

// Check if JSONBin.io is configured
function checkCloudConfig() {
    if (typeof isJSONBinConfigured === 'function' && isJSONBinConfigured()) {
        isCloudReady = true;
        console.log('✅ JSONBin.io bağlantısı aktif');
        return true;
    }
    console.warn('⚠️ JSONBin.io yapılandırılmamış, yerel depolama kullanılıyor');
    return false;
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    checkCloudConfig();

    if (isCloudReady) {
        loadMeasurementsFromCloud();
    } else {
        loadMeasurementsFromLocal();
        updateStats();
        updateHistoryDisplay();
    }

    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

// Elements
const form = document.getElementById('measurementForm');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const clearBtn = document.getElementById('clearBtn');
const fileInput = document.getElementById('fileInput');
const historyList = document.getElementById('historyList');
const toast = document.getElementById('toast');

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const temperature = parseFloat(document.getElementById('temperature').value);
    const humidity = parseFloat(document.getElementById('humidity').value);
    const location = document.getElementById('location').value.trim();
    const notes = document.getElementById('notes').value.trim();

    const measurement = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        temperature: temperature,
        humidity: humidity,
        location: location || null,
        notes: notes || null
    };

    // Add to local array first for immediate UI update
    measurements.unshift(measurement);
    updateStats();
    updateHistoryDisplay();

    if (isCloudReady) {
        await saveMeasurementsToCloud();
    } else {
        saveMeasurementsToLocal();
    }

    // Reset form
    form.reset();

    // Show success toast
    showToast('✓', 'Ölçüm başarıyla kaydedildi!');
});

// JSONBin.io: Save all measurements to cloud
async function saveMeasurementsToCloud() {
    try {
        const response = await fetch(`${JSONBIN_CONFIG.apiUrl}/${JSONBIN_CONFIG.binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_CONFIG.apiKey,
                'X-Bin-Versioning': 'false' // Don't create versions
            },
            body: JSON.stringify(measurements)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📤 JSONBin.io\'ya kaydedildi:', data);

    } catch (error) {
        console.error('❌ JSONBin.io kayıt hatası:', error);
        showToast('❌', 'Buluta kaydetme hatası! Yerel olarak saklandı.');
        // Fallback to local storage
        saveMeasurementsToLocal();
    }
}

// JSONBin.io: Load all measurements from cloud
async function loadMeasurementsFromCloud() {
    try {
        const response = await fetch(`${JSONBIN_CONFIG.apiUrl}/${JSONBIN_CONFIG.binId}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        measurements = Array.isArray(data.record) ? data.record : [];

        updateStats();
        updateHistoryDisplay();
        console.log(`📥 ${measurements.length} ölçüm JSONBin.io'dan yüklendi`);

        // Also save to local storage as cache
        saveMeasurementsToLocal();

    } catch (error) {
        console.error('❌ JSONBin.io okuma hatası:', error);
        showToast('❌', 'Buluttan veri çekme hatası! Yerel veriler kullanılıyor.');
        // Fallback to local storage
        loadMeasurementsFromLocal();
        updateStats();
        updateHistoryDisplay();
    }
}

// JSONBin.io: Delete measurement
async function deleteMeasurementFromCloud(id) {
    measurements = measurements.filter(m => m.id !== id);
    updateStats();
    updateHistoryDisplay();

    if (isCloudReady) {
        await saveMeasurementsToCloud();
    } else {
        saveMeasurementsToLocal();
    }

    showToast('🗑️', 'Ölçüm silindi!');
}

// JSONBin.io: Clear all measurements
async function clearAllMeasurementsFromCloud() {
    measurements = [];
    updateStats();
    updateHistoryDisplay();

    if (isCloudReady) {
        await saveMeasurementsToCloud();
    } else {
        saveMeasurementsToLocal();
    }

    showToast('🗑️', 'Tüm veriler silindi!');
}

// Export to JSON
exportBtn.addEventListener('click', () => {
    if (measurements.length === 0) {
        showToast('⚠️', 'Dışa aktarılacak veri yok!');
        return;
    }

    const dataStr = JSON.stringify(measurements, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.download = `sicaklik-nem-verileri-${timestamp}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('📤', 'JSON dosyası indirildi!');
});

// Import JSON
importBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const importedData = JSON.parse(event.target.result);

            // Validate data structure
            if (!Array.isArray(importedData)) {
                throw new Error('Geçersiz veri formatı');
            }

            // Merge with existing data (avoid duplicates by ID)
            const existingIds = new Set(measurements.map(m => m.id));
            const newMeasurements = importedData.filter(m => !existingIds.has(m.id));

            measurements = [...measurements, ...newMeasurements];
            measurements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            if (isCloudReady) {
                await saveMeasurementsToCloud();
            } else {
                saveMeasurementsToLocal();
            }

            updateStats();
            updateHistoryDisplay();

            showToast('✓', `${newMeasurements.length} yeni ölçüm yüklendi!`);
        } catch (error) {
            showToast('❌', 'JSON dosyası okunamadı!');
            console.error('Import error:', error);
        }
    };

    reader.readAsText(file);
    fileInput.value = ''; // Reset file input
});

// Clear all data
clearBtn.addEventListener('click', async () => {
    if (measurements.length === 0) {
        showToast('⚠️', 'Silinecek veri yok!');
        return;
    }

    if (confirm('Tüm ölçüm verilerini silmek istediğinizden emin misiniz?')) {
        await clearAllMeasurementsFromCloud();
    }
});

// Delete single measurement
async function deleteMeasurement(id) {
    await deleteMeasurementFromCloud(id);
}

// Local Storage: Load measurements
function loadMeasurementsFromLocal() {
    const stored = localStorage.getItem('temperatureHumidityData');
    if (stored) {
        try {
            measurements = JSON.parse(stored);
        } catch (error) {
            console.error('Error loading data:', error);
            measurements = [];
        }
    }
}

// Local Storage: Save measurements
function saveMeasurementsToLocal() {
    localStorage.setItem('temperatureHumidityData', JSON.stringify(measurements));
}

// Update statistics
function updateStats() {
    const avgTempEl = document.getElementById('avgTemp');
    const avgHumidityEl = document.getElementById('avgHumidity');
    const totalMeasurementsEl = document.getElementById('totalMeasurements');
    const historyCount = document.getElementById('historyCount');

    totalMeasurementsEl.textContent = measurements.length;
    historyCount.textContent = measurements.length;

    if (measurements.length === 0) {
        avgTempEl.textContent = '--';
        avgHumidityEl.textContent = '--';
        return;
    }

    const avgTemp = measurements.reduce((sum, m) => sum + m.temperature, 0) / measurements.length;
    const avgHumidity = measurements.reduce((sum, m) => sum + m.humidity, 0) / measurements.length;

    avgTempEl.textContent = `${avgTemp.toFixed(1)}°C`;
    avgHumidityEl.textContent = `${avgHumidity.toFixed(1)}%`;
}

// Update history display
function updateHistoryDisplay() {
    if (measurements.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <p>Henüz ölçüm kaydı yok</p>
                <span>Yukarıdaki formdan yeni bir ölçüm ekleyin</span>
            </div>
        `;
        return;
    }

    historyList.innerHTML = measurements.map(m => createHistoryItemHTML(m)).join('');

    // Add delete event listeners
    const deleteButtons = historyList.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            deleteMeasurement(id);
        });
    });
}

// Create history item HTML
function createHistoryItemHTML(measurement) {
    const date = new Date(measurement.timestamp);
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(date);

    return `
        <div class="history-item">
            <div class="history-item-icon">📊</div>
            <div class="history-item-content">
                <div class="history-item-values">
                    <div class="history-value temp">
                        <span>🌡️</span>
                        <strong>${measurement.temperature.toFixed(1)}°C</strong>
                    </div>
                    <div class="history-value humidity">
                        <span>💧</span>
                        <strong>${measurement.humidity.toFixed(1)}%</strong>
                    </div>
                </div>
                <div class="history-item-meta">
                    ${formattedDate} • ${formattedTime}
                </div>
                ${measurement.location ? `<div class="history-item-location">📍 ${measurement.location}</div>` : ''}
                ${measurement.notes ? `<div class="history-item-notes">"${measurement.notes}"</div>` : ''}
            </div>
            <div class="history-item-actions">
                <button class="delete-btn" data-id="${measurement.id}" title="Sil">🗑️</button>
            </div>
        </div>
    `;
}

// Format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('tr-TR', options);
}

// Format time
function formatTime(date) {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

// Update current time display
function updateCurrentTime() {
    const currentTimeEl = document.getElementById('currentTime');
    const now = new Date();
    const formattedDate = formatDate(now);
    const formattedTime = formatTime(now);
    currentTimeEl.textContent = `${formattedDate} • ${formattedTime}`;
}

// Show toast notification
function showToast(icon, message) {
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

    toastIcon.textContent = icon;
    toastMessage.textContent = message;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Manual sync function - can be called to force sync with cloud
async function syncWithCloud() {
    if (!isCloudReady) {
        showToast('⚠️', 'Bulut depolama yapılandırılmamış!');
        return;
    }

    showToast('🔄', 'Senkronize ediliyor...');
    await loadMeasurementsFromCloud();
}
