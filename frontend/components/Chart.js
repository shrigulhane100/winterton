// export default {
//     name: 'Chart',
//     template: `
//       <div>
//         <canvas ref="chartCanvas"></canvas>
//       </div>
//     `,
//     mounted() {
//         new Chart(this.$refs.chartCanvas, {
//             type: 'bar',
//             data: {
//                 labels: ['January', 'February', 'March', 'April', 'May'],
//                 datasets: [
//                     {
//                         label: 'Sales',
//                         data: [40, 20, 30, 50, 60],
//                         backgroundColor: '#42A5F5',
//                     },
//                 ],
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//             },
//         });
//     }
// };




export default {
    /**
     * Initialize charts on the dashboard using Chart.js.
     * @param {number|string} user_id - The ID of the current user.
     * @param {string} authToken - The authentication token from the store.
     * @returns {object} - The chart instances.
     */
    name: "Chart",
    async initCharts(user_id, authToken) {
      try {
        // Fetch user's score data
        const res = await fetch(
          location.origin + "/api/user/" + user_id + "/score",
          {
            headers: {
              "Authentication-Token": authToken,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch scores");
        }
        const scores = await res.json();
  
        // -------------------------------
        // 1. Performance Trend Chart (Line Chart)
        // -------------------------------
        // Sort scores by timestamp of attempt.
        const sortedScores = scores.sort((a, b) => new Date(a.time_stamp_of_attempt) - new Date(b.time_stamp_of_attempt));
        const performanceLabels = sortedScores.map(score =>
          new Date(score.time_stamp_of_attempt).toLocaleString()
        );
        const performanceData = sortedScores.map(score => score.total_scored);
  
        // -------------------------------
        // 2. Score Distribution per Quiz (Bar Chart)
        // -------------------------------
        // Group scores by quiz (using quiz_name if available or quiz_id)
        const quizScores = {};
        scores.forEach((score) => {
          const quizName = score.quiz_name || "Quiz " + score.quiz_id;
          if (!quizScores[quizName]) {
            quizScores[quizName] = [];
          }
          quizScores[quizName].push(score.total_scored);
        });
        const distributionLabels = [];
        const distributionData = [];
        for (const quiz in quizScores) {
          distributionLabels.push(quiz);
          const scoresArray = quizScores[quiz];
          const avgScore =
            scoresArray.reduce((acc, val) => acc + val, 0) / scoresArray.length;
          distributionData.push(avgScore);
        }
  
        // -------------------------------
        // 3. Quiz Participation by Subject (Doughnut Chart)
        // -------------------------------
        // Group scores by subject (assuming a field subject_name is available).
        const subjectCounts = {};
        scores.forEach((score) => {
          const subject = score.subject_name || "Unknown";
          if (!subjectCounts[subject]) {
            subjectCounts[subject] = 0;
          }
          subjectCounts[subject]++;
        });
        const participationLabels = Object.keys(subjectCounts);
        const participationData = Object.values(subjectCounts);
  
        // Get canvas contexts
        const performanceCtx = document.getElementById("performanceChart").getContext("2d");
        const scoreDistCtx = document.getElementById("scoreDistChart").getContext("2d");
        const participationCtx = document.getElementById("participationChart").getContext("2d");
  
        // Create the Performance Trend Line Chart
        const performanceChart = new Chart(performanceCtx, {
          type: "line",
          data: {
            labels: performanceLabels,
            datasets: [
              {
                label: "Total Score",
                data: performanceData,
                fill: false,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                tension: 0.2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
  
        // Create the Score Distribution Bar Chart
        const scoreDistChart = new Chart(scoreDistCtx, {
          type: "bar",
          data: {
            labels: distributionLabels,
            datasets: [
              {
                label: "Average Score",
                data: distributionData,
                backgroundColor: "rgba(153,102,255,0.6)",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
  
        // Create the Quiz Participation Doughnut Chart
        const participationChart = new Chart(participationCtx, {
          type: "doughnut",
          data: {
            labels: participationLabels,
            datasets: [
              {
                label: "Quiz Count",
                data: participationData,
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
            maintainAspectRatio: false,
          },
        });
  
        // Return chart instances if needed
        return { performanceChart, scoreDistChart, participationChart };
  
      } catch (error) {
        console.error("Error initializing charts:", error);
        return null;
      }
    },
};
  