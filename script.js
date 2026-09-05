document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('hidden');
    }, 2000);

    initializeNavigation();
    initializeCharts();
    initializeAnimations();
});

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 14, 39, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(10, 14, 39, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function generatePrediction() {
    const location = document.getElementById('location').value;
    const timeframe = document.getElementById('timeframe').value;
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    
    if (!location) {
        showNotification('Please enter a location', 'error');
        return;
    }

    const predictBtn = document.querySelector('.predict-btn');
    predictBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    predictBtn.disabled = true;

    setTimeout(() => {
        const predictions = generateMockPredictions(timeframe);
        displayPredictionResults(predictions);
        
        predictBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Prediction';
        predictBtn.disabled = false;
        
        showNotification('Prediction generated successfully!', 'success');
    }, 2000);
}

function generateMockPredictions(timeframe) {
    const baseTemp = 20 + Math.random() * 15;
    const basePrecip = Math.random() * 50;
    const baseWind = 10 + Math.random() * 30;
    const baseHumidity = 40 + Math.random() * 40;

    const multiplier = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;

    return {
        temperature: {
            value: (baseTemp + Math.random() * 5).toFixed(1),
            unit: '°C',
            trend: Math.random() > 0.5 ? 'rising' : Math.random() > 0.5 ? 'falling' : 'stable'
        },
        precipitation: {
            value: (basePrecip * multiplier).toFixed(1),
            unit: 'mm',
            trend: Math.random() > 0.5 ? 'increasing' : Math.random() > 0.5 ? 'decreasing' : 'stable'
        },
        wind: {
            value: (baseWind + Math.random() * 10).toFixed(1),
            unit: 'km/h',
            trend: Math.random() > 0.5 ? 'increasing' : Math.random() > 0.5 ? 'decreasing' : 'stable'
        },
        humidity: {
            value: (baseHumidity + Math.random() * 10).toFixed(0),
            unit: '%',
            trend: Math.random() > 0.5 ? 'rising' : Math.random() > 0.5 ? 'falling' : 'stable'
        }
    };
}

function displayPredictionResults(predictions) {
    const resultsDiv = document.getElementById('predictionResults');
    resultsDiv.style.display = 'block';

    document.getElementById('tempResult').textContent = `${predictions.temperature.value}${predictions.temperature.unit}`;
    document.getElementById('precipResult').textContent = `${predictions.precipitation.value}${predictions.precipitation.unit}`;
    document.getElementById('windResult').textContent = `${predictions.wind.value}${predictions.wind.unit}`;
    document.getElementById('humidityResult').textContent = `${predictions.humidity.value}${predictions.humidity.unit}`;

    updateTrendIndicator('tempTrend', predictions.temperature.trend);
    updateTrendIndicator('precipTrend', predictions.precipitation.trend);
    updateTrendIndicator('windTrend', predictions.wind.trend);
    updateTrendIndicator('humidityTrend', predictions.humidity.trend);

    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateTrendIndicator(elementId, trend) {
    const element = document.getElementById(elementId);
    const icons = {
        rising: 'fa-arrow-up',
        falling: 'fa-arrow-down',
        stable: 'fa-minus',
        increasing: 'fa-arrow-up',
        decreasing: 'fa-arrow-down'
    };
    
    const colors = {
        rising: '#ff6b35',
        increasing: '#ff6b35',
        falling: '#00d4ff',
        decreasing: '#00d4ff',
        stable: '#b8c1ec'
    };

    element.innerHTML = `<i class="fas ${icons[trend]}"></i> ${trend.charAt(0).toUpperCase() + trend.slice(1)}`;
    element.style.color = colors[trend];
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00d4ff, #0099cc)' : type === 'error' ? 'linear-gradient(135deg, #ff6b35, #f7931e)' : 'linear-gradient(135deg, #667eea, #764ba2)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function initializeCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#b8c1ec'
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#b8c1ec'
                }
            }
        }
    };

    const tempCtx = document.getElementById('tempChart');
    if (tempCtx) {
        new Chart(tempCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Temperature Anomaly',
                    data: [0.8, 0.9, 1.1, 1.2, 1.4, 1.5],
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: chartOptions
        });
    }

    const carbonCtx = document.getElementById('carbonChart');
    if (carbonCtx) {
        new Chart(carbonCtx, {
            type: 'bar',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: 'CO2 Emissions (Gt)',
                    data: [36.2, 34.8, 36.3, 36.8, 37.1, 37.5],
                    backgroundColor: 'rgba(255, 107, 53, 0.8)',
                    borderColor: '#ff6b35',
                    borderWidth: 2
                }]
            },
            options: chartOptions
        });
    }

    const weatherCtx = document.getElementById('weatherChart');
    if (weatherCtx) {
        new Chart(weatherCtx, {
            type: 'doughnut',
            data: {
                labels: ['Hurricanes', 'Floods', 'Droughts', 'Wildfires', 'Other'],
                datasets: [{
                    data: [25, 30, 20, 15, 10],
                    backgroundColor: [
                        '#00d4ff',
                        '#ff6b35',
                        '#667eea',
                        '#764ba2',
                        '#f7931e'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#b8c1ec',
                            padding: 10
                        }
                    }
                }
            }
        });
    }

    const seaCtx = document.getElementById('seaChart');
    if (seaCtx) {
        new Chart(seaCtx, {
            type: 'line',
            data: {
                labels: ['1993', '1998', '2003', '2008', '2013', '2018', '2023'],
                datasets: [{
                    label: 'Sea Level Rise (mm)',
                    data: [0, 15, 30, 45, 65, 85, 100],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: chartOptions
        });
    }
}

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.analytics-card, .result-card, .feature').forEach(el => {
        observer.observe(el);
    });
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const globe = document.querySelector('.animated-globe');
    if (globe) {
        const rotateX = (mouseY - 0.5) * 20;
        const rotateY = (mouseX - 0.5) * 20;
        globe.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            width: 0;
            height: 0;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.style.width = '300px';
            ripple.style.height = '300px';
        }, 10);
        
        setTimeout(() => {
            this.removeChild(ripple);
        }, 600);
    });
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero::before');
    if (parallax) {
        const speed = 0.5;
        parallax.style.transform = `translateY(${scrolled * speed}px)`;
    }
});
