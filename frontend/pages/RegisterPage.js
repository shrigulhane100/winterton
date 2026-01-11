
export default {
  template: `
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="mb-4 text-center">Register</h2>
        <form @submit.prevent="submitRegister">
          <div class="mb-3">
            <label for="fullName" class="form-label">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              class="form-control" 
              placeholder="Full Name" 
              v-model="full_name"
              required>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <input 
              type="email" 
              id="email" 
              class="form-control" 
              placeholder="Email" 
              v-model="email"
              required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              class="form-control" 
              placeholder="Password" 
              v-model="password"
              required>
          </div>
          <div class="mb-3">
            <label for="qualification" class="form-label">Qualification</label>
            <input 
              type="text" 
              id="qualification" 
              class="form-control" 
              placeholder="Qualification" 
              v-model="qualification">
          </div>
          <div class="mb-3">
            <label for="dob" class="form-label">Date of Birth</label>
            <input 
              type="date" 
              id="dob" 
              class="form-control" 
              placeholder="Date of Birth" 
              v-model="dob">
          </div>
          <button type="submit" class="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  
  `,
  data() {
    return {
      email: "",
      password: "",
      full_name: "",
      qualification: "",
      dob: "",
      active: true,
      role: "user",  // Default role for the new user
    };
  },
  methods: {
    async submitRegister() {
      try {
        const res = await fetch(location.origin + "/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            full_name: this.full_name,
            qualification: this.qualification,
            dob: this.dob,
            active: this.active,
            role: this.role,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data);
          console.log("User registered successfully");
          this.$router.push("/"); // Redirect to home or login page
        } else {
          // Handle error responses (user already exists, etc.)
          const errorData = await res.json();
          console.error("Error:", errorData);
          alert("Registration failed: " + errorData.description);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Registration failed: " + error.message);
      }
    },
  },
};
