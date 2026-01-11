export default {
  props: ["id", "chapter_id"],
  template: `
  <div class="container my-5 update-chapter">
  <h1 class="text-center mb-4">Edit Chapter</h1>
  <form @submit.prevent="updateChapter" class="p-4 border rounded shadow bg-light">
      <div class="mb-3 form-group">
          <label for="chapter-name" class="form-label">Name:</label>
          <input
              id="chapter-name"
              type="text"
              v-model="chapter.name"
              required
              placeholder="Enter chapter name..."
              class="form-control"
          />
      </div>
      <div class="mb-3 form-group">
          <label for="chapter-description" class="form-label">Description:</label>
          <textarea
              id="chapter-description"
              v-model="chapter.description"
              placeholder="Enter chapter description..."
              class="form-control"
              rows="4"
          ></textarea>
      </div>
      <div class="d-grid">
          <button @click="updateChapter" class="btn btn-primary">Update Chapter</button>
      </div>
  </form>
</div>

    `,
  name: "UpdateChapter",
  data() {
    return {
      chapter: {
        id: "",
        subject_id: "",
        name: "",
        description: "",
      },
    };
  },
  mounted() {
    // Extract chapter and subject IDs from the route parameters
    this.chapter.subject_id = this.$route.params.id;
    this.chapter.id = this.$route.params.chapter_id;
    this.fetchChapter();
  },
  methods: {
    async fetchChapter() {
      try {
        const res = await fetch(
          location.origin + "/api/chapter/" + this.chapter.id,
          {
            headers: {
              "Authentication-Token": this.$store.state.auth_token,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          // Update the chapter properties with the data received
          this.chapter.name = data.name;
          this.chapter.description = data.description;
        } else {
          console.error("Failed to fetch chapter details");
        }
      } catch (error) {
        console.error("Error fetching chapter details:", error);
      }
    },
    async updateChapter() {
      try {
        const res = await fetch(
          location.origin +
            "/api/subject/" +
            this.chapter.subject_id +
            "/chapter/" +
            this.chapter.id,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": this.$store.state.auth_token,
            },
            body: JSON.stringify({
              name: this.chapter.name,
              description: this.chapter.description,
            }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          this.$router.push('/subjects');
        } else {
          const errorData = await res.json();
          console.error("Failed to update chapter:", errorData);
        }
      } catch (error) {
        console.error("Error updating chapter:", error);

      }
    },
  },
};
