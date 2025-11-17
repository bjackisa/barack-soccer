<template>
  <div class="competitions-page">
    <Navbar />
    
    <div class="container py-4">
      <div class="page-header mb-4">
        <h1 class="display-5 fw-bold text-center">
          <i class="bi bi-trophy-fill text-warning me-2"></i>
          All Comps
        </h1>
        <p class="text-center text-muted">Browse all available football competitions worldwide</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading && competitions.length === 0" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading competitions...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        {{ error }}
      </div>

      <!-- Competitions Grid -->
      <div v-if="!loading || competitions.length > 0" class="row g-4">
        <div 
          v-for="competition in displayedCompetitions" 
          :key="competition.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="card competition-card h-100 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-start mb-3">
                <div class="competition-icon me-3">
                  <i class="bi bi-trophy text-warning fs-3"></i>
                </div>
                <div class="flex-grow-1">
                  <h5 class="card-title mb-1">{{ competition.name }}</h5>
                  <p class="text-muted small mb-0">
                    <i class="bi bi-geo-alt-fill me-1"></i>
                    {{ competition.area.name }}
                  </p>
                </div>
              </div>

              <div class="competition-details">
                <div class="detail-item mb-2">
                  <i class="bi bi-calendar-check text-success me-2"></i>
                  <span class="detail-label">Season Start:</span>
                  <span class="detail-value">{{ competition.currentSeason?.startDate || 'N/A' }}</span>
                </div>
                <div class="detail-item mb-2">
                  <i class="bi bi-calendar-x text-danger me-2"></i>
                  <span class="detail-label">Season End:</span>
                  <span class="detail-value">{{ competition.currentSeason?.endDate || 'N/A' }}</span>
                </div>
                <div class="detail-item">
                  <i class="bi bi-arrow-clockwise text-info me-2"></i>
                  <span class="detail-label">Last Updated:</span>
                  <span class="detail-value">{{ formatDate(competition.lastUpdated) }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer bg-light">
              <small class="text-muted">
                <i class="bi bi-code-square me-1"></i>
                Code: {{ competition.code || 'N/A' }}
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading More Indicator -->
      <div v-if="loadingMore" class="text-center py-4">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Loading more...</span>
        </div>
        <span class="ms-2 text-muted">Loading more competitions...</span>
      </div>

      <!-- End of Results -->
      <div v-if="allLoaded && competitions.length > 0" class="text-center py-4">
        <p class="text-muted">
          <i class="bi bi-check-circle-fill text-success me-2"></i>
          All competitions loaded ({{ competitions.length }} total)
        </p>
      </div>

      <!-- Scroll Sentinel -->
      <div ref="sentinel" class="sentinel"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '../components/Navbar.vue';

export default {
  name: 'Competitions',
  components: {
    Navbar
  },
  data() {
    return {
      competitions: [],
      displayedCompetitions: [],
      loading: false,
      loadingMore: false,
      error: null,
      currentIndex: 0,
      itemsPerPage: 20,
      observer: null,
      allLoaded: false
    };
  },
  mounted() {
    this.fetchCompetitions();
    this.setupInfiniteScroll();
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    async fetchCompetitions() {
      this.loading = true;
      this.error = null;

      const apiKey = import.meta.env.VITE_API_KEY;

      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        this.error = 'API key is missing. Please add it to your .env file.';
        this.loading = false;
        return;
      }

      try {
        const response = await axios.get('https://api.football-data.org/v4/competitions', {
          headers: {
            'X-Auth-Token': apiKey
          }
        });

        this.competitions = response.data.competitions || [];
        this.loadMoreItems();
      } catch (err) {
        console.error('Error fetching competitions:', err);
        this.error = err.response?.data?.message || 'Failed to load competitions. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    loadMoreItems() {
      if (this.allLoaded) return;

      this.loadingMore = true;

      // Simulate slight delay for better UX
      setTimeout(() => {
        const nextItems = this.competitions.slice(
          this.currentIndex,
          this.currentIndex + this.itemsPerPage
        );

        if (nextItems.length > 0) {
          this.displayedCompetitions.push(...nextItems);
          this.currentIndex += this.itemsPerPage;
        }

        if (this.currentIndex >= this.competitions.length) {
          this.allLoaded = true;
        }

        this.loadingMore = false;
      }, 300);
    },
    setupInfiniteScroll() {
      const options = {
        root: null,
        rootMargin: '200px',
        threshold: 0
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.loadingMore && !this.allLoaded) {
            this.loadMoreItems();
          }
        });
      }, options);

      if (this.$refs.sentinel) {
        this.observer.observe(this.$refs.sentinel);
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (e) {
        return dateString;
      }
    }
  }
};

// v-if 
// v-else-if
// v-else

//v-for
</script>

<style scoped>
.competitions-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  padding: 2rem 0;
}

.competition-card {
  transition: all 0.3s ease;
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.competition-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.competition-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.competition-details {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.detail-label {
  font-weight: 500;
  margin-right: 0.5rem;
  color: #4a5568;
}

.detail-value {
  color: #2d3748;
}

.card-footer {
  border-top: 1px solid #e2e8f0;
}

.sentinel {
  height: 1px;
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .competition-card {
    margin-bottom: 1rem;
  }
}
</style>