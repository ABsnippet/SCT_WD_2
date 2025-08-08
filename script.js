// Stopwatch functionality
document.addEventListener('DOMContentLoaded', function() {
    // State variables
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval = null;
    let isRunning = false;
    let lapTimes = [];
    let lapCounter = 0;
    
    // DOM elements
    const timeDisplay = document.getElementById('timeDisplay');
    const startStopBtn = document.getElementById('startStopBtn');
    const lapBtn = document.getElementById('lapBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapHeader = document.getElementById('lapHeader');
    const lapList = document.getElementById('lapTimes');
    
    // Format time function
    function formatTime(milliseconds) {
        const totalMs = Math.max(0, Math.floor(milliseconds));
        const minutes = Math.floor(totalMs / 60000);
        const seconds = Math.floor((totalMs % 60000) / 1000);
        const centiseconds = Math.floor((totalMs % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
    }
    
    // Update display function
    function updateDisplay() {
        if (isRunning) {
            elapsedTime = Date.now() - startTime;
        }
        timeDisplay.textContent = formatTime(elapsedTime);
    }
    
    // Update button states
    function updateButtonStates() {
        if (isRunning) {
            startStopBtn.textContent = 'Stop';
            startStopBtn.classList.add('stop');
            lapBtn.disabled = false;
        } else {
            startStopBtn.textContent = 'Start';
            startStopBtn.classList.remove('stop');
            lapBtn.disabled = true;
        }
    }
    
    // Start timer function
    function startTimer() {
        if (!isRunning) {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(updateDisplay, 10);
            isRunning = true;
            updateButtonStates();
        }
    }
    
    // Stop timer function
    function stopTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            updateButtonStates();
        }
    }
    
    // Reset function
    function resetTimer() {
        stopTimer();
        elapsedTime = 0;
        lapTimes = [];
        lapCounter = 0;
        updateDisplay();
        updateButtonStates();
        updateLapDisplay();
    }
    
    // Handle lap recording
    function recordLap() {
        if (isRunning) {
            lapCounter++;
            const currentTime = elapsedTime;
            const lapTime = lapTimes.length > 0 ? 
                currentTime - lapTimes[lapTimes.length - 1].totalTime : 
                currentTime;
            
            lapTimes.push({
                lapNumber: lapCounter,
                lapTime: lapTime,
                totalTime: currentTime
            });
            
            updateLapDisplay();
        }
    }
    
    // Update lap display
    function updateLapDisplay() {
        if (lapTimes.length > 0) {
            lapHeader.classList.remove('hidden');
            lapList.innerHTML = '';
            
            // Display laps in reverse order (most recent first)
            for (let i = lapTimes.length - 1; i >= 0; i--) {
                const lap = lapTimes[i];
                const lapElement = document.createElement('div');
                lapElement.className = 'lap-item';
                
                lapElement.innerHTML = `
                    <span class="lap-number">Lap ${lap.lapNumber}</span>
                    <span class="lap-time">${formatTime(lap.lapTime)}</span>
                    <span class="lap-total">${formatTime(lap.totalTime)}</span>
                `;
                
                lapList.appendChild(lapElement);
            }
        } else {
            lapHeader.classList.add('hidden');
            lapList.innerHTML = '';
        }
    }
    
    // Add visual feedback for button presses
    function addButtonFeedback() {
        [startStopBtn, lapBtn, resetBtn].forEach(btn => {
            btn.addEventListener('mousedown', () => {
                if (!btn.disabled) {
                    btn.classList.add('btn--pressed');
                }
            });
            
            btn.addEventListener('mouseup', () => {
                btn.classList.remove('btn--pressed');
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.classList.remove('btn--pressed');
            });
        });
    }
    
    // Event listeners
    startStopBtn.addEventListener('click', function() {
        if (isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    });
    
    lapBtn.addEventListener('click', recordLap);
    resetBtn.addEventListener('click', resetTimer);
    
    // Initialize
    addButtonFeedback();
    updateDisplay();
    updateButtonStates();
});
