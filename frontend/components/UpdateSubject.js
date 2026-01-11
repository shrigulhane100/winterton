export default {
    name: "UpdateSubject",
    template: `
    <div class="container my-5 update-subject">
    <h1 class="text-center mb-4">Edit Subject</h1>
    <form @submit.prevent="updateSubject" class="p-4 border rounded shadow-sm bg-light">
        <div class="mb-3 form-group">
            <label for="subject-name" class="form-label">Name:</label>
            <input
                id="subject-name"
                type="text"
                v-model="subject.name"
                class="form-control"
                required
                placeholder="Enter subject name..."
            />
        </div>
        <div class="mb-3 form-group">
            <label for="subject-description" class="form-label">Description:</label>
            <textarea
                id="subject-description"
                v-model="subject.description"
                class="form-control"
                placeholder="Enter subject description..."
            ></textarea>
        </div>
        <div class="d-grid">
            <button @click="updateSubject" class="btn btn-primary">Update Subject</button>
        </div>
    </form>
</div>


    `,

    data() {
      return {
        subject: {
          id: null,
          name: "",
          description: ""
        },
      };
    },
    created() {
      // Assume the subject ID is passed as a route param.
      this.subject.id = this.$route.params.id;
      this.fetchSubject();
    },

    methods: {
        async fetchSubject() {
          try {
            const res = await fetch(
              location.origin + '/api/subject/' + this.subject.id,
              {
                headers: {
                  'Authentication-Token': this.$store.state.auth_token
                }
              }
            );
            if (res.ok) {
              const data = await res.json();
              // Assuming API returns an object with name and description
              this.subject.name = data.name;
              this.subject.description = data.description;
            } else {
              console.error('Failed to fetch subject details');
            }
          } catch (error) {
            console.error('Error fetching subject details:', error);
          }
        },
        async updateSubject() {
          try {
            const res = await fetch(
              location.origin + '/api/subject/' + this.subject.id,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authentication-Token': this.$store.state.auth_token
                },
                body: JSON.stringify({
                  name: this.subject.name,
                  description: this.subject.description
                })
              }
            );
            if (res.ok) {
              const data = await res.json();
              this.$router.push('/subjects');
            } else {
              const errorData = await res.json();
              console.error('Failed to update subject:', errorData);
            }
          } catch (error) {
            console.error('Error updating subject:', error);
          }
        }
      }
    };