/**
 * Tracking Manager for Customer Engine
 * Tracks page views, clicks, sources, and regions.
 */

const TrackingManager = {
    stats: {
        totalVisitors: 0,
        todayClicks: 0,
        pageViews: {},
        sources: {},
        regions: { IN: 0, GLF: 0 } // Regional stats
    },

    init() {
        this.loadStats();
        this.incrementVisitor();
        this.trackRegion();
    },

    loadStats() {
        const savedStats = localStorage.getItem('caretech_stats');
        if (savedStats) {
            this.stats = JSON.parse(savedStats);
            // Ensure regions object exists for older data
            if (!this.stats.regions) {
                this.stats.regions = { IN: 0, GLF: 0 };
            }
        }

        // Reset today's clicks if it's a new day
        const lastDate = localStorage.getItem('caretech_last_date');
        const today = new Date().toDateString();
        if (lastDate !== today) {
            this.stats.todayClicks = 0;
            localStorage.setItem('caretech_last_date', today);
            this.saveStats();
        }
    },

    saveStats() {
        localStorage.setItem('caretech_stats', JSON.stringify(this.stats));
    },

    incrementVisitor() {
        this.stats.totalVisitors++;

        // Track page view
        const page = window.location.pathname || 'homepage';
        if (!this.stats.pageViews[page]) {
            this.stats.pageViews[page] = 0;
        }
        this.stats.pageViews[page]++;

        // Track source
        const source = window.SourceManager ? window.SourceManager.getSource() : 'direct';
        if (!this.stats.sources[source]) {
            this.stats.sources[source] = 0;
        }
        this.stats.sources[source]++;

        this.saveStats();
    },

    trackRegion() {
        // Use RegionManager to get region
        const region = window.RegionManager ? window.RegionManager.getRegion() : 'IN';
        if (this.stats.regions[region] !== undefined) {
            this.stats.regions[region]++;
        }
        this.saveStats();
    },

    trackClick(type) {
        this.stats.todayClicks++;
        console.log('Click tracked:', type);
        this.saveStats();
    },

    getStats() {
        return this.stats;
    }
};

document.addEventListener('DOMContentLoaded', () => TrackingManager.init());
window.TrackingManager = TrackingManager;
window.trackClick = (type) => TrackingManager.trackClick(type);
