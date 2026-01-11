const Home = {
  template: `<h2>Home</h2>`,
};

import HomePage from "../pages/HomePage.js";
import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
import AdminDash from "../pages/AdminSubject.js";
import SubjectCard from "../components/SubjectCard.js";
import AddSubject from "../components/AddSubject.js";
import AddChapter from "../components/AddChapter.js";
import AddQuiz from "../components/AddQuiz.js";
import QuizListPage from "../pages/QuizListPage.js";
import store from "./store.js";
import UpdateQuiz from "../components/UpdateQuiz.js";
import QuestionPage from "../pages/QuestionPage.js";
import AddQuestion from "../components/AddQuestion.js";
import QuizApp from "../pages/QuizApp.js";
import UserDash from "../pages/UserDash.js";
import UserScore from "../pages/UserScore.js";
import UpdateSubject from "../components/UpdateSubject.js";
import UpdateChapter from "../components/UpdateChapter.js";
import UpdateQuestion from "../components/UpdateQuestion.js";
import AdminUsers from "../pages/AdminUsers.js";
import AdminCharts from "../pages/AdminCharts.js";
import UserChart from "../pages/UserChart.js";


const routes = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },

  {
    path: "/subjects",
    component: AdminDash,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },

  {
    path: "/subjects/add",
    name: "addSubject",
    component: AddSubject,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },

  {
    path: "/subject/:id/chapter",
    component: SubjectCard,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },

  {
    path: "/subject/:id/chapter/add",
    name: "addChapter",
    component: AddChapter,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },

  {
    path: "/chapter/:chapter_id/quiz",
    name: "all_quiz",
    component: QuizListPage,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },

  {
    path: "/chapter/:chapter_id/quiz/add",
    name: "addQuiz",
    component: AddQuiz,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },

  {
    path: "/chapter/:chapter_id/quiz/:id/update",
    component: UpdateQuiz,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },

  // {path: "/scores",
  //     component: QuizScores,
  //     props: true,
  //     meta: {requiresAuth: true, role: "user"}
  // },

  {
    path: "/quiz/:quiz_id/question",
    component: QuestionPage,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },

  {
    path: "/quiz/:quiz_id/question/add",
    component: AddQuestion,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },

  {
    path: "/quizzes",
    component: UserDash,
    props: true,
    meta: { requiresAuth: true, role: "user" },
  },

  {
    path: "/take_quiz/:quiz_id",
    component: QuizApp,
    props: true,
    meta: { requiresAuth: true, role: "user" },
  },

  {
    path: "/user/:user_id/score",
    component: UserScore,
    props: true,
    meta: { requiresAuth: true, role: "user" },
  },

  {
    path: "/user_charts",
    component: UserChart,
    props: true,
    meta: { requiresAuth: true, role: "user" },
  },

  {
    path: "/subject/:id/update",
    component: UpdateSubject,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },

  {
    path: "/subject/:id/chapter/:chapter_id/update",
    component: UpdateChapter,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },

  {
    path: "/quiz/:quiz_id/question/:id/update",
    component: UpdateQuestion,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },

  {
    path: "/admin/all_users",
    component: AdminUsers,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },

  {
    path: "/admin_charts",
    component: AdminCharts,
    props: true,
    meta: { requiresAuth: true, role: "admin" },
  },
];

const router = new VueRouter({
  routes,
});

// navigation guards
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.state.loggedIn) {
      next({ path: "/login" });
    } else if (to.meta.role && to.meta.role != store.state.role) {
      alert("role not authorized");
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
