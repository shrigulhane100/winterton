const store = new Vuex.Store({
    // Like data in Vue instance
    state: {
        auth_token: null,
        role: null,
        loggedIn: false,
        user_id: null,
    },
    // Like functions that change the state
    mutations: {
        setUser(state) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    state.auth_token = user.token;
                    state.role = user.role;
                    state.loggedIn = true;
                    state.user_id = user.id;
                } else {
                    state.loggedIn = false;
                }
            } catch {
                console.warn('No user logged in');
                state.loggedIn = false;
            }
        },
        logOut(state) {
            // Clear state variables
            state.auth_token = null;
            state.role = null;
            state.loggedIn = false;
            state.user_id = null;

            // Remove user from localStorage
            localStorage.removeItem('user');
        }
    },
    // Like methods that commit mutations, can be async
    actions: {
        // You can create an action for logout if needed
        logout({ commit }) {
            commit('logOut');  // Commit the logOut mutation
            // Redirection should be handled in the component, not the store
        }
    }
});

store.commit('setUser');  // Set the user when the store is initialized

export default store;










// const store = new Vuex.Store({
//     // like data in Vue instance
//     state: {
//         auth_token : null,
//         role : null,
//         loggedIn : false,
//         user_id : null,

//     },
//     // like function that change state
//     mutations : {
//         setUser(state){
//             try{
//                 if (JSON.parse(localStorage.getItem('user'))){
//                     const user = JSON.parse(localStorage.getItem('user'));
//                     state.auth_token = user.token;
//                     state.role = user.role;
//                     state.loggedIn = true;
//                     state.user_id = user.id;      
//                 } else {
//                         state.loggedIn = false;
//                 }
//             }
//             catch{
//                 console.warn('No user logged in');
//                 state.loggedIn = false;
//             }
//         },
//         logOut(state){
//             state.auth_token = null;
//             state.role = null;
//             state.loggedIn = false;
//             state.user_id = null;
//             localStorage.removeItem('user');
//         }
//     },
//     // like methods that commit mutation can be async
//     action: {

//     },
// })


// store.commit('setUser');
// export default store;
