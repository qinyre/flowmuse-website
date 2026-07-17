// FlowMuse Whiteboard Engine - Simplified JavaScript Implementation
// Based on the Markdraw engine architecture

class WhiteboardEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.elements = []; // Scene elements
        this.currentTool = 'select';
        this.isDrawing = false;
        this.startPoint = null;
        this.currentElement = null;
        this.selectedElements = [];

        // Drawing properties
        this.strokeColor = '#000000';
        this.fillColor = '#ffffff';
        this.strokeWidth = 2;
        this.opacity = 1.0;

        // View transform
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;

        // History for undo/redo
        this.history = [];
        this.historyIndex = -1;

        this.initCanvas();
        this.bindEvents();
        this.bindUI();
        this.render();
    }

    initCanvas() {
        const resize = () => {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.render();
        };
        resize();
        window.addEventListener('resize', resize);

        // Draw grid
        this.drawGrid();
    }

    drawGrid() {
        const gridSize = 20;
        const ctx = this.ctx;

        ctx.save();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;

        for (let x = 0; x < this.canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }

        ctx.restore();
    }

    bindEvents() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));

        // Touch events
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    bindUI() {
        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.dataset.tool;
                if (tool) {
                    this.setTool(tool);
                    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
        });

        // Property controls
        const strokeColor = document.getElementById('strokeColor');
        if (strokeColor) {
            strokeColor.addEventListener('change', (e) => {
                this.strokeColor = e.target.value;
            });
        }

        const fillColor = document.getElementById('fillColor');
        if (fillColor) {
            fillColor.addEventListener('change', (e) => {
                this.fillColor = e.target.value;
            });
        }

        const strokeWidth = document.getElementById('strokeWidth');
        const strokeWidthValue = document.getElementById('strokeWidthValue');
        if (strokeWidth && strokeWidthValue) {
            strokeWidth.addEventListener('input', (e) => {
                this.strokeWidth = parseInt(e.target.value);
                strokeWidthValue.value = this.strokeWidth;
            });
            strokeWidthValue.addEventListener('change', (e) => {
                this.strokeWidth = parseInt(e.target.value);
                strokeWidth.value = this.strokeWidth;
            });
        }

        const opacity = document.getElementById('opacity');
        const opacityValue = document.getElementById('opacityValue');
        if (opacity && opacityValue) {
            opacity.addEventListener('input', (e) => {
                this.opacity = parseInt(e.target.value) / 100;
                opacityValue.textContent = e.target.value + '%';
            });
        }

        // Zoom controls
        document.getElementById('zoomIn')?.addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOut')?.addEventListener('click', () => this.zoomOut());
        document.getElementById('zoomReset')?.addEventListener('click', () => this.zoomReset());

        // Undo/Redo/Clear
        document.getElementById('undo')?.addEventListener('click', () => this.undo());
        document.getElementById('redo')?.addEventListener('click', () => this.redo());
        document.getElementById('clear')?.addEventListener('click', () => this.clear());
    }

    setTool(tool) {
        this.currentTool = tool;
        this.canvas.style.cursor = tool === 'hand' ? 'grab' : 'crosshair';

        // Show property panel for drawing tools
        const propertyPanel = document.getElementById('propertyPanel');
        if (propertyPanel) {
            const showPanel = ['rectangle', 'ellipse', 'arrow', 'line', 'freedraw'].includes(tool);
            propertyPanel.classList.toggle('show', showPanel);
        }
    }

    handleMouseDown(e) {
        const point = this.getCanvasPoint(e);
        this.startPoint = point;
        this.isDrawing = true;

        if (this.currentTool === 'hand') {
            this.canvas.style.cursor = 'grabbing';
            return;
        }

        if (this.currentTool === 'freedraw') {
            this.currentElement = {
                type: 'freedraw',
                points: [point],
                strokeColor: this.strokeColor,
                strokeWidth: this.strokeWidth,
                opacity: this.opacity
            };
        } else if (this.currentTool === 'eraser') {
            this.eraseAt(point);
        }

        // Hide hint on first interaction
        const hint = document.getElementById('canvasHint');
        if (hint && hint.style.display !== 'none') {
            hint.style.opacity = '0';
            setTimeout(() => hint.style.display = 'none', 300);
        }
    }

    handleMouseMove(e) {
        if (!this.isDrawing) return;

        const point = this.getCanvasPoint(e);

        if (this.currentTool === 'hand') {
            const dx = point.x - this.startPoint.x;
            const dy = point.y - this.startPoint.y;
            this.panX += dx;
            this.panY += dy;
            this.startPoint = point;
            this.render();
            return;
        }

        if (this.currentTool === 'freedraw') {
            this.currentElement.points.push(point);
            this.render();
            this.drawElement(this.currentElement);
        } else if (this.currentTool === 'eraser') {
            this.eraseAt(point);
        } else {
            // Preview shape
            this.render();
            this.drawPreview(this.startPoint, point);
        }
    }

    handleMouseUp(e) {
        if (!this.isDrawing) return;
        this.isDrawing = false;

        if (this.currentTool === 'hand') {
            this.canvas.style.cursor = 'grab';
            return;
        }

        const point = this.getCanvasPoint(e);

        if (this.currentTool === 'freedraw' && this.currentElement) {
            this.elements.push(this.currentElement);
            this.currentElement = null;
            this.saveHistory();
        } else if (this.currentTool !== 'eraser' && this.currentTool !== 'select') {
            const element = this.createElement(this.startPoint, point);
            if (element) {
                this.elements.push(element);
                this.saveHistory();
            }
        }

        this.render();
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    handleTouchEnd(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        this.canvas.dispatchEvent(mouseEvent);
    }

    handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom = Math.max(0.1, Math.min(5, this.zoom * delta));
        this.updateZoomDisplay();
        this.render();
    }

    handleKeyDown(e) {
        // Undo: Ctrl+Z
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            this.undo();
        }
        // Redo: Ctrl+Y or Ctrl+Shift+Z
        else if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
            e.preventDefault();
            this.redo();
        }
        // Tool shortcuts
        else if (!e.ctrlKey) {
            const toolMap = {
                'v': 'select',
                'r': 'rectangle',
                'o': 'ellipse',
                'a': 'arrow',
                'l': 'line',
                'd': 'freedraw',
                't': 'text',
                'e': 'eraser',
                'h': 'hand'
            };
            const tool = toolMap[e.key.toLowerCase()];
            if (tool) {
                e.preventDefault();
                this.setTool(tool);
                const btn = document.querySelector(`[data-tool="${tool}"]`);
                if (btn) btn.click();
            }
        }
    }

    getCanvasPoint(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - this.panX) / this.zoom,
            y: (e.clientY - rect.top - this.panY) / this.zoom
        };
    }

    createElement(start, end) {
        const element = {
            type: this.currentTool,
            x: Math.min(start.x, end.x),
            y: Math.min(start.y, end.y),
            width: Math.abs(end.x - start.x),
            height: Math.abs(end.y - start.y),
            strokeColor: this.strokeColor,
            fillColor: this.fillColor,
            strokeWidth: this.strokeWidth,
            opacity: this.opacity
        };

        // Ignore tiny elements
        if (element.width < 3 && element.height < 3) {
            return null;
        }

        if (this.currentTool === 'line' || this.currentTool === 'arrow') {
            element.startX = start.x;
            element.startY = start.y;
            element.endX = end.x;
            element.endY = end.y;
        }

        return element;
    }

    drawElement(element) {
        this.ctx.save();
        this.ctx.globalAlpha = element.opacity;
        this.ctx.strokeStyle = element.strokeColor;
        this.ctx.fillStyle = element.fillColor;
        this.ctx.lineWidth = element.strokeWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        switch (element.type) {
            case 'rectangle':
                this.ctx.strokeRect(element.x, element.y, element.width, element.height);
                if (element.fillColor !== '#ffffff') {
                    this.ctx.fillRect(element.x, element.y, element.width, element.height);
                }
                break;

            case 'ellipse':
                this.ctx.beginPath();
                this.ctx.ellipse(
                    element.x + element.width / 2,
                    element.y + element.height / 2,
                    element.width / 2,
                    element.height / 2,
                    0, 0, Math.PI * 2
                );
                this.ctx.stroke();
                if (element.fillColor !== '#ffffff') {
                    this.ctx.fill();
                }
                break;

            case 'line':
            case 'arrow':
                this.ctx.beginPath();
                this.ctx.moveTo(element.startX, element.startY);
                this.ctx.lineTo(element.endX, element.endY);
                this.ctx.stroke();

                if (element.type === 'arrow') {
                    this.drawArrowHead(element.startX, element.startY, element.endX, element.endY);
                }
                break;

            case 'freedraw':
                if (element.points.length < 2) break;
                this.ctx.beginPath();
                this.ctx.moveTo(element.points[0].x, element.points[0].y);
                for (let i = 1; i < element.points.length; i++) {
                    this.ctx.lineTo(element.points[i].x, element.points[i].y);
                }
                this.ctx.stroke();
                break;
        }

        this.ctx.restore();
    }

    drawArrowHead(fromX, fromY, toX, toY) {
        const headLength = 15;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        this.ctx.beginPath();
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.stroke();
    }

    drawPreview(start, end) {
        const tempElement = this.createElement(start, end);
        if (tempElement) {
            this.drawElement(tempElement);
        }
    }

    eraseAt(point) {
        const eraseRadius = this.strokeWidth * 5;
        this.elements = this.elements.filter(element => {
            if (element.type === 'freedraw') {
                return !element.points.some(p =>
                    Math.hypot(p.x - point.x, p.y - point.y) < eraseRadius
                );
            } else {
                const centerX = element.x + element.width / 2;
                const centerY = element.y + element.height / 2;
                return Math.hypot(centerX - point.x, centerY - point.y) > eraseRadius;
            }
        });
        this.render();
    }

    render() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();

        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.zoom, this.zoom);

        this.elements.forEach(element => this.drawElement(element));

        this.ctx.restore();
    }

    zoomIn() {
        this.zoom = Math.min(5, this.zoom * 1.2);
        this.updateZoomDisplay();
        this.render();
    }

    zoomOut() {
        this.zoom = Math.max(0.1, this.zoom / 1.2);
        this.updateZoomDisplay();
        this.render();
    }

    zoomReset() {
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.updateZoomDisplay();
        this.render();
    }

    updateZoomDisplay() {
        const display = document.getElementById('zoomDisplay');
        if (display) {
            display.textContent = Math.round(this.zoom * 100) + '%';
        }
    }

    saveHistory() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(JSON.parse(JSON.stringify(this.elements)));
        this.historyIndex++;

        // Update save status
        const saveStatus = document.querySelector('.save-status');
        if (saveStatus) {
            saveStatus.textContent = '已保存';
            saveStatus.className = 'save-status saved';
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.elements = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.render();
        } else if (this.historyIndex === 0) {
            this.historyIndex = -1;
            this.elements = [];
            this.render();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.elements = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.render();
        }
    }

    clear() {
        if (confirm('确定要清空画布吗？')) {
            this.elements = [];
            this.saveHistory();
            this.render();
        }
    }
}

// Initialize the whiteboard engine
document.addEventListener('DOMContentLoaded', () => {
    const engine = new WhiteboardEngine('editorCanvas');
    console.log('FlowMuse Whiteboard Engine initialized');
});
