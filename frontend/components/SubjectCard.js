export default{
    props : ['name', 'description', 'id'],
    name: "SubjectCard",
    template: `
    <div class="jumbotron vertical center my-5">
        <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="mb-3">
                    <h1 class="text-center bg-primary text-white" style="border-radius: 10px;">{{name}}</h1>
                    <p class="text-center">{{description}}</p>

                    <button type="button" class="btn btn-info me-2" @click="$router.push('/subject/'+id+'/update')">Update Subject</button>
                    <button type="button" class="btn btn-info me-2" @click="deleteSubject(id)">Delete Subject</button>
                </div>
                <hr>
                    
                <button type="button"class="btn btn-primary" @click="$router.push('/subject/' + id + '/chapter/add')">Add new Chapter</button>
                <br>
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th>Chapter Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="chapter in chapters" :key="chapter.id" :id="chapter.id">
                        <td><p class="mb-0" @click="$router.push('/chapter/' + chapter.id + '/quiz')"><u>{{ chapter.name }}</u></p></td>
                        <td>{{ chapter.description }}</td>

                        <td>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-info btn-sm me-1" @click="$router.push('/subject/'+chapter.subject_id+'/chapter/'+chapter.id+'/update')"> Update </button>
                            <button type="button" class="btn btn-info btn-sm" @click="deleteChapter(chapter.id)">Delete</button>
                        </div>
                        </td>
                    </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  


    `,
    data(){
        return {
            chapters: []
        }
    },
    async mounted(){
        const res = await fetch(location.origin + '/api/subject/'+ this.id +'/chapter', {
            headers: {
                'Authentication-Token': this.$store.state.auth_token
            }
        });
        if (res.ok){
            this.chapters = await res.json();
            if (this.chapters.id = this.id){
                console.log("Chapter with "+ this.id +": ", this.chapters);
            }
            
        }
        else{
            console.error('Failed to fetch chapters');
        }
    },


    methods: {
        // Method to delete a chapter
        deleteChapter(chapterId) {
    
          fetch(location.origin + '/api/subject/' + this.id + '/chapter/' + chapterId, {
            method: 'DELETE',
            headers: {
              'Authentication-Token': this.$store.state.auth_token
            }
          })
          .then(res => {
            if (res.ok) {
              console.log('Chapter and respective quiz deleted successfully');
              this.$router.go(0); // Reload the page
            } else {
              console.error('Failed to delete chapter');
            }
          })
          .catch(error => {
            console.error('Error deleting chapter:', error);
          });
        },

        deleteSubject(subjectId) {
            console.log("Deleting subject with id: " + subjectId);
            
            fetch(location.origin + '/api/subject/' + subjectId, {
            method: 'DELETE',
            headers: {
                'Authentication-Token': this.$store.state.auth_token
            }
            })
            .then(res => {
            if (res.ok) {
                console.log("Subject deleted successfully");
                // Optionally, navigate away after deletion (e.g., go back to the subjects list)
                this.$router.go(0);  // Assuming you want to redirect to the list of subjects
            } else {
                console.error("Failed to delete subject");
                alert('Error deleting subject');
            }
            })
            .catch(error => {
            console.error("Error during subject deletion:", error);
            alert('Error deleting subject');
            });
        
          },
    }

}
