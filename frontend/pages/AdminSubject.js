import SubjectCard from "../components/SubjectCard.js";

export default{
    template: `
    <div class="p-4">
        <h1>All subjects</h1>
        <button class="btn btn-primary" @click="$router.push('/subjects/add')">Add Subject</button>
        <hr>
        <div v-if="subjects">
            <SubjectCard 
                v-for="subject in subjects" 
                :key="subject.id" 
                :id="subject.id"
                :name="subject.name" 
                :description="subject.description" />
        </div>
        <div v-else class="alert alert-warning">No subjects found</div>
    </div>
    `,
        data() {
        return {
            name: '',
            description: '',
            subjects: []
        };
    },
    methods: {
        async addSubject() {
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
                const newSubject = await res.json();
                this.subjects.push(newSubject);
                this.name = ''; // Reset name field
                this.description = ''; // Reset description field
            } else {
                // Handle error
                console.error("Error adding subject");
            }
        }
    },
    async mounted(){
        const res = await fetch(location.origin + '/api/subjects', {
            headers: {
                'Authentication-Token': this.$store.state.auth_token
            }
        })
        console.log('SubjectListPage: '+ this.$store.state.loggedIn)
        if (res.ok){
            this.subjects = await res.json();
        }
        
    },
    components: {
        SubjectCard,
    }
}










// import SubjectCard from "../components/SubjectCard.js";

// export default {
//   template: `
//     <div class="p-4">
//       <h1>All subjects</h1>
      
//       <!-- Search Bar -->
//       <div class="mb-3">
//         <input 
//           type="text" 
//           class="form-control" 
//           placeholder="Search subjects" 
//           v-model="searchTerm" />
//       </div>
      
//       <button class="btn btn-primary mb-3" @click="$router.push('/subjects/add')">Add Subject</button>
//       <hr>
//       <div v-if="filteredSubjects && filteredSubjects.length">
//         <SubjectCard 
//           v-for="subject in filteredSubjects" 
//           :key="subject.id" 
//           :id="subject.id"
//           :name="subject.name" 
//           :description="subject.description" />
//       </div>
//       <div v-else class="alert alert-warning">No subjects found</div>
//     </div>
//   `,
//   data() {
//     return {
//       name: '',
//       description: '',
//       subjects: [],
//       searchTerm: '' // Holds the current search query
//     };
//   },
//   computed: {
//     filteredSubjects() {
//       // Return all subjects if no search term provided
//       if (!this.searchTerm) {
//         return this.subjects;
//       }
//       // Otherwise filter subjects by name (case-insensitive)
//       return this.subjects.filter(subject =>
//         subject.name.toLowerCase().includes(this.searchTerm.toLowerCase())
//       );
//     }
//   },
//   methods: {
//     async addSubject() {
//       const res = await fetch(location.origin + '/api/subjects', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authentication-Token': this.$store.state.auth_token
//         },
//         body: JSON.stringify({
//           name: this.name,
//           description: this.description
//         })
//       });
  
//       if (res.ok) {
//         const newSubject = await res.json();
//         this.subjects.push(newSubject);
//         this.name = ''; // Reset name field
//         this.description = ''; // Reset description field
//       } else {
//         console.error("Error adding subject");
//       }
//     }
//   },
//   async mounted() {
//     const res = await fetch(location.origin + '/api/subjects', {
//       headers: {
//         'Authentication-Token': this.$store.state.auth_token
//       }
//     });
//     if (res.ok) {
//       this.subjects = await res.json();
//     }
//   },
//   components: {
//     SubjectCard,
//   }
// };
