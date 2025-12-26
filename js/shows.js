// Shows management system
// Loads show data from JSON file and populates the live page

class ShowsManager {
  constructor() {
    this.showsData = null;
    this.loadShows();
  }

  async loadShows() {
    try {
      const response = await fetch('data/shows.json');
      this.showsData = await response.json();
      this.renderShows();
    } catch (error) {
      console.error('Error loading shows data:', error);
      // Fallback to static content if JSON fails to load
    }
  }

  renderShows() {
    const liveInfoContainer = document.querySelector('.live-info .text-section p');
    if (!liveInfoContainer || !this.showsData) return;

    // Clear existing content
    liveInfoContainer.innerHTML = '';

    // Render each year section
    this.showsData.shows.forEach((yearData, index) => {
      // Add year header
      const yearDiv = document.createElement('div');
      yearDiv.className = 'live-text-line';
      yearDiv.innerHTML = `<strong>${yearData.year}</strong>`;
      liveInfoContainer.appendChild(yearDiv);

      // Add events for this year
      yearData.events.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'live-text-line';
        
        let eventHtml = `${event.date}, `;
        
        // Add link if available
        if (event.link) {
          eventHtml += `<a href="${event.link}" target="_blank">${event.venue}</a>`;
        } else {
          eventHtml += event.venue;
        }
        
        eventHtml += ` - ${event.location}`;
        
        // Add DJ notation if applicable
        if (event.isDJ) {
          eventHtml += ' <em>*DJ</em>';
        }
        
        eventDiv.innerHTML = eventHtml;
        liveInfoContainer.appendChild(eventDiv);
      });

      // Add break between years (except for the last one)
      if (index < this.showsData.shows.length - 1) {
        const breakDiv = document.createElement('br');
        liveInfoContainer.appendChild(breakDiv);
      }
    });

    // Add footer message if available
    if (this.showsData.footerMessage) {
      const breakDiv = document.createElement('br');
      liveInfoContainer.appendChild(breakDiv);
      
      const footerDiv = document.createElement('div');
      footerDiv.className = 'live-text-line';
      footerDiv.innerHTML = `<em>${this.showsData.footerMessage}</em>`;
      liveInfoContainer.appendChild(footerDiv);
    }
  }

  // Method to reload shows (can be called to refresh data)
  async refresh() {
    await this.loadShows();
  }
}

// Initialize shows manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit to ensure the live page structure is ready
  setTimeout(() => {
    window.showsManager = new ShowsManager();
  }, 100);
});

// For debugging: allow manual refresh in console
window.refreshShows = function() {
  if (window.showsManager) {
    window.showsManager.refresh();
  }
};