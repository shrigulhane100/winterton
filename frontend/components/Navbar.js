import store from "../utils/store.js";
import router from "../utils/router.js";

export default {
  template: `
    <nav class="navbar navbar-expand-lg" style="background-color: #e3f2fd;" data-bs-theme="dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Quiz App</a>
            <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#vueNavbar"
            aria-controls="vueNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
            <span class="navbar-toggler-icon"></span>
            </button>
                <div class="collapse navbar-collapse" id="vueNavbar">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                    <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn == false">
                    <router-link class="nav-link" to="/login">Login</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn == false">
                    <router-link class="nav-link" to="/register">Register</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn == true && $store.state.role == 'admin'">
                    <router-link class="nav-link" to="/subjects">Subject</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn == true && $store.state.role == 'admin'">
                    <router-link class="nav-link" to="/admin/all_users">Users</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn == true && $store.state.role == 'admin'">
                    <router-link class="nav-link" to="/admin_charts">Summary</router-link>
                    </li>

                    <li class="nav-item" v-if="$store.state.loggedIn == true && $store.state.role == 'user'">
                    <router-link class="nav-link" to="/quizzes">Quiz</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn == true && $store.state.role == 'user'">
                    <router-link class="nav-link" to="/user_charts">Summary</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.loggedIn == true && $store.state.role == 'user'">
                    <router-link class="nav-link" :to="'/user/'+ this.$store.state.user_id+'/score'">Your Score</router-link>
                    </li>
                </ul>
                <div class="d-flex">
                    <button class="btn btn-secondary" @click="logout">Logout</button>
                </div>
            </div>
        </div>
    </nav>
    `,
  methods: {
    logout() {
      store.commit("logOut");
      router.go(0);
    },
  },
};

// $store.commit('logOut')
