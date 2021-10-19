<template>
<!--  Nav Bar  -->
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <div class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="nav-link">
            <router-link :to="{ name: 'home' }">Register</router-link>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link">
            <router-link :to="{ name: 'login' }">Login</router-link>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link">
            <router-link :to="{ name: 'events' }">Home/Events</router-link>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link">
            <router-link :to="{ name: 'profile' }">Profile</router-link>
          </a>
        </li>
      </ul>
    </div>
  </nav>

<!--   Error Flag  -->
  <div>
    <div v-if="errorFlag">
      <el-alert
          title="Whoops! Something went wrong."
          type="error"
          effect="dark">
        <span>Error: {{error}}</span>
      </el-alert>
    </div>
  </div>
  <br/>
  <br/>

<!--  Login Account  -->
  <h1 align="center">
    Welcome
  </h1>
  <br/>
  <br/>
  <div id="login" align="center">
    <el-card class="box-card">
      <template #header>
        <h2>Login</h2>
      </template>
      <div class="card-body" style="padding-left:0px">
        <form style="width: 80%; margin:0% 12%">
          <el-input placeholder="Email" prop="email" v-model="email" clearable></el-input>
          <br/>
          <br/>
          <el-input placeholder="Password" prop="password" v-model="password" show-password></el-input>
          <br/>
          <br/>
          <div v-if="login_id">
            <el-button disabled type="primary">
              Login
            </el-button>
          </div>
          <div v-else>
            <el-button type="primary" round plain v-on:click="loginUser(email, password)">
              Login
            </el-button>
          </div>
        </form>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'

export default {
  name: "Login",
  setup(){
    const error = ref("");
    const errorFlag = ref(false);
    const success = ref("");
    const successFlag = ref(false);
    const dialogVisible = ref(false);
    const router = useRouter();
    const login_id = ref(null);

    const loggedIn = () => {
      login_id.value = localStorage.getItem("logged_id");
    }
    onMounted(loggedIn);

    const loginUser = (email, password) => {
      axios.post('http://localhost:4941/api/v1/users/login', {
        "email": email,
        "password": password
      })
          .then((response) => {
            alert('Login Successful');
            localStorage.setItem("auth_token", response.data.token);
            localStorage.setItem("logged_id", response.data.userId);
            router.push('/events');
          }, () => {
            error.value = 'Need to register first';
            errorFlag.value = true;
          });
    }
    return {
      error: error,
      errorFlag: errorFlag,
      success: success,
      successFlag: successFlag,
      dialogVisible: dialogVisible,
      email: ref(""),
      password: ref(""),
      login_id: login_id,
      loginUser: loginUser,
      loggedIn: loggedIn,
    }

  }
}
</script>

<style>
.box-card {
  width: 950px;
  text-align: center;
}
</style>