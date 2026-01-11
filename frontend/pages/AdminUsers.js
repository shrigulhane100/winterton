export default {
    name: "AdminUsers",
    template: `
      <div class="container p-4">
        <h1 class="mb-4">All Users</h1>
        
        <div class="mb-3">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search users by name or email" 
            v-model="searchTerm" />
        </div>
        
        <table class="table table-striped table-hover" v-if="filteredAndSortedUsers.length">
          <thead>
            <tr>
              <th @click="sortBy('id')" style="cursor: pointer">User ID ↕️</th>
              <th @click="sortBy('full_name')" style="cursor: pointer">Full Name ↕️</th>
              <th>Email</th>
              <th>Qualification</th>
              <th @click="sortBy('average_marks')" style="cursor: pointer" class="text-primary">
                Average Marks 
                <span v-if="sortKey === 'average_marks'">{{ sortOrder === 'asc' ? '🔼' : '🔽' }}</span>
                <span v-else>↕️</span>
              </th>
              <th @click="sortBy('total_attempts')" style="cursor: pointer">Attempts ↕️</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredAndSortedUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.full_name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.qualification }}</td>
              <td>
                <span class="fw-bold text-primary">
                   {{ user.average_marks !== undefined ? user.average_marks : 0 }}
                </span>
              </td>
              <td>
                <span class="badge rounded-pill bg-info text-dark">
                  {{ user.total_attempts }}
                </span>
              </td>
              <td>
                <span v-if="user.active" class="badge bg-success">Active</span>
                <span v-else class="badge bg-secondary">Inactive</span>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-else class="alert alert-warning">
          No users found.
        </div>
      </div>
    `,
    data() {
      return {
        searchTerm: "",
        users: [],
        sortKey: 'average_marks', 
        sortOrder: 'desc'        
      };
    },
    computed: {
      filteredAndSortedUsers() {
        let result = [...this.users]; // Create a copy to avoid mutating original state
        
        if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase();
          result = result.filter(user => {
            return (user.full_name && user.full_name.toLowerCase().includes(term)) ||
                   (user.email && user.email.toLowerCase().includes(term));
          });
        }

        return result.sort((a, b) => {
          let modifier = this.sortOrder === 'desc' ? -1 : 1;
          let valA = a[this.sortKey] || 0;
          let valB = b[this.sortKey] || 0;

          if (valA < valB) return -1 * modifier;
          if (valA > valB) return 1 * modifier;
          return 0;
        });
      }
    },
    methods: {
      sortBy(key) {
        if (this.sortKey === key) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortKey = key;
          this.sortOrder = 'desc';
        }
      }
    },
    // FIX: mounted should be outside of the methods object
    async mounted() {
      try {
        const res = await fetch(location.origin + '/api/admin/all_users', {
          headers: {
            'Authentication-Token': this.$store.state.auth_token
          }
        });
        if (res.ok) {
          this.users = await res.json();
        } else {
          console.error("Failed to fetch users.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
};


// export default {
//     name: "AdminUsers",
//     template: `
//       <div class="container p-4">
//         <h1 class="mb-4">All Users</h1>
        
//         <!-- Search Bar -->
//         <div class="mb-3">
//           <input 
//             type="text" 
//             class="form-control" 
//             placeholder="Search users by name or email" 
//             v-model="searchTerm" />
//         </div>
        
//         <!-- Users Table -->
//         <table class="table table-striped table-hover" v-if="filteredUsers.length">
//           <thead>

//           <tr>
//               <th @click="sortBy('id')" style="cursor: pointer">User ID ↕️</th>
//               <th @click="sortBy('full_name')" style="cursor: pointer">Full Name ↕️</th>
//               <th>Email</th>
//               <th>Qualification</th>
//               <th @click="sortBy('average_marks')" style="cursor: pointer" class="text-primary">
//                 Average Marks 
//                 <span v-if="sortKey === 'average_marks'">{{ sortOrder === 'asc' ? '🔼' : '🔽' }}</span>
//                 <span v-else>↕️</span>
//               </th>
//               <th @click="sortBy('total_attempts')" style="cursor: pointer">Attempts ↕️</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr v-for="user in filteredAndSortedUsers" :key="user.id">
//               <td>{{ user.id }}</td>
//               <td>{{ user.full_name }}</td>
//               <td>{{ user.email }}</td>
//               <td>{{ user.qualification }}</td>
//               <td>
//                 <span class="fw-bold text-primary">
//                    {{ user.average_marks !== undefined ? user.average_marks : 0 }}
//                 </span>
//               </td>
//               <td>
//                 <span class="badge rounded-pill bg-info text-dark">
//                   {{ user.total_attempts }}
//                 </span>
//               </td>
//               <td>
//                 <span v-if="user.active" class="badge bg-success">Active</span>
//                 <span v-else class="badge bg-secondary">Inactive</span>
//               </td>
//             </tr>
//           //   <tr>
//           //     <th>User ID</th>
//           //     <th>Full Name</th>
//           //     <th>Email</th>
//           //     <th>Qualification</th>
//           //     <th>Date of Birth</th>
//           //     <th>Average Marks</th>
//           //     <th>Attempts</th>
//           //     <th>Status</th>
//           //   </tr>
//           // </thead>
//           // <tbody>
//           //   <tr v-for="user in filteredUsers" :key="user.id">
//           //     <td>{{ user.id }}</td>
//           //     <td>{{ user.full_name }}</td>
//           //     <td>{{ user.email }}</td>
//           //     <td>{{ user.qualification }}</td>
//           //     <td>{{ user.dob }}</td>
//           //     <td>
//           //       <span class="fw-bold text-primary">
//           //          {{ user.average_marks !== undefined ? user.average_marks : 'N/A' }}
//           //       </span>
//           //     </td>
//           //     <td>
//           //       <span class="badge rounded-pill bg-info text-dark">
//           //         {{ user.total_attempts }}
//           //       </span>
//           //     </td>
//           //     <td>
//           //       <span v-if="user.active" class="badge bg-success">Active</span>
//           //       <span v-else class="badge bg-secondary">Inactive</span>
//           //     </td>
//           //   </tr>
//           // </tbody>
//         // </table>
        
//         <!-- No Users Found -->
//         <div v-else class="alert alert-warning">
//           No users found.
//         </div>
//       </div>
//     `,
//     data() {
//       return {
//         searchTerm: "",
//         users: [],
//         sortKey: 'average_marks', // Default sort key
//         sortOrder: 'desc'        // Default sort order (highest marks first)
//       };
//     },
//     computed: {
//       filteredAndSortedUsers() {
//         // 1. First, Filter the users based on search term
//         let result = this.users;
        
//         if (this.searchTerm) {
//           const term = this.searchTerm.toLowerCase();
//           result = result.filter(user => {
//             return (user.full_name && user.full_name.toLowerCase().includes(term)) ||
//                    (user.email && user.email.toLowerCase().includes(term));
//           });
//         }

//         // 2. Then, Sort the filtered results
//         return result.sort((a, b) => {
//           let modifier = this.sortOrder === 'desc' ? -1 : 1;
//           let valA = a[this.sortKey];
//           let valB = b[this.sortKey];

//           // Handle null/undefined values
//           if (valA === undefined || valA === null) valA = 0;
//           if (valB === undefined || valB === null) valB = 0;

//           if (valA < valB) return -1 * modifier;
//           if (valA > valB) return 1 * modifier;
//           return 0;
//         });
//       }
//       // filteredUsers() {
//       //   if (!this.searchTerm) {
//       //     return this.users;
//       //   }
//       //   const term = this.searchTerm.toLowerCase();
//       //   return this.users.filter(user => {
//       //     return (user.full_name && user.full_name.toLowerCase().includes(term)) ||
//       //            (user.email && user.email.toLowerCase().includes(term));
//       //   });
//       // }
//     },


//     methods: {
//       sortBy(key) {
//         if (this.sortKey === key) {
//           // Toggle order if clicking the same column
//           this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
//         } else {
//           // New column clicked, set it as sort key and default to descending
//           this.sortKey = key;
//           this.sortOrder = 'desc';
//         }
//       },
//       // ... existing mounted() logic to fetch users ...
//       async mounted() {
//       try {
//         const res = await fetch(location.origin + '/api/admin/all_users', {
//           headers: {
//             'Authentication-Token': this.$store.state.auth_token
//           }
//         });
//         if (res.ok) {
//           this.users = await res.json();
//         } else {
//           console.error("Failed to fetch users.");
//         }
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     }
//     },

// };
  
