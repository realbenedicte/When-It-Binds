// Star Gallery - Interactive star-shaped image containers with moveable stars and resizable points

class StarGallery {
    constructor(containerId, images) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn('Star gallery container not found:', containerId);
            return;
        }

        this.images = images;
        this.stars = [];
        this.isDragging = false;
        this.isMoving = false;
        this.activeStarId = null;
        this.activeOuterIndex = null;

        // For moving stars
        this.startMouseX = 0;
        this.startMouseY = 0;
        this.startPosX = 0;
        this.startPosY = 0;

        // Star configuration
        this.starSize = 800; // SVG viewBox size - large to allow stretching
        this.defaultOuterRadius = 370; // Longer star arms (scaled for 800 viewBox)
        this.defaultInnerRadius = 120;
        this.numPoints = 5;
        this.pointHitRadius = 50; // How close to a point to trigger resize

        this.init();
    }

    init() {
        this.createStars();
        this.bindEvents();
    }

    // Generate star points with individual radii for each outer point
    generateStarPoints(cx, cy, outerRadii, innerRadius) {
        const points = [];
        const angleStep = Math.PI / this.numPoints;

        for (let i = 0; i < this.numPoints * 2; i++) {
            const isOuter = i % 2 === 0;
            const outerIndex = Math.floor(i / 2);
            const radius = isOuter ? outerRadii[outerIndex] : innerRadius;
            const angle = (i * angleStep) - (Math.PI / 2); // Start from top

            points.push({
                x: cx + radius * Math.cos(angle),
                y: cy + radius * Math.sin(angle),
                isOuter: isOuter,
                outerIndex: isOuter ? outerIndex : null,
                angle: angle
            });
        }
        return points;
    }

    pointsToSVGString(points) {
        return points.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    }

    createStarElement(index, imageSrc) {
        const cx = this.starSize / 2;
        const cy = this.starSize / 2;

        // Initialize individual radii for each outer point
        const outerRadii = Array(this.numPoints).fill(this.defaultOuterRadius);
        const points = this.generateStarPoints(cx, cy, outerRadii, this.defaultInnerRadius);

        const container = document.createElement('div');
        container.className = 'star-container';
        container.dataset.starId = index;

        container.innerHTML = `
            <svg viewBox="0 0 ${this.starSize} ${this.starSize}" class="star-svg">
                <defs>
                    <clipPath id="star-clip-${index}">
                        <polygon points="${this.pointsToSVGString(points)}" />
                    </clipPath>
                </defs>
                <image href="${imageSrc}"
                       clip-path="url(#star-clip-${index})"
                       x="0" y="0"
                       width="${this.starSize}" height="${this.starSize}"
                       preserveAspectRatio="xMidYMid slice" />
            </svg>
        `;

        this.stars.push({
            element: container,
            points: points,
            outerRadii: outerRadii,
            innerRadius: this.defaultInnerRadius,
            index: index,
            position: { x: 0, y: 0 } // For tracking position when moved
        });

        return container;
    }

    createStars() {
        this.images.forEach((imageSrc, index) => {
            const starEl = this.createStarElement(index, imageSrc);
            this.container.appendChild(starEl);
        });
    }

    bindEvents() {
        // Use event delegation for efficiency
        this.container.addEventListener('mousedown', (e) => this.handleDragStart(e));
        this.container.addEventListener('touchstart', (e) => this.handleDragStart(e), { passive: false });

        document.addEventListener('mousemove', (e) => this.handleDragMove(e));
        document.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: false });

        document.addEventListener('mouseup', () => this.handleDragEnd());
        document.addEventListener('touchend', () => this.handleDragEnd());
        document.addEventListener('touchcancel', () => this.handleDragEnd());

        // Update cursor on mouse move
        this.container.addEventListener('mousemove', (e) => this.updateCursor(e));
    }

    // Check if click is near an outer star point
    getNearestOuterPoint(star, svgX, svgY) {
        let nearestIndex = null;
        let nearestDist = Infinity;

        star.points.forEach((point, i) => {
            if (point.isOuter) {
                const dist = Math.sqrt(Math.pow(svgX - point.x, 2) + Math.pow(svgY - point.y, 2));
                if (dist < nearestDist && dist < this.pointHitRadius) {
                    nearestDist = dist;
                    nearestIndex = point.outerIndex;
                }
            }
        });

        return nearestIndex;
    }

    updateCursor(e) {
        if (this.isDragging || this.isMoving) return;

        const starContainer = e.target.closest('.star-container');
        if (!starContainer) return;

        const starId = parseInt(starContainer.dataset.starId);
        const star = this.stars[starId];
        const rect = starContainer.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const svgX = (x / rect.width) * this.starSize;
        const svgY = (y / rect.height) * this.starSize;

        const nearPoint = this.getNearestOuterPoint(star, svgX, svgY);

        if (nearPoint !== null) {
            starContainer.style.cursor = 'grab';
        } else {
            starContainer.style.cursor = 'move';
        }
    }

    handleDragStart(e) {
        const starContainer = e.target.closest('.star-container');
        if (!starContainer) return;

        e.preventDefault();

        const starId = parseInt(starContainer.dataset.starId);
        const star = this.stars[starId];
        const rect = starContainer.getBoundingClientRect();

        // Get cursor position
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const svgX = (x / rect.width) * this.starSize;
        const svgY = (y / rect.height) * this.starSize;

        // Check if near an outer point
        const nearPoint = this.getNearestOuterPoint(star, svgX, svgY);

        this.activeStarId = starId;

        if (nearPoint !== null) {
            // Resize mode - dragging a star point
            this.isDragging = true;
            this.activeOuterIndex = nearPoint;
            starContainer.style.cursor = 'grabbing';
        } else {
            // Move mode - dragging the entire star
            this.isMoving = true;
            // Store starting positions
            this.startMouseX = clientX;
            this.startMouseY = clientY;
            this.startPosX = star.position.x;
            this.startPosY = star.position.y;
            starContainer.style.cursor = 'grabbing';
            starContainer.classList.add('moving');
        }
    }

    handleDragMove(e) {
        if (!this.isDragging && !this.isMoving) return;

        e.preventDefault();

        const star = this.stars[this.activeStarId];
        const container = star.element;

        // Get cursor position
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        if (this.isDragging) {
            // Resize star point
            const rect = container.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            const svgX = (x / rect.width) * this.starSize;
            const svgY = (y / rect.height) * this.starSize;

            const cx = this.starSize / 2;
            const cy = this.starSize / 2;
            const newRadius = Math.sqrt(Math.pow(svgX - cx, 2) + Math.pow(svgY - cy, 2));

            const minRadius = 20;
            const maxRadius = this.starSize * 0.48; // Allow points to stretch to edge of viewBox
            const constrainedRadius = Math.max(minRadius, Math.min(maxRadius, newRadius));

            star.outerRadii[this.activeOuterIndex] = constrainedRadius;
            this.updateStar(this.activeStarId);

        } else if (this.isMoving) {
            // Move entire star - simple delta from start
            const deltaX = clientX - this.startMouseX;
            const deltaY = clientY - this.startMouseY;

            const newX = this.startPosX + deltaX;
            const newY = this.startPosY + deltaY;

            // Store position
            star.position = { x: newX, y: newY };

            // Apply transform
            container.style.transform = `translate(${newX}px, ${newY}px)`;
        }
    }

    handleDragEnd() {
        if (this.activeStarId !== null) {
            const container = this.stars[this.activeStarId].element;
            container.style.cursor = 'grab';
            container.classList.remove('moving');
        }

        this.isDragging = false;
        this.isMoving = false;
        this.activeStarId = null;
        this.activeOuterIndex = null;
    }

    updateStar(starId) {
        const star = this.stars[starId];
        const cx = this.starSize / 2;
        const cy = this.starSize / 2;

        // Regenerate points with current radii
        const newPoints = this.generateStarPoints(cx, cy, star.outerRadii, star.innerRadius);
        star.points = newPoints;

        // Update SVG polygon
        const polygon = star.element.querySelector('polygon');
        polygon.setAttribute('points', this.pointsToSVGString(newPoints));
    }

    // Public method to reset all stars to default
    resetAll() {
        this.stars.forEach((star, index) => {
            star.outerRadii = Array(this.numPoints).fill(this.defaultOuterRadius);
            star.position = { x: 0, y: 0 };
            star.element.style.transform = '';
            this.updateStar(index);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Placeholder image paths - replace with your actual JPEGs
    const starImages = [
        'assets/images/placeholder-1.jpg',
        'assets/images/placeholder-2.jpg',
        'assets/images/placeholder-3.jpg',
        'assets/images/placeholder-4.jpg',
        'assets/images/placeholder-5.jpg'
    ];

    // Only initialize if gallery container exists
    const galleryContainer = document.getElementById('star-gallery');
    if (galleryContainer) {
        window.starGallery = new StarGallery('star-gallery', starImages);
    }
});
