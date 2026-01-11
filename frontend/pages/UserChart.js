export default {
  template: `
      <div id="app" class="container my-5">
        <h1 class="text-center mb-4">User Dashboard</h1>
        <div class="row">
          <!-- Subject Wise Score (Bar Chart) -->
          <div class="col-md-6">
            <h3 class="text-center">Subject Wise Average Score</h3>
            <canvas id="subjectScoreChart" style="height:400px;"></canvas>
          </div>
          <!-- Highest Score per Quiz Chart (Bar Chart) -->
          <div class="col-md-6">
            <h3 class="text-center">Highest Score per Quiz</h3>
            <canvas id="quizScoreChart" style="height:400px;"></canvas>
          </div>
        </div>
      </div>
    `,
  data() {
    return {
      subjectScores: [],
      quizScores: [],
    };
  },
  methods: {
    fetchSubjectScores() {
      // Fetch user subject scores from endpoint (average per subject)
      fetch(
        location.origin + `/user/${this.$store.state.user_id}/subject_scores`,
        {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          this.subjectScores = data;
          this.renderSubjectScoreChart();
        })
        .catch((err) => console.error("Error fetching subject scores:", err));
    },
    fetchQuizScores() {
      // Fetch user avg/highest scores per quiz from endpoint
      fetch(
        location.origin +
          `/user/${this.$store.state.user_id}/avg_highest_score`,
        {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          this.quizScores = data;
          this.renderQuizScoreChart();
        })
        .catch((err) => console.error("Error fetching quiz scores:", err));
    },
    renderSubjectScoreChart() {
      const ctx = document.getElementById("subjectScoreChart").getContext("2d");
      const labels = this.subjectScores.map((item) => item.subject_name);
      const avgScores = this.subjectScores.map((item) => item.average_score);
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Average Score",
              data: avgScores,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2,
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    },
    renderQuizScoreChart() {
      const ctx = document.getElementById("quizScoreChart").getContext("2d");
      const labels = this.quizScores.map((item) => item.quiz_name);
      const highestScores = this.quizScores.map((item) => item.highest_score);
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Highest Score",
              data: highestScores,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2,
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    },
  },
  created() {
    this.fetchSubjectScores();
    this.fetchQuizScores();
  },
};
