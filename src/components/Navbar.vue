<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <!-- Logo/Brand -->
      <router-link class="navbar-brand" to="/">
        <i class="bi bi-trophy-fill me-2"></i>
        Naseem Comps
      </router-link>

      <!-- Toggler for mobile -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/competitions">
              <i class="bi bi-trophy me-1"></i>
              Competitions
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <i class="bi bi-controller me-1"></i>
              Games
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <i class="bi bi-people-fill me-1"></i>
              Teams
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <i class="bi bi-person-circle me-1"></i>
              Account
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

.nav-link {
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ffffff !important;
}

.router-link-active {
  color: #ffffff !important;
  font-weight: 500;
}
</style>