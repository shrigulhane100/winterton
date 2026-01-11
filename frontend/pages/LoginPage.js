export default {
  template: `
      <div class="container py-5">
        <div class="row d-flex justify-content-center align-items-center">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card bg-dark text-white" style="border-radius: 1rem;">
              <div class="card-body p-5 text-center">
                <h3>Login to your Account</h3><br>
                <!-- Bootstrap Alert for Unauthorized Login -->
                <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                  {{ errorMessage }}
                </div>
                <div data-mdb-input-init class="form-outline form-white mb-4">
                  <input type="email" class="form-control form-control-lg" placeholder="email" v-model="email"/>
                </div>
                <div data-mdb-input-init class="form-outline form-white mb-4">
                  <input type="password" class="form-control form-control-lg" placeholder="password" v-model="password"/>
                </div>
                <button @click="submitLogin" class="btn btn-outline-light btn-lg px-5">Login</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  data() {
    return {
      email: null,
      password: null,
      roll: null,
      errorMessage: "",
    };
  },
  methods: {
    async submitLogin() {
      const res = await fetch(location.origin + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          roll: this.role,
          message: this.errorMessage,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role) {
          console.log("we are logged in");
          localStorage.setItem("user", JSON.stringify(data));
          this.$store.commit("setUser");
          this.$router.push("/");
          this.errorMessage = ""; 
        } else {
          this.errorMessage = data.message || "Incorrect email or password";
        }
      } else {
        this.errorMessage = data.message || "Login failed";
      }
    },
  },
};
