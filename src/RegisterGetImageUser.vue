
<template>
<!-- Nav Bar -->
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

<!--  Error Flag  -->
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

<!--   Register Account/Set Image User   -->
  <h1 align="center">
    Welcome
  </h1>
  <br/>
  <br/>
  <div id="register" align="center">
    <el-card class="box-card">
      <template #header>
        <h3>Create an account</h3>
      </template>
      <div class="card-body" style="padding-left:0px">
        <form v-on:submit=registerUser() style="width: 50%; margin:0% 25%" :label-position="labelPosition">
          <form action="http://localhost:4941/api/v1/users/login">
            <label> Select a profile picture (optional): </label>
            <input type="file" @change="getImage($event)" name="myfile">
          </form>
          <br/>
          <br/>
          <el-input placeholder="Firstname" prop="firstname" v-model="firstname" clearable></el-input>
          <br/>
          <br/>
          <el-input placeholder="Lastname" prop="lastname" v-model="lastname" clearable></el-input>
          <br/>
          <br/>
          <el-input placeholder="Email" prop="email" v-model="email" clearable></el-input>
          <br/>
          <br/>
          <el-input placeholder="Password" prop="password" v-model="password" show-password></el-input>
          <br/>
          <br/>
        </form>
        <div v-if="login_id">
          <el-button type="primary" round plain disabled v-on:click="registerUser(firstname, lastname, email, password)">
            Create
          </el-button>
        </div>
        <div v-else>
          <el-button type="primary" round plain v-on:click="registerUser(firstname, lastname, email, password)">
            Create
          </el-button>
          <br/>
          <br/>
          <router-link :to="{ name: 'login' }" tag="button">
            Already have an account? Click here to login
          </router-link>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router'

export default {
  name: 'RegisterGetImageUser',
  setup() {
    const error = ref("");
    const errorFlag = ref(false);
    const router = useRouter();
    const auth_token = ref("");
    const user_id = ref("");
    const file = ref("");
    const login_id = ref("");

    const loggedIn = () => {
      login_id.value = localStorage.getItem("logged_id");
    }
    onMounted(loggedIn);

    const registerUser = (firstname, lastname, email, password) => {
      if (password.length < 8) {
        alert('Password must be atleast 8 character long')
      } else {
        axios.post('http://localhost:4941/api/v1/users/register', {
          "email": email,
          "password": password,
          "firstName": firstname,
          "lastName": lastname
        })
            .then(async () => {
              await axios.post('http://localhost:4941/api/v1/users/login', {
                "email": email,
                "password": password
              })
                  .then((response)=>{
                    localStorage.setItem("auth_token", response.data.token);
                    localStorage.setItem("logged_id", response.data.userId);
                    user_id.value = response.data.userId;
                  })
              if (file.value != '') {
                uploadProfilePic();
              }
              console.log(file.value);
              await router.push('/events');
            }, (err) => {
              error.value = err;
              errorFlag.value = true;
            });
      }
    }

    const getImage = (event) => {
      file.value = event.target.files[0];
    }

    const uploadProfilePic = () => {
      axios.put('http://localhost:4941/api/v1/users/' + user_id.value + '/image', file.value, {
        headers: {'Content-Type': file.value.type, 'X-Authorization': localStorage.getItem("auth_token")}
      }, (err) => {
        error.value = err;
        errorFlag.value = true;
      })

    }

    return {

      error: error,
      errorFlag: errorFlag,
      firstname: ref(""),
      lastname: ref(""),
      email: ref(""),
      password: ref(""),
      auth_token: auth_token,
      labelPosition: 'left',
      file: file,
      login_id: login_id,
      user_id: user_id,
      registerUser: registerUser,
      getImage: getImage,
      uploadProfilePic: uploadProfilePic,
      loggedIn: loggedIn,

    }
  }
}
</script>

<style>
.box-card {
  width: 1000px;
  text-align: center;
}
</style>