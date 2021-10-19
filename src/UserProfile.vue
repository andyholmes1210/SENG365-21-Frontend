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
      </ul>
    </div>
    <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <el-popconfirm
              confirmButtonText='Yes'
              confirm-button-type="danger"
              cancelButtonText='No'
              icon="el-icon-info"
              iconColor="red"
              title="Are you sure you want to logout?"
              @confirm="logoutUser()">
            <template #reference>
              <el-button type="danger" plain>Logout</el-button>
            </template>
          </el-popconfirm>
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

<!--   User Profile  -->
  <div id="event" align="center">
    <el-card class="box-card">
      <template #header>
        <h3>User Profile</h3>
      </template>
      <div v-if="userId">
        <div class="card-body" style="padding-left:0px">
          <div id="userimage">
            <img
                onerror="this.onerror=null;this.src='http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'"
                :src="userimage"
                style="width: 300px; height: 300px"
                :fit="fit">
          </div>
          <br/>
          <br/>
          First name: {{ user.firstName }}
          <br/>
          <br/>
          Last name: {{ user.lastName }}
          <br/>
          <br/>
          Email: {{ user.email }}
          <br/>
          <br/>
        </div>
      </div>
      <div v-else>
        <div class="card-body" style="padding-left:0px">
          Need to be login to see this information
          <br/>
          <br/>
        </div>
      </div>
      <div class="event-card-bottom">
        <el-button type="primary" plain align="left">
          <router-link :to="{ name: 'events' }">Back to events</router-link>
        </el-button>

        <div id="edituser">
          <el-button type="primary" class="btn btn-primary" data-toggle="modal" data-target="#edituserModal" plain align="right">Edit</el-button>
          <div class="modal fade" id="edituserModal" tabindex="-1" role="dialog" aria-labelledby="edituserLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="edituserLabel">Edit User</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <el-form label-width="200px" style="width:80%">

                    <el-form-item prop="firstname" label="Firstname: ">
                      <el-input place="Firstname" v-model="firstname" clearable></el-input>
                    </el-form-item>

                    <el-form-item prop="lastname" label="Lastname: ">
                      <el-input place="Lastname" v-model="lastname" clearable></el-input>
                    </el-form-item>

                    <el-form-item prop="email" label="Email: ">
                      <el-input place="Email" v-model="email" clearable></el-input>
                    </el-form-item>

                    <el-form-item prop="currpassword" label="Current Password: ">
                      <el-input place="Current Password" v-model="currpassword" show-password></el-input>
                    </el-form-item>

                    <el-form-item prop="newpassword" label="New Password: ">
                      <el-input place="New Password" v-model="newpassword" show-password></el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="modal-footer">
                  <el-button type="primary" v-on:click="editUser(form)">
                    Edit
                  </el-button>
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'

export default {
  name: 'UserProfile',
  setup() {
    const error = ref("");
    const errorFlag = ref(false);
    const userId = ref(null);
    const user = ref("");
    const userimage = ref(null);
    const router = useRouter();
    const firstname = ref("");
    const lastname = ref("");
    const email = ref("");
    const currpassword = ref("");
    const newpassword = ref("");


    const getUserId = () => {
      userId.value = localStorage.getItem("logged_id");
      getUser(userId.value);
      getUserImage(userId.value);
    }
    onMounted(getUserId);

    const getUser = (userId) => {
      axios.get('http://localhost:4941/api/v1/users/' + userId, {headers: {'X-Authorization': localStorage.getItem("auth_token")}})
          .then((response) => {
            user.value = response.data;
          }, () => {
            error.value = 'Need to be login/registered to see this information';
            errorFlag.value = true;
          })
    }

    const getUserImage = (userId) => {
      userimage.value = 'http://localhost:4941/api/v1/users/' + userId + '/image'
    }


    const logoutUser = () => {
      axios.post('http://localhost:4941/api/v1/users/logout', {}, {headers: {'X-Authorization': localStorage.getItem("auth_token")}})
          .then(() => {
            localStorage.clear("auth_token");
            router.push('/login');
          }, () => {

            error.value = 'You need to be logged in first.';
            errorFlag.value = true;
          });
    }


    return {
      error: error,
      errorFlag: errorFlag,
      userId: userId,
      userimage: userimage,
      user: user,
      firstname: firstname,
      lastname: lastname,
      email: email,
      currpassword: currpassword,
      newpassword: newpassword,
      getUserId: getUserId,
      getUser: getUser,
      getUserImage: getUserImage,
      logoutUser: logoutUser,
    }
  },
}
</script>

<style>
.box-card {
  width: 550px;
  align-items: center;
}
.event-card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>