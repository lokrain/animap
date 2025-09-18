export interface Point {
    x: number;
    y: number;
}

export interface BoundingBox {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

export interface VectorFeature {
    id: string;
    type: 'point' | 'line' | 'polygon';
    coordinates: Point[];
    properties: Record<string, any>;
    style: {
        strokeColor?: string;
        strokeWidth?: number;
        fillColor?: string;
        pointRadius?: number;
    };
}

export interface VectorTile {
    x: number;
    y: number;
    z: number;
    features: VectorFeature[];
    bbox: BoundingBox;
}