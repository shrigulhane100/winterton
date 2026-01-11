export default {
    props: ['chapter_id'],
    template: `
      <div class="p-4">
        <h1>All Quizzes</h1>
        <br>
        <div v-if="quizzes.length">
          <div class="jumbotron vertical center">
            <div class="container">
              <div class="row">
                <div class="col-sm-12">
                  <hr><br>
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Chapter ID</th>
                        <th>Quiz Name</th>
                        <th>Time Limit</th>
                        <th>Deadline</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="quiz in quizzes" :key="quiz.id">
                        <td>{{ quiz.chapter_id }}</td>
                        <td>{{ quiz.name }}</td>
                        <td>{{ quiz.time_duration }}</td>
                        <td>{{ quiz.date_of_quiz }}</td>
                        <td>
                          <div class="btn-group" role="group">
                            <button 
                              class="btn btn-primary btn-sm"
                              :disabled="hasQuizExpired(quiz)"
                              @click="startQuiz(quiz)"
                            >
                              Start
                            </button>
                          </div>
                          <div v-if="hasQuizExpired(quiz)" class="mt-2 text-danger">
                            Quiz has expired.
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="alert alert-warning">No quiz found</div>
      </div>
    `,
    data() {
      return {
        quizzes: [],
      };
    },
    async mounted() {
      await this.fetchQuizzes();
    },
    methods: {
      async fetchQuizzes() {
        try {
          const res = await fetch(location.origin + '/api/quizzes', {
            headers: {
              'Authentication-Token': this.$store.state.auth_token,
            },
          });
          if (res.ok) {
            this.quizzes = await res.json();
            console.log(this.quizzes);
            console.log('Quiz retrieved.');
          } else {
            console.log('Quiz not retrieved.');
          }
        } catch (error) {
          console.error("Error fetching quizzes:", error);
        }
      },
      hasQuizExpired(quiz) {
        // Assume quiz.date_of_quiz is a parseable date string.
        const deadline = new Date(quiz.date_of_quiz);
        const now = new Date();
        return now > deadline;
      },
      startQuiz(quiz) {
        // Only route if the quiz deadline has not passed.
        if (!this.hasQuizExpired(quiz)) {
          this.$router.push('/take_quiz/' + quiz.id);
        }
      },
      async deleteQuiz(quizid) {
        console.log('Deleting quiz with id: ' + quizid);
        const res = await fetch(location.origin + '/api/chapter/' + this.chapter_id + '/quiz/' + quizid, {
          method: 'DELETE',
          headers: {
            'Authentication-Token': this.$store.state.auth_token,
          },
        });
        if (res.ok) {
          console.log('Quiz deleted successfully from frontend');
          await this.fetchQuizzes(); // Refresh the list of quizzes
        } else {
          console.error('Failed to delete quiz');
        }
      }
    },
};
  