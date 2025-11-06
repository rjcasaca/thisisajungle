// This Is A Jungle - Game Logic (Mockup)

// Configuration
const LEVELS = [
    { name: 'Wannabe Rato-Esquilo', points: 0, icon: '🍼' },
    { name: 'Bee and Snail Eater', points: 100, icon: '🦡' },
    { name: 'Chicken and Rabbit Assassin', points: 250, icon: '💪' },
    { name: 'Rattle Snake Abuser', points: 500, icon: '👑' },
    { name: 'Almost Chuck Norris Level', points: 1000, icon: '🏆' }
];

const MAX_POINTS = 1000;

// Path checkpoints - traced from actual river path in savana.png
// User-provided coordinates at 4% intervals (0%, 4%, 8%... 100%)
const PATH_CHECKPOINTS = [
    { progress: 0, x: 12.6, y: 82.2 },    // 0% - START (bottom-left)
    { progress: 4, x: 49.3, y: 65.0 },    // 4%
    { progress: 8, x: 62.8, y: 64.5 },    // 8%
    { progress: 12, x: 63.7, y: 80.8 },   // 12%
    { progress: 16, x: 78.5, y: 85.2 },   // 16%
    { progress: 20, x: 76.0, y: 72.6 },   // 20%
    { progress: 24, x: 77.1, y: 59.5 },   // 24%
    { progress: 28, x: 92.1, y: 64.8 },   // 28%
    { progress: 32, x: 89.0, y: 50.6 },   // 32%
    { progress: 36, x: 76.0, y: 47.5 },   // 36%
    { progress: 40, x: 63.6, y: 51.2 },   // 40%
    { progress: 44, x: 44.8, y: 51.8 },   // 44% - bridge area
    { progress: 48, x: 29.5, y: 55.9 },   // 48%
    { progress: 52, x: 16.0, y: 53.2 },   // 52%
    { progress: 56, x: 9.5, y: 43.2 },    // 56%
    { progress: 60, x: 19.3, y: 29.5 },   // 60%
    { progress: 64, x: 37.9, y: 26.5 },   // 64%
    { progress: 68, x: 53.2, y: 28.2 },   // 68%
    { progress: 72, x: 72.4, y: 32.2 },   // 72%
    { progress: 76, x: 86.2, y: 32.2 },   // 76%
    { progress: 80, x: 91.2, y: 24.0 },   // 80%
    { progress: 84, x: 82.2, y: 13.2 },   // 84%
    { progress: 88, x: 67.7, y: 10.7 },   // 88%
    { progress: 92, x: 56.1, y: 12.3 },   // 92%
    { progress: 96, x: 38.4, y: 13.9 },   // 96%
    { progress: 100, x: 17.9, y: 11.6 }   // 100% - FINISH
];

// Sample player data (will be replaced with real data later)
let players = [
    { id: '1', name: 'Sarah K.', avatar: '🦁', points: 750, color: '#FF1744' },
    { id: '2', name: 'Mike R.', avatar: '🐆', points: 420, color: '#2196F3' },
    { id: '3', name: 'Jessica T.', avatar: '🐺', points: 180, color: '#4CAF50' },
    { id: '4', name: 'David L.', avatar: '🐍', points: 890, color: '#9C27B0' },
    { id: '5', name: 'Amanda C.', avatar: '🦅', points: 65, color: '#FF9800' },
    { id: '6', name: 'Chris P.', avatar: '🦛', points: 310, color: '#00BCD4' }
];

// Load player data from data.json
async function loadPlayerDataFromFile() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`Failed to load data.json: ${response.status}`);
        }
        const data = await response.json();
        players = data.players;
        
        console.log('✅ Loaded player data from data.json:', players);
        
        // Update all badges with loaded data
        players.forEach(player => {
            updatePlayerDisplay(player.id, player.points);
        });
        
        updateLeaderboard();
        console.log('✅ Updated all player positions and leaderboard');
    } catch (error) {
        console.error('❌ Failed to load data.json:', error);
        console.error('Using default hardcoded data instead');
        // Fallback: use the hardcoded data above
        players.forEach(player => {
            updatePlayerDisplay(player.id, player.points);
        });
        updateLeaderboard();
    }
}

// Helper Functions
function getCurrentLevel(points) {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (points >= LEVELS[i].points) {
            return LEVELS[i];
        }
    }
    return LEVELS[0];
}

function getNextLevel(points) {
    for (let i = 0; i < LEVELS.length; i++) {
        if (points < LEVELS[i].points) {
            return LEVELS[i];
        }
    }
    return null; // Already at max level
}

function calculateProgress(points) {
    // Cap at 100% even if points exceed MAX_POINTS
    return Math.min((points / MAX_POINTS) * 100, 100);
}

function getPointsToNextLevel(points) {
    const nextLevel = getNextLevel(points);
    if (nextLevel) {
        return nextLevel.points - points;
    }
    return 0;
}

// Calculate position on the path based on progress percentage
// Path is non-linear with curves, so we find the surrounding waypoints and interpolate
function getPathPosition(progress) {
    // Ensure progress is between 0 and 100
    progress = Math.max(0, Math.min(100, progress));
    
    // Find the two checkpoints that surround this progress value
    let checkpoint1 = PATH_CHECKPOINTS[0];
    let checkpoint2 = PATH_CHECKPOINTS[PATH_CHECKPOINTS.length - 1];
    
    for (let i = 0; i < PATH_CHECKPOINTS.length - 1; i++) {
        if (progress >= PATH_CHECKPOINTS[i].progress && progress <= PATH_CHECKPOINTS[i + 1].progress) {
            checkpoint1 = PATH_CHECKPOINTS[i];
            checkpoint2 = PATH_CHECKPOINTS[i + 1];
            break;
        }
    }
    
    // If at exactly 100%, use the last checkpoint
    if (progress === 100) {
        return { x: PATH_CHECKPOINTS[PATH_CHECKPOINTS.length - 1].x, y: PATH_CHECKPOINTS[PATH_CHECKPOINTS.length - 1].y };
    }
    
    // Calculate interpolation factor between the two checkpoints
    const segmentProgress = (progress - checkpoint1.progress) / (checkpoint2.progress - checkpoint1.progress);
    
    // Linear interpolation between checkpoints
    const x = checkpoint1.x + (checkpoint2.x - checkpoint1.x) * segmentProgress;
    const y = checkpoint1.y + (checkpoint2.y - checkpoint1.y) * segmentProgress;
    
    return { x, y };
}

// Animation function for progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Update player display (for future real-time updates)
function updatePlayerDisplay(playerId, newPoints) {
    const playerBadge = document.querySelector(`[data-player="${playerId}"]`);
    if (!playerBadge) return;

    const currentLevel = getCurrentLevel(newPoints);
    const nextLevel = getNextLevel(newPoints);
    const progress = calculateProgress(newPoints);
    const pointsToNext = getPointsToNextLevel(newPoints);
    
    // Calculate position on path
    const position = getPathPosition(progress);
    
    // Update badge position with animation
    playerBadge.style.transition = 'left 1s ease, top 1s ease';
    playerBadge.style.left = `${position.x}%`;
    playerBadge.style.top = `${position.y}%`;
    playerBadge.setAttribute('data-progress', progress);
    
    // Get player color
    const color = playerBadge.getAttribute('data-color');
    const badgerIcon = playerBadge.querySelector('.badger-icon');
    if (color) {
        badgerIcon.style.borderColor = color;
        badgerIcon.style.boxShadow = `0 0 15px ${color}99`;
    }
    
    // Add percentage text inside badge
    let percentText = badgerIcon.querySelector('.percent-text');
    if (!percentText) {
        percentText = document.createElement('div');
        percentText.className = 'percent-text';
        badgerIcon.appendChild(percentText);
    }
    percentText.textContent = `${Math.round(progress)}%`;
    
    // Update tooltip content
    const tooltip = playerBadge.querySelector('.player-tooltip');
    tooltip.querySelector('.tooltip-score').textContent = `${newPoints} pts`;
    
    if (nextLevel) {
        tooltip.querySelector('.tooltip-level').textContent = `${currentLevel.name} → ${nextLevel.name}`;
    } else {
        tooltip.querySelector('.tooltip-level').textContent = '🏆 Almost Chuck Norris Level!';
    }
    
    // Save to localStorage
    savePlayerData();
}

// Adjust points disabled - use data.json as source of truth
// function adjustPoints(playerId, delta) { ... }
// function showUpdateInstructions() { ... }

// Update leaderboard display
function updateLeaderboard() {
    const leaderboardList = document.querySelector('.leaderboard-list');
    if (!leaderboardList) return;
    
    // Get all player data from badges
    const playerData = Array.from(document.querySelectorAll('.player-badge')).map(badge => {
        const tooltip = badge.querySelector('.player-tooltip');
        return {
            id: badge.getAttribute('data-player'),
            name: tooltip.querySelector('.tooltip-name').textContent,
            avatar: tooltip.querySelector('.tooltip-avatar').textContent,
            score: parseInt(tooltip.querySelector('.tooltip-score').textContent),
            color: badge.getAttribute('data-color')
        };
    });
    
    // Sort by score descending
    playerData.sort((a, b) => b.score - a.score);
    
    // Update leaderboard HTML
    leaderboardList.innerHTML = playerData.map((player, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        return `
            <div class="leaderboard-item ${rankClass}">
                <span class="rank">${rank}</span>
                <span class="avatar">${player.avatar}</span>
                <span class="name">${player.name}</span>
                <span class="score">${player.score}</span>
                <span class="color-indicator" style="background: ${player.color};"></span>
            </div>
        `;
    }).join('');
}

// Save player data to localStorage
function savePlayerData() {
    const playerData = Array.from(document.querySelectorAll('.player-badge')).map(badge => {
        const tooltip = badge.querySelector('.player-tooltip');
        return {
            id: badge.getAttribute('data-player'),
            points: parseInt(tooltip.querySelector('.tooltip-score').textContent)
        };
    });
    localStorage.setItem('jungleGameData', JSON.stringify(playerData));
}

// Load player data from localStorage (deprecated - now uses data.json)
function loadPlayerData() {
    const saved = localStorage.getItem('jungleGameData');
    if (!saved) return;
    
    try {
        const playerData = JSON.parse(saved);
        playerData.forEach(player => {
            updatePlayerDisplay(player.id, player.points);
        });
        updateLeaderboard();
    } catch (e) {
        console.error('Failed to load saved data:', e);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🦡 This Is A Jungle - Game Loaded!');
    
    // Load player data from data.json
    await loadPlayerDataFromFile();
    
    console.log('📊 Data source: data.json (shared across all users)');
});

// Export functions for future use
window.gameAPI = {
    updatePlayerDisplay,
    updateLeaderboard,
    loadPlayerDataFromFile,
    getCurrentLevel,
    getNextLevel,
    calculateProgress,
    getPathPosition,
    PATH_CHECKPOINTS,
    players
};
