// CanSat Catching Game
class CanSatGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
        
        // Set canvas size
        this.canvas.width = 600;
        this.canvas.height = 400;
        
        // Game state
        this.isRunning = false;
        this.score = 0;
        this.lives = 3;
        this.gameSpeed = 2;
        
        // Platform
        this.platform = {
            x: 250,
            y: 350,
            width: 100,
            height: 15,
            speed: 8
        };
        
        // CanSats (falling objects)
        this.cansats = [];
        this.canSatSpawnRate = 0.02;
        
        // Input
        this.keys = {};
        this.mouseX = null;
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.startButton.addEventListener('click', () => this.start());
        this.restartButton.addEventListener('click', () => this.restart());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Mouse/Touch controls
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.touches[0].clientX - rect.left;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = null;
        });
        
        // Draw initial screen
        this.drawStartScreen();
    }
    
    start() {
        this.isRunning = true;
        this.score = 0;
        this.lives = 3;
        this.cansats = [];
        this.gameSpeed = 2;
        
        this.startButton.style.display = 'none';
        this.restartButton.style.display = 'none';
        this.gameOverElement.style.display = 'none';
        
        this.updateUI();
        this.gameLoop();
    }
    
    restart() {
        this.start();
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Move platform with keyboard
        if (this.keys['ArrowLeft']) {
            this.platform.x -= this.platform.speed;
        }
        if (this.keys['ArrowRight']) {
            this.platform.x += this.platform.speed;
        }
        
        // Move platform with mouse/touch
        if (this.mouseX !== null) {
            this.platform.x = this.mouseX - this.platform.width / 2;
        }
        
        // Keep platform in bounds
        if (this.platform.x < 0) this.platform.x = 0;
        if (this.platform.x + this.platform.width > this.canvas.width) {
            this.platform.x = this.canvas.width - this.platform.width;
        }
        
        // Spawn new CanSats
        if (Math.random() < this.canSatSpawnRate) {
            this.cansats.push({
                x: Math.random() * (this.canvas.width - 30),
                y: -30,
                width: 30,
                height: 40,
                speed: this.gameSpeed + Math.random() * 2,
                color: this.getRandomColor()
            });
        }
        
        // Update CanSats
        for (let i = this.cansats.length - 1; i >= 0; i--) {
            const cansat = this.cansats[i];
            cansat.y += cansat.speed;
            
            // Check collision with platform
            if (this.checkCollision(cansat)) {
                this.cansats.splice(i, 1);
                this.score += 10;
                this.updateUI();
                
                // Increase difficulty
                if (this.score % 100 === 0) {
                    this.gameSpeed += 0.5;
                }
            }
            // Check if CanSat missed
            else if (cansat.y > this.canvas.height) {
                this.cansats.splice(i, 1);
                this.lives--;
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    checkCollision(cansat) {
        return cansat.x < this.platform.x + this.platform.width &&
               cansat.x + cansat.width > this.platform.x &&
               cansat.y < this.platform.y + this.platform.height &&
               cansat.y + cansat.height > this.platform.y;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars background
        this.drawStars();
        
        // Draw platform
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.fillRect(this.platform.x, this.platform.y, this.platform.width, this.platform.height);
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.platform.x, this.platform.y, this.platform.width, this.platform.height);
        
        // Draw CanSats
        this.cansats.forEach(cansat => {
            this.drawCanSat(cansat);
        });
    }
    
    drawCanSat(cansat) {
        // Draw CanSat body
        this.ctx.fillStyle = cansat.color;
        this.ctx.fillRect(cansat.x, cansat.y, cansat.width, cansat.height);
        
        // Draw details
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(cansat.x + 3, cansat.y + 5, cansat.width - 6, 5);
        this.ctx.fillRect(cansat.x + 3, cansat.y + 15, cansat.width - 6, 5);
        
        // Draw antenna
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(cansat.x + cansat.width / 2, cansat.y);
        this.ctx.lineTo(cansat.x + cansat.width / 2, cansat.y - 8);
        this.ctx.stroke();
        
        // Draw antenna ball
        this.ctx.fillStyle = '#e94560';
        this.ctx.beginPath();
        this.ctx.arc(cansat.x + cansat.width / 2, cansat.y - 8, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawStars() {
        this.ctx.fillStyle = '#fff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 59) % this.canvas.height;
            this.ctx.fillRect(x, y, 2, 2);
        }
    }
    
    drawStartScreen() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawStars();
        
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ZŁAP CANSATA!', this.canvas.width / 2, this.canvas.height / 2 - 30);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Kliknij START, aby rozpocząć', this.canvas.width / 2, this.canvas.height / 2 + 20);
    }
    
    getRandomColor() {
        const colors = ['#e94560', '#00d4ff', '#16213e', '#0f3460', '#ffd700', '#ff6b81'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        
        let heartsDisplay = '';
        for (let i = 0; i < this.lives; i++) {
            heartsDisplay += '❤️';
        }
        this.livesElement.textContent = heartsDisplay || '💀';
    }
    
    gameOver() {
        this.isRunning = false;
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'block';
        this.restartButton.style.display = 'inline-block';
        
        // Draw game over screen
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#e94560';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('KONIEC GRY!', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Wynik: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 30);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new CanSatGame();
});
