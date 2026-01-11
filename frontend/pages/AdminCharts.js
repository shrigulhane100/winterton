export default {
  template: `
      <div id="app" class="container my-5">
        <h1 class="text-center mb-4">Admin Dashboard</h1>
        <div class="row">
          <!-- Subject Wise Top Score (Bar Chart) -->
          <div class="col-md-6">
            <h3 class="text-center">Subject Wise Quiz Count</h3>
            <canvas id="topScoreChart" style="height:400px;"></canvas>
          </div>
          <!-- Average Scores per Quiz (Doughnut Chart) -->
          <div class="col-md-6">
            <h3 class="text-center">Average Scores per Quiz</h3>
            <canvas id="userAttemptsChart" style="height:400px;"></canvas>
          </div>
        </div>
      </div>
    `,
  data() {
    return {
      topScoreData: [],
      averageScoreData: [],
    };
  },
  methods: {
    fetchTopScoreData() {
      // Call the QuizPerSubject endpoint
      fetch(location.origin + "/admin/quiz_per_subject", {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.topScoreData = data;
          this.renderTopScoreChart();
        })
        .catch((err) => console.error("Error fetching top score data:", err));
    },
    fetchAverageScoreData() {
      // Call the AvgScoresPerQuiz endpoint
      fetch(location.origin + "/admin/average_scores_per_quiz", {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.averageScoreData = data;
          this.renderAverageScoreChart();
        })
        .catch((err) =>
          console.error("Error fetching average score data:", err)
        );
    },
    renderTopScoreChart() {
      const ctx = document.getElementById("topScoreChart").getContext("2d");
      const labels = this.topScoreData.map((item) => item.subject_name);
      const quizCounts = this.topScoreData.map((item) => item.quiz_count);

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Quiz Count",
              data: quizCounts,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          // Now we maintain the aspect ratio so the chart does not distort after load.
          maintainAspectRatio: true,
          // Explicitly set the aspect ratio (width/height).
          aspectRatio: 2,
          scales: {
            // Use the v3 syntax to configure y-scale
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    renderAverageScoreChart() {
      const ctx = document.getElementById("userAttemptsChart").getContext("2d");
      const labels = this.averageScoreData.map((item) => item.quiz_name);
      const avgScores = this.averageScoreData.map((item) => item.average_score);

      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Average Score",
              data: avgScores,
              backgroundColor: [
                "rgba(255,99,132,0.6)",
                "rgba(54,162,235,0.6)",
                "rgba(255,206,86,0.6)",
                "rgba(75,192,192,0.6)",
                "rgba(153,102,255,0.6)",
                "rgba(255,159,64,0.6)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          // Set an aspect ratio appropriate for a doughnut chart.
          aspectRatio: 1.5,
        },
      });
    },
  },
  created() {
    this.fetchTopScoreData();
    this.fetchAverageScoreData();
  },
};
