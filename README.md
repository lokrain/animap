# AniMap - Vector Tile Viewer

A TypeScript-based webpage for drawing prebaked vector map tiles. This project provides a canvas-based map viewer that can render vector tiles with points, lines, and polygons.

## Features

- **Vector Tile Rendering**: Supports rendering of vector features including points, lines, and polygons
- **Interactive Navigation**: Pan the map by dragging and zoom in/out using buttons or mouse wheel
- **TypeScript**: Fully typed codebase for better development experience
- **Canvas-based**: High-performance rendering using HTML5 Canvas
- **Responsive Design**: Adapts to different screen sizes

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:8080`

## Project Structure

```
src/
├── types.ts          # Type definitions for vector features and tiles
├── renderer.ts       # Canvas rendering engine for vector tiles
├── tileLoader.ts     # Tile loading and sample data generation
├── mapViewer.ts      # Main map viewer class with interaction handling
└── main.ts           # Application entry point
```

## Usage

### Basic Controls

- **Zoom In/Out**: Use the buttons in the header or mouse wheel
- **Pan**: Click and drag on the map canvas
- **Keyboard Shortcuts**:
  - `+` or `=`: Zoom in
  - `-`: Zoom out
  - `Ctrl+R` or `Cmd+R`: Reset view

### Sample Data

The application currently generates sample vector tiles with:
- Red rectangular buildings (polygons)
- Dark gray roads (lines)
- Orange points of interest (points)

### Customizing Vector Tiles

To use your own vector tile data, modify the `TileLoader` class in `src/tileLoader.ts` to load from your preferred data source (MVT files, GeoJSON, API endpoints, etc.).

## Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development (TypeScript compilation)
- `npm start` - Start HTTP server

### Architecture

The application follows a modular architecture:

1. **Types** (`types.ts`): Defines interfaces for vector features and tiles
2. **Renderer** (`renderer.ts`): Handles canvas drawing operations
3. **TileLoader** (`tileLoader.ts`): Manages tile loading and caching
4. **MapViewer** (`mapViewer.ts`): Coordinates user interactions and rendering
5. **Main** (`main.ts`): Application initialization and event binding

## License

This project is released under the CC0 1.0 Universal license. See [LICENSE](LICENSE) for details.
