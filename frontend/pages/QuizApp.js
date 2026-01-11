export default {
  props: ["quiz_id"],
  template: `
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        
        <div v-if="!quizCompleted && questions.length > 0" class="card shadow-sm border-0">
          <div class="card-header bg-white pt-4 border-0">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-primary-soft text-primary px-3 py-2">
                Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
              </span>
              <span :class="['fw-bold', timerSeconds < 10 ? 'text-danger' : 'text-muted']">
                <i class="bi bi-clock me-1"></i> {{ timerDisplay }}
              </span>
            </div>
            <div class="progress" style="height: 8px;">
              <div class="progress-bar bg-primary" role="progressbar" 
                   :style="{ width: ((currentQuestionIndex + 1) / questions.length) * 100 + '%' }"></div>
            </div>
          </div>

          <div class="card-body p-4" v-if="currentQuestion">
            <h4 class="card-title mb-4 fw-bold">{{ currentQuestion.question_statement }}</h4>
            
            <div class="options-list">
              <div v-for="(option, index) in options" :key="index" class="mb-2">
                <input
                  type="radio"
                  class="btn-check"
                  :id="'option' + index"
                  :value="'option' + (index + 1)"
                  v-model="selectedOption"
                  :disabled="answerSubmitted"
                  autocomplete="off"
                />
                <label class="btn btn-outline-secondary w-100 text-start p-3 option-card" :for="'option' + index">
                  <span class="option-prefix me-2">{{ String.fromCharCode(65 + index) }}.</span>
                  {{ option }}
                </label>
              </div>
            </div>
          </div>

          <div class="card-footer bg-white pb-4 border-0 text-end">
            <button @click="submitAnswer" class="btn btn-primary btn-lg px-5 shadow-sm" 
                    :disabled="selectedOption === null || answerSubmitted">
              {{ answerSubmitted ? 'Processing...' : 'Submit Answer' }}
            </button>

            <div v-if="feedbackMessage" class="mt-3">
              <div :class="['alert py-2', feedbackIsCorrect ? 'alert-success' : 'alert-danger']">
                <i :class="feedbackIsCorrect ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
                {{ feedbackMessage }}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="quizCompleted" class="card shadow-lg border-0 text-center p-5">
          <div class="card-body">
            <div class="result-icon mb-4">
               <span v-if="score / questions.length >= 0.7" class="display-1">🏆</span>
               <span v-else class="display-1">📑</span>
            </div>
            
            <h2 class="fw-bold">Quiz Completed!</h2>
            <p class="text-muted fs-5">Here is how you performed:</p>
            
            <div class="score-display my-4">
              <h1 class="display-4 fw-bold text-primary">{{ score }} / {{ questions.length }}</h1>
              <div class="text-muted">Total Score</div>
            </div>

            <div class="mb-4">
              <h5 v-if="score === questions.length" class="text-success">Perfect Score! 🌟</h5>
              <h5 v-else-if="score / questions.length >= 0.7" class="text-primary">Great Job!</h5>
              <h5 v-else class="text-secondary">Keep practicing!</h5>
            </div>

            <hr class="my-4">

            <div class="d-flex justify-content-center gap-3">
              <button @click="goBack" class="btn btn-outline-primary px-4">Back to Dashboard</button>
              <button @click="restartQuiz" class="btn btn-primary px-4">Try Again</button>
            </div>
          </div>
        </div>

        <div v-else class="text-center p-5">
          <div v-if="questions.length === 0 && !quizCompleted">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">Loading your quiz questions...</p>
          </div>
          <div v-else>
             <p>No questions found for this quiz.</p>
             <button @click="goBack" class="btn btn-secondary">Go Back</button>
          </div>
        </div>

      </div>
    </div>
  </div>
  `,
  data() {
    return {
      quizID: this.quiz_id,
      questions: [],
      quiz: null,
      currentQuestionIndex: 0,
      selectedOption: null,
      timerSeconds: 0,
      timerDisplay: "00:00:00",
      timeInterval: null,
      quizCompleted: false,
      score: 0,
      answerSubmitted: false,
      feedbackMessage: "",
      feedbackIsCorrect: false,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || null;
    },
    options() {
      if (!this.currentQuestion) return [];
      return [
        this.currentQuestion.option1,
        this.currentQuestion.option2,
        this.currentQuestion.option3,
        this.currentQuestion.option4,
      ];
    },
  },
  async mounted() {
    await this.loadQuizData();
  },
  methods: {
    async loadQuizData() {
      try {
        // 1. Fetch Quiz Details
        const res1 = await fetch(`${location.origin}/api/chapter/0/quiz/${this.quizID}`, {
          headers: { "Authentication-Token": this.$store.state.auth_token }
        });
        
        if (res1.ok) {
          this.quiz = await res1.json();
          
          // 2. Fetch Questions
          const res2 = await fetch(`${location.origin}/api/quiz/${this.quizID}/question`, {
            headers: { "Authentication-Token": this.$store.state.auth_token }
          });
          
          if (res2.ok) {
            this.questions = await res2.json();
            
            // 3. Check for saved progress
            const savedData = JSON.parse(localStorage.getItem("quizData_" + this.quizID));
            if (savedData && !this.quizCompleted) {
              this.currentQuestionIndex = savedData.currentQuestionIndex || 0;
              this.score = savedData.score || 0;
              this.startTimer(savedData.timer || this.quiz.time_duration);
            } else {
              this.startTimer(this.quiz.time_duration);
            }
          }
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
      }
    },

    startTimer(seconds) {
      clearInterval(this.timeInterval);
      this.timerSeconds = seconds;
      this.timerDisplay = this.formatTime(this.timerSeconds);

      this.timeInterval = setInterval(() => {
        if (this.timerSeconds <= 0) {
          this.finishQuiz();
        } else {
          this.timerSeconds--;
          this.timerDisplay = this.formatTime(this.timerSeconds);
          this.saveProgress();
        }
      }, 1000);
    },

    formatTime(totalSeconds) {
      const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
      const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
      const s = (totalSeconds % 60).toString().padStart(2, "0");
      return `${h}:${m}:${s}`;
    },

    saveProgress() {
      localStorage.setItem("quizData_" + this.quizID, JSON.stringify({
        timer: this.timerSeconds,
        currentQuestionIndex: this.currentQuestionIndex,
        score: this.score
      }));
    },

    submitAnswer() {
      if (this.answerSubmitted) return;

      const correct = this.currentQuestion.correct_option;
      if (this.selectedOption === correct) {
        this.score++;
        this.feedbackMessage = "Correct!";
        this.feedbackIsCorrect = true;
      } else {
        this.feedbackMessage = `Wrong! Correct answer: ${correct}`;
        this.feedbackIsCorrect = false;
      }

      this.answerSubmitted = true;
      setTimeout(() => this.moveToNextQuestion(), 1500);
    },

    moveToNextQuestion() {
      this.answerSubmitted = false;
      this.feedbackMessage = "";
      this.selectedOption = null;

      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.saveProgress();
      } else {
        this.finishQuiz();
      }
    },

    async finishQuiz() {
      clearInterval(this.timeInterval);
      this.quizCompleted = true;
      localStorage.removeItem("quizData_" + this.quizID);

      try {
        await fetch(`${location.origin}/api/user/${this.$store.state.user_id}/quiz/${this.quizID}/score`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.$store.state.auth_token,
          },
          body: JSON.stringify({ total_scored: this.score }),
        });
      } catch (error) {
        console.error("Score submission failed", error);
      }
    },

    restartQuiz() {
      // Reset all states
      this.quizCompleted = false;
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.selectedOption = null;
      this.answerSubmitted = false;
      this.feedbackMessage = "";
      
      // Clear storage and restart timer
      localStorage.removeItem("quizData_" + this.quizID);
      if (this.quiz) {
        this.startTimer(this.quiz.time_duration);
      }
    },

    goBack() {
      // Ensure this route matches your router config (usually /dashboard or /user-dashboard)
      this.$router.push("/quizzes"); 
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
};



// export default {
//   props: ["quiz_id"],
//   template: `
//   <div class="container my-5">
//   <div class="row justify-content-center">
//     <div class="col-md-8">
      
//       <div v-if="!quizCompleted && questions.length > 0" class="card shadow-sm border-0">
//         <div class="card-header bg-white pt-4 border-0">
//           <div class="d-flex justify-content-between align-items-center mb-2">
//             <span class="badge bg-primary-soft text-primary px-3 py-2">
//               Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
//             </span>
//             <span :class="['fw-bold', timer < 10 ? 'text-danger' : 'text-muted']">
//               <i class="bi bi-clock me-1"></i> {{ timer }}s
//             </span>
//           </div>
//           <div class="progress" style="height: 8px;">
//             <div class="progress-bar bg-primary" role="progressbar" 
//                  :style="{ width: ((currentQuestionIndex + 1) / questions.length) * 100 + '%' }"></div>
//           </div>
//         </div>

//         <div class="card-body p-4">
//           <h4 class="card-title mb-4 fw-bold">{{ currentQuestion.question_statement }}</h4>
          
//           <div class="options-list">
//             <div v-for="(option, index) in options" :key="index" class="mb-2">
//               <input
//                 type="radio"
//                 class="btn-check"
//                 :id="'option' + index"
//                 :value="'option' + (index + 1)"
//                 v-model="selectedOption"
//                 :disabled="answerSubmitted"
//                 autocomplete="off"
//               />
//               <label class="btn btn-outline-secondary w-100 text-start p-3 option-card" :for="'option' + index">
//                 <span class="option-prefix me-2">{{ String.fromCharCode(65 + index) }}.</span>
//                 {{ currentQuestion['option' + (index + 1)] }}
//               </label>
//             </div>
//           </div>
//         </div>

//         <div class="card-footer bg-white pb-4 border-0 text-end">
//           <button @click="submitAnswer" class="btn btn-primary btn-lg px-5 shadow-sm" 
//                   :disabled="selectedOption === null || answerSubmitted">
//             {{ answerSubmitted ? 'Processing...' : 'Submit Answer' }}
//           </button>

//           <div v-if="feedbackMessage" class="mt-3 animate__animated animate__fadeIn">
//             <div :class="['alert py-2', feedbackIsCorrect ? 'alert-success' : 'alert-danger']">
//               <i :class="feedbackIsCorrect ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
//               {{ feedbackMessage }}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div v-else-if="quizCompleted" class="card shadow-lg border-0 text-center p-5">
//         <div class="card-body">
//           <div class="result-icon mb-4">
//              <span v-if="score / questions.length >= 0.7" class="display-1 text-warning">🏆</span>
//              <span v-else class="display-1 text-info">📑</span>
//           </div>
          
//           <h2 class="fw-bold">Quiz Completed!</h2>
//           <p class="text-muted fs-5">Here is how you performed:</p>
          
//           <div class="score-display my-4">
//             <h1 class="display-4 fw-bold text-primary">{{ score }} / {{ questions.length }}</h1>
//             <div class="text-muted">Total Score</div>
//           </div>

//           <div class="mb-4">
//             <h5 v-if="score === questions.length" class="text-success">Perfect Score! You're a Master! 🌟</h5>
//             <h5 v-else-if="score / questions.length >= 0.7" class="text-primary">Great Job! You really know your stuff.</h5>
//             <h5 v-else class="text-secondary">Good effort! Keep practicing to improve.</h5>
//           </div>

//           <hr class="my-4">

//           <div class="d-flex justify-content-center gap-3">
//             <button @click="goBack" class="btn btn-outline-primary px-4">Back to Dashboard</button>
//             <button @click="restartQuiz" class="btn btn-primary px-4">Try Again</button>
//           </div>
//         </div>
//       </div>

//       <div v-else class="text-center p-5">
//         <div class="spinner-border text-primary" role="status"></div>
//         <p class="mt-3 text-muted">Loading your quiz...</p>
//       </div>

//     </div>
//   </div>
// </div>



//   //   <div class="container my-4">
//   //     <!-- Quiz in progress -->
//   //     <div v-if="!quizCompleted && questions.length > 0">
//   //       <h2>{{ this.quiz_name }}</h2>
//   //       <h4 class="mb-3">Time Remaining: {{ timer }}</h4>
//   //       <div class="mb-2">
//   //         <strong>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</strong>
//   //       </div>
//   //       <h3 class="mb-4">{{ currentQuestion.question_statement }}</h3>
//   //       <div class="mb-4">
//   //         <div v-for="(option, index) in options" :key="index" class="form-check">
//   //           <input
//   //             type="radio"
//   //             :id="'option' + index + '_' + currentQuestionIndex"
//   //             name="option"
//   //             :value="'option' + (index + 1)"
//   //             v-model="selectedOption"
//   //             class="form-check-input"
//   //             :disabled="answerSubmitted"
//   //           />
//   //           <label :for="'option' + index + '_' + currentQuestionIndex" class="form-check-label">
//   //             {{ currentQuestion['option' + (index + 1)] }}
//   //           </label>
//   //         </div>
//   //       </div>
//   //       <button @click="submitAnswer" class="btn btn-primary" :disabled="selectedOption === null || answerSubmitted">
//   //         Submit
//   //       </button>
//   //       <!-- Feedback message after submission -->
//   //       <div v-if="feedbackMessage" class="mt-3">
//   //         <div :class="{ 'alert alert-success': feedbackIsCorrect, 'alert alert-danger': !feedbackIsCorrect }">
//   //           {{ feedbackMessage }}
//   //         </div>
//   //       </div>
//   //     </div>
//   //     <!-- Completed Quiz Summary -->
//   //     <div v-else-if="quizCompleted">
//   //     <h2 class="mb-3">Quiz Completed!</h2>
//   //     <p>Your score: {{ score }} / {{ questions.length }}</p>
//   //     <button @click="goBack" class="btn btn-secondary">Back to Quizzes</button>
//   // </div>

//   //     <!-- Loading state -->
//   //     <div v-else>
//   //       <p>No Quiz added...</p>
//   //     </div>
//   //   </div>
//   `,
//   data() {
//     return {
//       quizID: this.quiz_id,
//       questions: [],
//       quiz: [],
//       quiz_name: "",
//       currentQuestionIndex: 0,
//       selectedOption: null,
//       timer: "00:00:00",
//       timeInterval: null,
//       quizCompleted: false,
//       score: 0,
//       answerSubmitted: false,
//       feedbackMessage: "",
//       feedbackIsCorrect: false,
//     };
//   },
//   async mounted() {
//     try {
//       // Load quiz details
//       const res1 = await fetch(
//         location.origin + "/api/chapter/0/quiz/" + this.quizID,
//         {
//           headers: {
//             "Authentication-Token": this.$store.state.auth_token,
//           },
//         }
//       );
//       if (res1.ok) {
//         this.quiz = await res1.json();
//         this.quiz_name = this.quiz.name;

//         // Load persisted data from localStorage
//         const savedData =
//           JSON.parse(localStorage.getItem("quizData_" + this.quizID)) || {};
//         this.currentQuestionIndex = savedData.currentQuestionIndex || 0;
//         const savedTimer = savedData.timer || this.quiz.time_duration;

//         this.startTimer(savedTimer);
//       } else {
//         console.error("Quiz not retrieved.");
//       }
//     } catch {
//       console.error("Could not fetch quiz details.");
//     }

//     try {
//       const res2 = await fetch(
//         location.origin + "/api/quiz/" + this.quizID + "/question",
//         {
//           headers: {
//             "Authentication-Token": this.$store.state.auth_token,
//           },
//         }
//       );

//       if (res2.ok) {
//         this.questions = await res2.json();
//       } else {
//         console.error("Questions not retrieved.");
//       }
//     } catch (error) {
//       console.error("Error fetching questions:", error);
//     }
//   },
//   computed: {
//     currentQuestion() {
//       return this.questions[this.currentQuestionIndex];
//     },
//     options() {
//       return [
//         this.currentQuestion.option1,
//         this.currentQuestion.option2,
//         this.currentQuestion.option3,
//         this.currentQuestion.option4,
//       ];
//     },
//   },
//   methods: {
//     startTimer(remainingTime) {
//       let totalSeconds = remainingTime;

//       this.timer = this.formatTime(totalSeconds);

//       this.timeInterval = setInterval(() => {
//         if (totalSeconds <= 0) {
//           clearInterval(this.timeInterval);
//           this.finishQuiz();
//         } else {
//           totalSeconds--;
//           this.timer = this.formatTime(totalSeconds);

//           // Persist timer and question index in localStorage
//           localStorage.setItem(
//             "quizData_" + this.quizID,
//             JSON.stringify({
//               timer: totalSeconds,
//               currentQuestionIndex: this.currentQuestionIndex,
//             })
//           );
//         }
//       }, 1000);
//     },
//     formatTime(totalSeconds) {
//       const hours = Math.floor(totalSeconds / 3600);
//       const minutes = Math.floor((totalSeconds % 3600) / 60);
//       const seconds = totalSeconds % 60;
//       return `${hours.toString().padStart(2, "0")}:${minutes
//         .toString()
//         .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
//     },
//     submitAnswer() {
//       if (this.answerSubmitted) return;

//       if (this.selectedOption === this.currentQuestion.correct_option) {
//         this.score++;
//         this.feedbackMessage = "Correct!";
//         this.feedbackIsCorrect = true;
//       } else {
//         this.feedbackMessage = `Wrong! The correct answer was ${this.currentQuestion.correct_option}.`;
//         this.feedbackIsCorrect = false;
//       }

//       this.answerSubmitted = true;

//       setTimeout(() => {
//         this.moveToNextQuestion();
//       }, 2000);
//     },
//     moveToNextQuestion() {
//       this.answerSubmitted = false;
//       this.feedbackMessage = "";
//       this.selectedOption = null;

//       if (this.currentQuestionIndex < this.questions.length - 1) {
//         this.currentQuestionIndex++;
//       } else {
//         this.finishQuiz();
//       }
//     },
//     async finishQuiz() {
//       this.quizCompleted = true;
//       clearInterval(this.timeInterval);
//       // localStorage.removeItem("quizData_" + this.quizID); // Clear persisted quiz data
//       try {
//     const response = await fetch(
//       `${location.origin}/api/user/${this.$store.state.user_id}/quiz/${this.quizID}/score`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authentication-Token": this.$store.state.auth_token,
//         },
//         body: JSON.stringify({
//           total_scored: this.score,
//         }),
//       }
//     );

//       if (!response.ok) {
//           console.error("Failed to save score to the server.");
//         } else {
//           console.log("Score saved successfully!");
//         }
//       } catch (error) {
//         console.error("Error connecting to the score API:", error);
//     }
//     },
//     goBack() {
//       this.$router.push("/quizzes");
//     },
//   },
//   beforeDestroy() {
//     clearInterval(this.timeInterval);
//   },
// };
