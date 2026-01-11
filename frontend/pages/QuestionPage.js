export default {
  props: ["quiz_id"],
  template: `
    <div class="container p-4">
      <h1 class="mb-4">Questions for Quiz {{ quiz_id }}</h1>
      <button class="btn btn-primary mb-4" @click="$router.push('/quiz/' + quiz_id + '/question/add')">
        Add Question
      </button>

      <div v-if="questions">
      <table class="table table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Question Statement</th>
            <th>Option 1</th>
            <th>Option 2</th>
            <th>Option 3</th>
            <th>Option 4</th>
            <th>Correct Option</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="question in questions" :key="question.id">
            <td>{{ question.id }}</td>
            <td>{{ question.question_statement }}</td>
            <td>{{ question.option1 }}</td>
            <td>{{ question.option2 }}</td>
            <td>{{ question.option3 }}</td>
            <td>{{ question.option4 }}</td>
            <td>{{ question.correct_option }}</td>
            <td>
              <div class="btn-group" role="group">
                <button class="btn btn-sm btn-primary me-1" @click="$router.push('/quiz/' + question.quiz_id + '/question/' + question.id + '/update')">
                  Edit
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteQuestion(question.id)">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
        <div v-else class="alert alert-warning">No question found</div>
    </div>
  
    `,
  data() {
    return {
      questions: [],
    };
  },
  async mounted() {
    // Fetch questions from the API when the component mounts
    const res = await fetch(
      location.origin + "/api/quiz/" + this.quiz_id + "/question",
      {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      }
    );
    if (res.ok) {
      this.questions = await res.json();
      console.log("Questions retrieved successfully.");
    } else {
      console.error("Failed to retrieve questions.");
    }
  },
  methods: {
    async deleteQuestion(questionId) {
      console.log("For delete method: ", this.quiz_id)
      const res = await fetch(
        location.origin +
          "/api/quiz/" +
          this.quiz_id +
          "/question/" +
          questionId,
        {
          method: "DELETE",
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        console.log("Question deleted successfully.");
        // this.questions = this.questions.filter(q => q.id !== questionId);
        this.$router.go(0);
      } else {
        console.error("Failed to delete question.");
      }
    },
  },
};
