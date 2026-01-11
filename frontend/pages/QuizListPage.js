export default {
  props: ["chapter_id", "quiz_id"],
  template: `
      <div class="p-4">
        <h1>All Quizzes</h1>
        <br>
        <button class="btn btn-primary" @click="$router.push('/chapter/' + chapter_id + '/quiz/add')">Add Quiz</button>
        
        <!-- Search Bar -->
        <div class="mb-3">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search Quizzes" 
            v-model="searchTerm" />
        </div>
        
        <div v-if="quizzes && quizzes.length">
          <div class="jumbotron vertical center">
            <div class="container">
              <div class="row">
                <div class="col-sm-12">
                  <hr><br>
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Chapter ID</th>
                        <th>Quiz name</th>
                        <th>Quiz Info</th>
                        <th>Time Limit(In Seconds)</th>
                        <th>Deadline</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="quiz in filteredQuizzes" :key="quiz.id">
                        <td>{{ quiz.chapter_id }}</td>
                        <td>
                          <p @click="$router.push('/quiz/' + quiz.id + '/question')" style="cursor:pointer">
                            <u>{{ quiz.name }}</u>
                          </p>
                        </td>
                        <td>{{ quiz.remarks }}</td>
                        <td>{{ quiz.time_duration }}</td>
                        
                        <td>{{ quiz.date_of_quiz }}</td>    
                        <td>
                          <div class="btn-group" role="group">
                            <button class="btn btn-primary btn-sm" @click="$router.push('/chapter/' + chapter_id + '/quiz/' + quiz.id + '/update')">Update</button>
                            <button type="button" class="btn btn-info btn-sm" @click="deleteQuiz(quiz.id)">Delete</button>
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
      chapter_name: "",
      quizzes: [],
      searchTerm: "",
    };
  },
  computed: {
    filteredQuizzes() {
      if (!this.searchTerm) {
        return this.quizzes;
      }
      return this.quizzes.filter((quiz) =>
        quiz.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
  },
  async mounted() {
    await this.fetchQuizzes();
  },
  methods: {
    async fetchQuizzes() {
      const res = await fetch(
        location.origin + "/api/chapter/" + this.chapter_id + "/quiz",
        {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        this.quizzes = await res.json();
        console.log(this.quizzes);
        console.log("Quiz retrieved.");
      } else {
        console.log("Quiz not retrieved.");
      }
    },
    deleteQuiz(quizid) {
      console.log("Deleting quiz with id: " + quizid);
      fetch(
        location.origin + "/api/chapter/" + this.chapter_id + "/quiz/" + quizid,
        {
          method: "DELETE",
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      ).then((res) => {
        if (res.ok) {
          console.log("Quiz deleted successfully from frontend");
          // Refresh the list of quizzes by reloading the current route
          this.$router.go(0);
        } else {
          console.error("Failed to delete quiz");
        }
      });
    },
  },
};
