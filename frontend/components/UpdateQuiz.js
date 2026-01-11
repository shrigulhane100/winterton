export default {
    props: ['chapter_id', 'id'],
    template: `
      <div class="container p-4">
        <h1>Edit Quiz</h1>
        <div class="form-group mb-3">
          <input v-model="name" placeholder="Quiz Name" class="form-control mb-3">
        </div>
        <div class="d-flex mb-3">
          <input v-model="hours" type="number" placeholder="Hours" class="form-control" :max="59" min="0">
          <span class="mx-2">:</span>
          <input v-model="minutes" type="number" placeholder="Minutes" class="form-control" :max="59" min="0">
        </div>
        <div class="mb-3">
          <input type="datetime-local" v-model="date_of_quiz" placeholder="Date of Quiz" class="form-control mb-3">
        </div>
        <div class="mb-3">
          <input v-model="remarks" placeholder="Remarks" class="form-control mb-3">
        </div>
        <button @click="updateQuiz" class="btn btn-primary">Update Quiz</button>
      </div>
    `,
    data() {
      return {
        name: "",
        hours: "",
        minutes: "",
        time_duration: "",
        date_of_quiz: "",
        remarks: ""
      }
    },
    mounted() {
      this.fetchQuiz();
    },
    methods: {
      async fetchQuiz() {
        try {
          // Use the GET endpoint: /chapter/<chapter_id>/quiz/<quiz_id>
          const res = await fetch(
            location.origin + '/api/chapter/' + this.chapter_id + '/quiz/' + this.id,
            {
              headers: {
                'Authentication-Token': this.$store.state.auth_token
              }
            }
          );
          if (res.ok) {
            const data = await res.json();
            console.log("Fetched quiz:", data);
            this.name = data.name;
            this.date_of_quiz = this.formatToDatetimeLocal(data.date_of_quiz);;
            this.remarks = data.remarks;
            // this.time_duration = data.time_duration;
            // Convert time_duration from seconds into hours and minutes.
            const totalSeconds = parseInt(data.time_duration, 10);
            this.hours = Math.floor(totalSeconds / 3600);
            this.minutes = Math.floor((totalSeconds % 3600) / 60);
          } else {
            console.error("Failed to fetch quiz details");
          }
        } catch (error) {
          console.error("Error fetching quiz details:", error);
        }
      },
      async updateQuiz() {
        // Calculate time_duration (in seconds) from the hours and minutes fields.
        const time_duration = Number(this.hours) * 3600 + Number(this.minutes) * 60;
        try {
          // POST updated quiz details to the endpoint.
          const res = await fetch(
            location.origin + '/api/chapter/' + this.chapter_id + '/quiz/' + this.id,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.$store.state.auth_token
              },
              body: JSON.stringify({
                name: this.name,
                date_of_quiz: this.date_of_quiz,
                time_duration: time_duration,
                remarks: this.remarks
              })
            }
          );
          const result = await res.json();
          if (res.ok) {
            console.log("Quiz updated:", result);
            this.$router.go(-1);
          } else {
            console.error("Error updating quiz:", result);
          }
        } catch (error) {
          console.error("Error updating quiz:", error);
        }
      },


    formatToDatetimeLocal(dateStr) {
        // Create a Date object from the incoming string.
        const date = new Date(dateStr);
      
        // Pad month, day, hours, and minutes to ensure two digits.
        const pad = (num) => (num < 10 ? '0' + num : num);
      
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // Months are zero-indexed.
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
      
        // Return the formatted string
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
      
    }
    
};
  