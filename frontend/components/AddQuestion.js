export default {
    props: ['quiz_id'],
    template: `
    <div class="container p-4">
        <h2 class="mb-4">Add New Question</h2>
        <form @submit.prevent="addQuestion">
        <div class="form-group mb-3">
            <input
            v-model="question_statement"
            class="form-control"
            placeholder="Question Statement"
            required
            />
        </div>
        <div class="form-group mb-3">
            <input
            v-model="option1"
            class="form-control"
            placeholder="Option 1"
            required
            />
        </div>
        <div class="form-group mb-3">
            <input
            v-model="option2"
            class="form-control"
            placeholder="Option 2"
            required
            />
        </div>
        <div class="form-group mb-3">
            <input
            v-model="option3"
            class="form-control"
            placeholder="Option 3"
            required
            />
        </div>
        <div class="form-group mb-3">
            <input
            v-model="option4"
            class="form-control"
            placeholder="Option 4"
            required
            />
        </div>
        <div class="form-group mb-4">
            <label for="correctOption">Correct Option</label>
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
        <button type="submit" class="btn btn-primary">Add Question</button>
        </form>
    </div>
  
    `,
    data() {
        return {
            question_statement: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            question_length: 0,
            correct_option: "",
        };
    },
    mounted(){
        console.log("Received quiz_id:", this.quiz_id);
        if (!this.quiz_id) {
            console.error('Quiz ID is missing');
            return;
        }        
    },
    methods: {
        async addQuestion() {
            const res = await fetch(location.origin + '/api/quiz/' + this.quiz_id + '/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token,
                },
                body: JSON.stringify({
                    quiz_id: this.quiz_id,
                    question_statement: this.question_statement,
                    option1: this.option1,
                    option2: this.option2,
                    option3: this.option3,
                    option4: this.option4,
                    question_length: this.question_length+1,
                    correct_option: this.correct_option,
                }),
            });

            if (res.ok) {
                console.log("Question added successfully.");
                // Clear form fields
                this.question_statement = "";
                this.option1 = "";
                this.option2 = "";
                this.option3 = "";
                this.option4 = "";
                this.correct_option = "";
                this.$router.go(-1); // Navigate back to the previous page
            } else {
                console.error("Error adding question.");
                // Optionally, handle UI error message
            }
        },
    },
};
