
export default{
    props: ['chapter_id'],
    template: `
    <div class="container p-4">
        <input v-model="name" placeholder="Quiz Name" class="form-control mb-3">
        <div class="d-flex mb-3">
            <input v-model="hours" type="number" placeholder="Hours" class="form-control" :max="59" min="0">
            <span class="mx-2">:</span>
            <input v-model="minutes" type="number" placeholder="Minutes" class="form-control" :max="59" min="0">
        </div>
        
        
        
        <input type="datetime-local" v-model="date_of_quiz" placeholder="Date of Quiz" class="form-control mb-3">
        <input v-model="remarks" placeholder="Remarks" class="form-control mb-3">
        <button @click="addQuiz" class="btn btn-primary">Add Quiz</button>
    </div>
    `,
    
    data() {
        return {
            name: "",
            time_duration: "",
            hours: "", // For hours input
            minutes: "", // For minutes input
            date_of_quiz: "",
            remarks: ""
        }
    },
    methods:{
        async addQuiz(){
            const time_duration = this.hours*3600+this.minutes*60;


            const res = await fetch(location.origin + '/api/chapter/'+ this.chapter_id + '/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token
                },
                body: JSON.stringify({
                    name: this.name,
                    time_duration: time_duration,
                    date_of_quiz: this.date_of_quiz,
                    remarks: this.remarks
                })
            });
            const result = await res.json();
            if (res.ok){
                console.log("Quiz added:", result);
                console.log(this.chapter_id);
                console.log(this.name, this.time_duration, this.date_of_quiz, this.remarks);
                this.name = '';
                this.time_duration = '';
                this.hours = '';  // Clear hours input
                this.minutes = '';  // Clear minutes input
                this.date_of_quiz = '';
                this.remarks = '';
                this.$router.go(-1);
            } else {
                console.error("Error adding quiz:", result);
        }
    }}
}



// <input v-model="time_duration" placeholder="Time Duration" class="form-control mb-3">