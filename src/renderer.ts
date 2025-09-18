import { Point, VectorTile, VectorFeature } from './types.js';

export class VectorTileRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private scale: number = 1;
    private offsetX: number = 0;
    private offsetY: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Unable to get 2D context from canvas');
        }
        this.ctx = ctx;
        this.resizeCanvas();
    }

    resizeCanvas(): void {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * devicePixelRatio;
        this.canvas.height = rect.height * devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    setTransform(scale: number, offsetX: number, offsetY: number): void {
        this.scale = scale;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderTile(tile: VectorTile): void {
        for (const feature of tile.features) {
            this.renderFeature(feature);
        }
    }

    private renderFeature(feature: VectorFeature): void {
        this.ctx.save();
        
        const transformedCoords = feature.coordinates.map(coord => 
            this.transformPoint(coord)
        );

        switch (feature.type) {
            case 'point':
                this.renderPoint(transformedCoords[0], feature);
                break;
            case 'line':
                this.renderLine(transformedCoords, feature);
                break;
            case 'polygon':
                this.renderPolygon(transformedCoords, feature);
                break;
        }

        this.ctx.restore();
    }

    private transformPoint(point: Point): Point {
        return {
            x: (point.x + this.offsetX) * this.scale,
            y: (point.y + this.offsetY) * this.scale
        };
    }

    private renderPoint(point: Point, feature: VectorFeature): void {
        const radius = feature.style.pointRadius || 5;
        const fillColor = feature.style.fillColor || '#3498db';

        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = fillColor;
        this.ctx.fill();

        if (feature.style.strokeColor) {
            this.ctx.strokeStyle = feature.style.strokeColor;
            this.ctx.lineWidth = feature.style.strokeWidth || 1;
            this.ctx.stroke();
        }
    }

    private renderLine(points: Point[], feature: VectorFeature): void {
        if (points.length < 2) return;

        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }

        this.ctx.strokeStyle = feature.style.strokeColor || '#2c3e50';
        this.ctx.lineWidth = feature.style.strokeWidth || 2;
        this.ctx.stroke();
    }

    private renderPolygon(points: Point[], feature: VectorFeature): void {
        if (points.length < 3) return;

        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        
        this.ctx.closePath();

        if (feature.style.fillColor) {
            this.ctx.fillStyle = feature.style.fillColor;
            this.ctx.fill();
        }

        if (feature.style.strokeColor) {
            this.ctx.strokeStyle = feature.style.strokeColor;
            this.ctx.lineWidth = feature.style.strokeWidth || 1;
            this.ctx.stroke();
        }
    }
}