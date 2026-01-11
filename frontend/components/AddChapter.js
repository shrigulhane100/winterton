export default{
    props: ['id', 'subject_id'],
    template:`

    <div class="container p-4">
        <h2 class="mb-3">Add new Chapter</h2>
        <input v-model="name" placeholder="Chapter Name" class="form-control mb-3" />
        <textarea
            v-model="description"
            placeholder="Chapter Description"
            class="form-control mb-3">
        </textarea>
        <button @click="addChapter" class="btn btn-primary">
            Add Chapter
        </button>
    </div>


    `,

    data() {
        return {
            name: "",
            description: "",
        };
    },
    methods: {
        async addChapter() {
            // const subjectId = this.$route.params.subjectId; // Get the subject_id from the route params
            const res = await fetch(location.origin+'/api/subject/'+ this.id +'/chapter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token,
                },
                body: JSON.stringify({
                    name: this.name,
                    description: this.description,
                }),
            });

            if (res.ok) {
                // Optionally, update your store to reflect the new chapter
                this.name = ''; // Reset the name field
                this.description = ''; // Reset the description field
                this.$router.go(-1); // Go back to the previous page
            } else {
                console.error("Error adding chapter");
                // You could also show an error message in the UI
            }
        },
    },
}

