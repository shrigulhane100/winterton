

export default {
  props: ['user_id'],
  template: `
    <div class="container p-4">
      <h1 class="mb-4">Your Scores</h1>
      
      <!-- Download CSV Button -->
      <div class="mb-3">
        <button 
          class="btn btn-success"
          @click="downloadCSV"
          :disabled="isDownloading">
          {{ isDownloading ? 'Generating CSV...' : 'Download Scores as CSV' }}
        </button>
      </div>
      
      <div v-if="scores.length">
        <table class="table table-hover">
          <thead class="table-dark">
            <tr>
              <th>Quiz ID</th>
              <th>Quiz Name</th>
              <th>Attempt Time</th>
              <th>Total Scored</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="score in scores" :key="score.id">
              <td>{{ score.quiz_id }}</td>
              <td>{{ score.quiz_name }}</td>
              <td>{{ score.time_stamp_of_attempt }}</td>
              <td>{{ score.total_scored }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="alert alert-warning">
        No score records available.
      </div>
    </div>
  `,
  data() {
    return {
      scores: [],
      isDownloading: false // Tracks whether the CSV is being generated
    };
  },
  methods: {
    async fetchScores() {
      try {
        const res = await fetch(
          location.origin + "/api/user/" + this.user_id + "/score",
          {
            headers: {
              "Authentication-Token": this.$store.state.auth_token,
            },
          }
        );

        if (res.ok) {
          this.scores = await res.json();
        } else {
          console.error("Failed to retrieve scores.");
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    },
    async downloadCSV() {
      try {
        // Start the Celery task to create the CSV
        this.isDownloading = true;
        const taskRes = await fetch(location.origin + '/create_csv', {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        });
        
        if (taskRes.ok) {
          const taskData = await taskRes.json();
          const taskId = taskData.result;

          // Poll for the CSV task status and download once ready
          const interval = setInterval(async () => {
            const statusRes = await fetch(location.origin + '/get_celery_data/' + taskId, {
              headers: {
                "Authentication-Token": this.$store.state.auth_token,
              },
            });

            if (statusRes.ok) {
              const blob = await statusRes.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'user_scores.csv');
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);

              clearInterval(interval);
              this.isDownloading = false;
            } else {
              const statusData = await statusRes.json();
              if (statusData.message === 'Task not ready') {
                console.log('CSV generation in progress...');
              } else {
                console.error('Error retrieving CSV:', statusData);
                clearInterval(interval);
                this.isDownloading = false;
              }
            }
          }, 2000); // Poll every 2 seconds
        } else {
          console.error("Failed to start CSV generation task.");
          this.isDownloading = false;
        }
      } catch (error) {
        console.error("Error generating or downloading CSV:", error);
        this.isDownloading = false;
      }
    }
  },
  async mounted() {
    await this.fetchScores();
  },
};




// export default {
//   props: ['user_id'],
//   template: `
//     <div class="container p-4">
//       <h1 class="mb-4">Your Scores</h1>
      
//       <!-- Download CSV Button -->
//       <div class="mb-3">
//         <button 
//           class="btn btn-success"
//           @click="downloadCSV"
//           :disabled="isDownloading">
//           {{ isDownloading ? 'Generating CSV...' : 'Download Scores as CSV' }}
//         </button>
//       </div>
      
//       <div v-if="scores.length">
//         <table class="table table-hover">
//           <thead class="table-dark">
//             <tr>
//               <th>Quiz ID</th>
//               <th>Attempt Time</th>
//               <th>Total Scored</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr v-for="score in scores" :key="score.id">
//               <td>{{ score.quiz_id }}</td>
//               <td>{{ score.time_stamp_of_attempt }}</td>
//               <td>{{ score.total_scored }}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//       <div v-else class="alert alert-warning">
//         No score records available.
//       </div>
//     </div>
//   `,
//   data() {
//     return {
//       scores: [],
//       isDownloading: false  // Indicator for when CSV generation is in progress
//     };
//   },
//   methods: {
//     async fetchScores() {
//       try {
//         const res = await fetch(location.origin + "/api/user/" + this.user_id + "/score", {
//           headers: {
//             "Authentication-Token": this.$store.state.auth_token,
//           },
//         });
//         if (res.ok) {
//           this.scores = await res.json();
//         } else {
//           console.error("Failed to retrieve scores.");
//         }
//       } catch (error) {
//         console.error("Error fetching scores:", error);
//       }
//     },
//     async downloadCSV() {
//       try {
//         // Set the loading state to disable the button
//         this.isDownloading = true;
//         // Trigger the CSV generation for current user by calling our updated route.
//         const taskRes = await fetch(location.origin + '/create_csv/' + this.user_id, {
//           headers: {
//             "Authentication-Token": this.$store.state.auth_token,
//           },
//         });
        
//         if (taskRes.ok) {
//           const taskData = await taskRes.json();
//           const taskId = taskData.result;
          
//           // Poll every 2 seconds until the CSV task is complete
//           const interval = setInterval(async () => {
//             const statusRes = await fetch(location.origin + '/get_celery_data/' + taskId, {
//               headers: {
//                 "Authentication-Token": this.$store.state.auth_token,
//               },
//             });
            
//             if (statusRes.ok) {
//               // If statusRes is OK, then the CSV is ready; retrieve the file as a Blob.
//               const blob = await statusRes.blob();
              
//               // Create a temporary link for download
//               const url = window.URL.createObjectURL(blob);
//               const link = document.createElement('a');
//               link.href = url;
//               link.setAttribute('download', 'UserScore_' + this.user_id + '.csv');
//               document.body.appendChild(link);
//               link.click();
//               link.remove();
//               window.URL.revokeObjectURL(url);
              
//               clearInterval(interval);
//               this.isDownloading = false;
//             } else {
//               // Check the JSON response; if the task is not ready, simply log status.
//               const statusData = await statusRes.json();
//               if (statusData.message === 'Task not ready') {
//                 console.log('CSV generation in progress...');
//               } else {
//                 console.error('Error retrieving CSV:', statusData);
//                 clearInterval(interval);
//                 this.isDownloading = false;
//               }
//             }
//           }, 2000); // Poll every 2 seconds.
//         } else {
//           console.error("Failed to start CSV generation task.");
//           this.isDownloading = false;
//         }
//       } catch (error) {
//         console.error("Error generating or downloading CSV:", error);
//         this.isDownloading = false;
//       }
//     }
//   },
//   async mounted() {
//     await this.fetchScores();
//   },
// };
