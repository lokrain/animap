import { MapViewer } from './mapViewer.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize the map viewer
        const mapViewer = new MapViewer('mapCanvas');

        // Setup control buttons
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                mapViewer.zoomIn();
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                mapViewer.zoomOut();
            });
        }

        // Add keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case '+':
                case '=':
                    mapViewer.zoomIn();
                    break;
                case '-':
                    mapViewer.zoomOut();
                    break;
                case 'r':
                case 'R':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        mapViewer.resetView();
                    }
                    break;
            }
        });

        console.log('AniMap initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize AniMap:', error);
    }
});