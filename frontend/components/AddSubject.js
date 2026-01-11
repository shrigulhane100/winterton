export default{
    template: `
    <div class="container p-4">
        <h2>Add new Subject</h2>
        <input v-model="name"
        placeholder="Subject Name"
        class="form-control mb-3">

        <textarea v-model="description"
        placeholder="Subject Description"
        class="form-control mb-3"></textarea>
        
        <button @click="addSubjects" class="btn btn-primary">
        Add Subject
        </button>
    </div>
  
    `,
    data() {
        return {
            name: "",
            description: "",
        }
    },
    methods: {
        async addSubjects() {
            const res = await fetch(location.origin + '/api/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token
                },
                body: JSON.stringify({
                    name: this.name,
                    description: this.description
                })
            });
    
            if (res.ok) {
                // const newSubject = await res.json();
                // this.$store.commit('add_to_subjects', newSubject); // Add new subject to the list of subjects in the store
                this.name = ''; // Reset name field
                this.description = ''; // Reset description field
                this.$router.go(-1); // Redirect to the subjects page
            } else {
                // Handle error
                console.error("Error adding subject");
            }
        }
    }
}