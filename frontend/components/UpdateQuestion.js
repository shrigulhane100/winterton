export default {
    props: ['quiz_id', 'id'],
    template: `
      <div class="container p-4">
        <h1>Edit Question</h1>
        <form @submit.prevent="updateQuestion">
          <div class="form-group mb-3">
            <input
              v-model="question_statement"
              placeholder="Question Statement"
              class="form-control">
          </div>
          <div class="form-group mb-3">
            <input
              v-model="option1"
              placeholder="Option 1"
              class="form-control">
          </div>
          <div class="form-group mb-3">
            <input
              v-model="option2"
              placeholder="Option 2"
              class="form-control">
          </div>
          <div class="form-group mb-3">
            <input
              v-model="option3"
              placeholder="Option 3"
              class="form-control">
          </div>
          <div class="form-group mb-3">
            <input
              v-model="option4"
              placeholder="Option 4"
              class="form-control">
          </div>
          <div class="mb-3">
                <label for="correctOption" class="form-label">Correct Option</label>
                <select
                    id="correctOption"
                    v-model="correct_option"
                    class="form-select"
                    required>
                    <option value="" disabled>Select Correct Option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                    <option value="option4">Option 4</option>
                </select>
            </div>
        
          <button type="submit" class="btn btn-primary">Update Question</button>
        </form>
      </div>
    `,
    data() {
      return {
        // These properties will bind to the form inputs.
        question_statement: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correct_option: ""
      };
    },
    mounted() {
      // When the component is mounted, fetch the question details.
      this.fetchQuestion();
    },
    methods: {
      async fetchQuestion() {
        try {
          // Get all questions for the quiz (using chapter_id as quiz_id)
          const res = await fetch(
            location.origin + '/api/quiz/' + this.quiz_id + '/question/'+ this.id,
            {
              headers: {
                'Authentication-Token': this.$store.state.auth_token
              }
            }
          );
          if (res.ok) {
            const question = await res.json();
            // Find the question with the matching id.
            // const question = questions.find(q => q.id == this.id);
            
            this.question_statement = question.question_statement;
            this.option1 = question.option1;
            this.option2 = question.option2;
            this.option3 = question.option3;
            this.option4 = question.option4;
            this.correct_option = question.correct_option;

          } else {
            console.error("Failed to fetch questions list");
          }
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      },
      async updateQuestion() {
        try {
          const res = await fetch(
            location.origin + '/api/quiz/' + this.quiz_id + '/question/'+ this.id,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.$store.state.auth_token
              },
              body: JSON.stringify({
                id: this.id,
                question_statement: this.question_statement,
                option1: this.option1,
                option2: this.option2,
                option3: this.option3,
                option4: this.option4,
                correct_option: this.correct_option
              })
            }
          );
          const result = await res.json();
          if (res.ok) {
            console.log("Question updated successfully:", result);
            // Redirect to a questions list page or another appropriate route.
            this.$router.go(-1);
          } else {
            console.error("Failed to update question:", result);
          }
        } catch (error) {
          console.error("Error updating question:", error);
        }
      }
    }
};
  