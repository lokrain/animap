import { VectorTile } from './types.js';

export class TileLoader {
    private tileCache: Map<string, VectorTile> = new Map();

    async loadTile(x: number, y: number, z: number): Promise<VectorTile | null> {
        const key = `${z}/${x}/${y}`;
        
        if (this.tileCache.has(key)) {
            return this.tileCache.get(key)!;
        }

        // For demo purposes, generate sample vector tiles
        const tile = this.generateSampleTile(x, y, z);
        this.tileCache.set(key, tile);
        
        return tile;
    }

    private generateSampleTile(x: number, y: number, z: number): VectorTile {
        const tileSize = 256;
        const features = [];

        // Calculate tile offset based on tile coordinates
        const tileOffsetX = x * tileSize;
        const tileOffsetY = y * tileSize;

        // Generate some sample geometric features
        const centerX = tileSize / 2;
        const centerY = tileSize / 2;

        // Add a sample polygon (rectangle) - positioned relative to tile center
        features.push({
            id: `polygon_${x}_${y}_${z}`,
            type: 'polygon' as const,
            coordinates: [
                { x: tileOffsetX + centerX - 50, y: tileOffsetY + centerY - 30 },
                { x: tileOffsetX + centerX + 50, y: tileOffsetY + centerY - 30 },
                { x: tileOffsetX + centerX + 50, y: tileOffsetY + centerY + 30 },
                { x: tileOffsetX + centerX - 50, y: tileOffsetY + centerY + 30 }
            ],
            properties: { name: 'Sample Building' },
            style: {
                fillColor: '#e74c3c',
                strokeColor: '#c0392b',
                strokeWidth: 2
            }
        });

        // Add sample lines (roads)
        features.push({
            id: `road_${x}_${y}_${z}`,
            type: 'line' as const,
            coordinates: [
                { x: tileOffsetX, y: tileOffsetY + centerY },
                { x: tileOffsetX + tileSize, y: tileOffsetY + centerY }
            ],
            properties: { type: 'road' },
            style: {
                strokeColor: '#34495e',
                strokeWidth: 4
            }
        });

        features.push({
            id: `road2_${x}_${y}_${z}`,
            type: 'line' as const,
            coordinates: [
                { x: tileOffsetX + centerX, y: tileOffsetY },
                { x: tileOffsetX + centerX, y: tileOffsetY + tileSize }
            ],
            properties: { type: 'road' },
            style: {
                strokeColor: '#34495e',
                strokeWidth: 4
            }
        });

        // Add sample points
        for (let i = 0; i < 3; i++) {
            const px = tileOffsetX + 50 + (i * 70);
            const py = tileOffsetY + 50 + (i * 40);
            
            features.push({
                id: `point_${x}_${y}_${z}_${i}`,
                type: 'point' as const,
                coordinates: [{ x: px, y: py }],
                properties: { name: `Point ${i + 1}` },
                style: {
                    fillColor: '#f39c12',
                    strokeColor: '#e67e22',
                    strokeWidth: 2,
                    pointRadius: 6
                }
            });
        }

        return {
            x,
            y,
            z,
            features,
            bbox: {
                minX: tileOffsetX,
                minY: tileOffsetY,
                maxX: tileOffsetX + tileSize,
                maxY: tileOffsetY + tileSize
            }
        };
    }

    clearCache(): void {
        this.tileCache.clear();
    }
}