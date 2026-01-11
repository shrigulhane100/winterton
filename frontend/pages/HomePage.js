export default {
  name: "HomePage",
  template: `
    <div>
    <div class="container my-5">
      <!-- Hero Section -->
      <div class="text-center mb-5 p-4 bg-light rounded shadow-sm">
        <h1 class="display-4">Welcome to Quiz App</h1>
        <p class="lead">
          Test your knowledge with interactive quizzes and improve every day!
        </p>
        <div class="mt-4" v-if="!loggedIn">
          <router-link class="btn btn-primary btn-lg me-3" to="/login">Login</router-link>
          <router-link class="btn btn-outline-secondary btn-lg" to="/register">Register</router-link>
        </div>
      </div>

      <!-- Featured Subjects Section -->
      <div class="row">
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            
            <div class="card-body">
              <h5 class="card-title">General Knowledge</h5>
              <p class="card-text">
                Challenge your general knowledge with a variety of questions on different topics.
              </p>
              <router-link :to="{ path: '/quizzes', query: { subject: 'general' } }" class="btn btn-primary">Take Quiz</router-link>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            
            <div class="card-body">
              <h5 class="card-title">Science & Technology</h5>
              <p class="card-text">
                Explore the world of science with quizzes on discoveries, inventions, and more.
              </p>
              <router-link :to="{ path: '/quizzes', query: { subject: 'science' } }" class="btn btn-primary">Take Quiz</router-link>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            
            <div class="card-body">
              <h5 class="card-title">History</h5>
              <p class="card-text">
                Test your understanding of historical events and figures through challenging quizzes.
              </p>
              <router-link :to="{ path: '/quizzes', query: { subject: 'history' } }" class="btn btn-primary">Take Quiz</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `,
  computed: {
    // Assuming you have set the loggedIn state in your Vuex store
    loggedIn() {
      return this.$store.state.loggedIn;
    },
  },
};
