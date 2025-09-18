import { VectorTileRenderer } from './renderer.js';
import { TileLoader } from './tileLoader.js';
import { Point } from './types.js';

export class MapViewer {
    private canvas: HTMLCanvasElement;
    private renderer: VectorTileRenderer;
    private tileLoader: TileLoader;
    private zoomLevel: number = 1;
    private panOffset: Point = { x: 0, y: 0 };
    private isDragging: boolean = false;
    private lastMousePos: Point = { x: 0, y: 0 };
    private tileSize: number = 256;

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas with id "${canvasId}" not found`);
        }

        this.canvas = canvas;
        this.renderer = new VectorTileRenderer(canvas);
        this.tileLoader = new TileLoader();

        this.setupEventListeners();
        this.render();
    }

    private setupEventListeners(): void {
        // Mouse events for panning
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));

        // Wheel event for zooming
        this.canvas.addEventListener('wheel', this.onWheel.bind(this));

        // Resize handler
        window.addEventListener('resize', this.onResize.bind(this));
    }

    private onMouseDown(event: MouseEvent): void {
        this.isDragging = true;
        this.lastMousePos = { x: event.clientX, y: event.clientY };
        this.canvas.style.cursor = 'grabbing';
    }

    private onMouseMove(event: MouseEvent): void {
        if (!this.isDragging) return;

        const deltaX = event.clientX - this.lastMousePos.x;
        const deltaY = event.clientY - this.lastMousePos.y;

        this.panOffset.x += deltaX;
        this.panOffset.y += deltaY;

        this.lastMousePos = { x: event.clientX, y: event.clientY };
        this.render();
    }

    private onMouseUp(): void {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
    }

    private onWheel(event: WheelEvent): void {
        event.preventDefault();
        
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        this.zoomLevel = Math.max(0.1, Math.min(5.0, this.zoomLevel * zoomFactor));
        
        this.updateZoomDisplay();
        this.render();
    }

    private onResize(): void {
        this.renderer.resizeCanvas();
        this.render();
    }

    zoomIn(): void {
        this.zoomLevel = Math.min(5.0, this.zoomLevel * 1.2);
        this.updateZoomDisplay();
        this.render();
    }

    zoomOut(): void {
        this.zoomLevel = Math.max(0.1, this.zoomLevel * 0.8);
        this.updateZoomDisplay();
        this.render();
    }

    private updateZoomDisplay(): void {
        const zoomDisplay = document.getElementById('zoomLevel');
        if (zoomDisplay) {
            zoomDisplay.textContent = `Zoom: ${this.zoomLevel.toFixed(1)}`;
        }
    }

    private async render(): Promise<void> {
        this.renderer.clear();
        
        // Get canvas dimensions for centering
        const canvasRect = this.canvas.getBoundingClientRect();
        const centerX = canvasRect.width / 2;
        const centerY = canvasRect.height / 2;
        
        this.renderer.setTransform(this.zoomLevel, this.panOffset.x + centerX, this.panOffset.y + centerY);

        // Calculate which tiles are visible
        const visibleTiles = this.getVisibleTiles();

        // Load and render each visible tile
        for (const tileCoord of visibleTiles) {
            try {
                const tile = await this.tileLoader.loadTile(tileCoord.x, tileCoord.y, tileCoord.z);
                if (tile) {
                    this.renderer.renderTile(tile);
                }
            } catch (error) {
                console.error('Failed to load tile:', tileCoord, error);
            }
        }
    }

    private getVisibleTiles(): Array<{x: number, y: number, z: number}> {
        // For simplicity, we'll render a 3x3 grid of tiles around the center
        const centerTileX = 0;
        const centerTileY = 0;
        const zoomLevelInt = Math.floor(Math.log2(this.zoomLevel)) + 1;
        
        const tiles = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                tiles.push({
                    x: centerTileX + dx,
                    y: centerTileY + dy,
                    z: Math.max(0, zoomLevelInt)
                });
            }
        }
        
        return tiles;
    }

    public resetView(): void {
        this.zoomLevel = 1;
        this.panOffset = { x: 0, y: 0 };
        this.updateZoomDisplay();
        this.render();
    }
}