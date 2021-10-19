<template>

<!--  Nav bar -->
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

<!--  Error flag -->
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


<!-- Viewing Single Event -->
  <div v-if="$route.params.eventId">
    <br/>
    <br/>
    <h1 align="center">
      Event
    </h1>
    <div id="event" align="center">
      <el-card class="box-card">
        <template #header>
          <img
              onerror="this.onerror=null;this.src='https://graciefernandina.com/wp-content/uploads/2017/04/default-image.jpg'"
              :src="'http://localhost:4941/api/v1/events/' + eventdetails.id + '/image'"
              style="width: 250px; height: 250px"
              :fit="fit">
          <h3>{{ eventdetails.title }}</h3>
        </template>
        <div class="card-body" style="width: 100%">
          ID : {{ eventdetails.id }}<br/><br/>
          <el-image
              onerror="this.onerror=null;this.src='http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'"
              :src="'http://localhost:4941/api/v1/users/' + eventdetails.organizerId + '/image'"
              style="width: 80px; height: 80px"
              :fit="fit"></el-image><br/>
          Organizer : {{ eventdetails.organizerFirstName }} {{ eventdetails.organizerLastName }}<br/><br/>
          Description : {{ eventdetails.description }}<br/><br/>
          Date : {{ eventdetails.date }}<br/><br/>
          Number of Attendees : {{ eventdetails.attendeeCount }}<br/><br/>
          Capacity : {{ eventdetails.capacity }}<br/><br/>
          <div v-if="eventdetails.venue == null">
            Venue : n/a<br/><br/>
          </div>
          <div v-else>
            Venue : {{ eventdetails.venue }}<br/><br/>
          </div>
          Categories : {{ eventdetails.categories }}<br/><br/>
          <div v-if="eventdetails.fee == 0.00">
            Fee : Free<br/><br/>
          </div>
          <div v-else>
            Fee : ${{ eventdetails.fee }}<br/><br/>
          </div>
          <div v-if="eventdetails.url == null">
            Url : n/a<br/><br/>
          </div>
          <div v-else>
            Url : {{ eventdetails.url }}<br/><br/>
          </div>
        </div>
        <div class="event-card-bottom">
          <el-button type="primary" plain align="left">
            <router-link :to="{ name: 'events' }">Back to events</router-link>
          </el-button>

          <el-popconfirm
              confirmButtonText='Yes'
              confirm-button-type="danger"
              cancelButtonText='No'
              icon="el-icon-info"
              iconColor="red"
              title="Are you sure you want to Delete?"
              @confirm="deleteEvent(eventdetails.id)">
            <template #reference>
              <el-button type="danger" plain>Delete</el-button>
            </template>
          </el-popconfirm>

<!--  View Attendees -->
          <div id="attendees">
            <el-button type="primary" class="btn btn-primary" data-toggle="modal" data-target="#attendeesModal" plain align="right">View Attendees</el-button>
            <div class="modal fade" id="attendeesModal" tabindex="-1" role="dialog" aria-labelledby="attendeesModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="attendeesModalLabel">Attendees</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <form>
                      <el-table align="center"
                                :data="attendees">
                        <el-table-column
                            prop="attendeeId"
                            label="Profile Picture"
                            width="250">
                          <template v-slot:default="table">
                            <el-image
                                :src="'http://localhost:4941/api/v1/users/' + table.row.attendeeId + '/image'"
                                onerror="this.onerror=null;this.src='https://graciefernandina.com/wp-content/uploads/2017/04/default-image.jpg'"
                                style="width: 150px; height: 150px"
                                :fit="fit"></el-image>
                          </template>
                        </el-table-column>
                        <el-table-column
                            prop="firstName"
                            label="First name"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="lastName"
                            label="Last Name"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="attendeeId"
                            label="Role"
                            width="100">
                          <template v-slot:default="table">
                            <div id="organizerId1" v-if="eventdetails.organizerId === table.row.attendeeId">
                              <l1> Organizer </l1>
                            </div>
                            <div id="organizerId2" v-if="eventdetails.organizerId != table.row.attendeeId">
                              <l1> Attendee </l1>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </form>
                  </div>
                  <div class="modal-footer">
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
  </div>
  <div v-else>
    <br/>
    <br/>
    <h1 align="center">
      Events
    </h1>


<!--   Adding events  -->
    <div v-if="login_id">
      <div id="addevent">
        <el-button type="primary" class="btn btn-primary" data-toggle="modal" data-target="#addeventModal" plain align="right">Add Event</el-button>
        <div class="modal fade" id="addeventModal" tabindex="-1" role="dialog" aria-labelledby="addeventModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="addeventModalLabel">Add Event</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <el-form label-width="200px" style="width: 80%" >

                  <el-form-item prop="title" label="Title:">
                      <el-input placeholder="Title" v-model="form.title" clearable></el-input>
                  </el-form-item>

                  <el-form-item prop="description" label="Description:">
                    <el-input
                        type="textarea"
                        autosize
                        placeholder="Description"
                        v-model="form.description">
                    </el-input>
                  </el-form-item>

                  <el-form-item prop="date" label="Date: ">
                    <el-date-picker
                        v-model="form.date"
                        type="datetime"
                        placeholder="Select date and time">
                    </el-date-picker>
                  </el-form-item>

                  <el-form-item prop="fee" label="Fee: ">
                      <el-input-number v-model="form.fee" :min="0" :step="0.5"></el-input-number>
                  </el-form-item>


                  <el-form-item prop="is_online" label="Online?: ">
                      <el-switch
                          v-model="form.is_online">
                      </el-switch>
                  </el-form-item>

                  <div v-if="form.is_online">

                    <el-form-item prop="url" label="Url: ">
                      <el-input placeholder="URL" v-model="form.url" clearable></el-input>
                    </el-form-item>

                  </div>
                  <div v-else>

                    <el-form-item prop="venue" label="Venue: ">
                      <el-input placeholder="Venue" v-model="form.venue" clearable></el-input>
                    </el-form-item>

                    <el-form-item prop="url" label="(Optional) URL: ">
                      <el-input placeholder="URL" v-model="form.url" clearable></el-input>
                    </el-form-item>

                  </div>


                  <el-form-item prop="category" label="Categories: ">
                    <el-checkbox-group v-model="form.category">
                      <el-checkbox v-for="cat in allcategories" :label="cat.id" :key="cat.name">{{cat.name}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>

                  <el-form-item prop="capacity" label="Capacity: ">
                    <el-input-number v-model="form.capacity" :min="0" :step="1"></el-input-number>
                  </el-form-item>

                  <el-form-item prop="requires_attendance_control" label="Required attendance control?: ">
                    <el-switch
                        v-model="form.requires_attendance_control">
                    </el-switch>
                  </el-form-item>

                </el-form>
              </div>
              <div class="modal-footer">
                <el-button type="button" v-on:click="addEvents(form)">
                  Add
                </el-button>
                <el-button type="info" class="btn btn-secondary" data-dismiss="modal">
                  Close
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div id="addeventreject">
        <el-button type="primary" class="btn btn-primary" data-toggle="modal" data-target="#addeventModal" plain align="right" disabled>
          Add Event
        </el-button>
      </div>
    </div>
    <br/>
    <br/>

<!--    View all Events  -->
    <div id="events" align="center">
      <el-table
          :data="events.filter(events => !search || events.title.toLowerCase().includes(search.toLowerCase()))"
          :default-sortEvent="{prop: 'date', order: 'descending'}"
          :default-sortAttendees="{prop: 'numAcceptedAttendees', order: 'descending'}"
          style="width: 80%">

        <el-table-column
          prop="eventId"
          label="Event Image"
          width="150">
          <template v-slot:default="table">
            <img
              :src="'http://localhost:4941/api/v1/events/' + table.row.eventId + '/image'"
              onerror="this.onerror=null;this.src='https://graciefernandina.com/wp-content/uploads/2017/04/default-image.jpg'"
              style="width: 100px; height: 100px"
              :fit="fit">
          </template>
        </el-table-column>

        <el-table-column
            prop="title"
            label="Title"
            width="250">
        </el-table-column>

        <el-table-column
            prop="date"
            label="Date"
            sortable
            width="200">
        </el-table-column>

        <el-table-column
            align="right"
            prop="categories"
            label="Category"
            width="100">
        </el-table-column>

        <el-table-column
            align="right"
            prop="numAcceptedAttendees"
            label="Number of Attendees"
            sortable
            width="180">
        </el-table-column>


        <el-table-column
            label="Host"
            align="right"
            prop="organizerFirstName"
            width="100">
        </el-table-column>


        <el-table-column
            prop="organizerId"
            label="Host Profile Image"
            width="150">

          <template v-slot:default="table">
            <img
                :src="'http://localhost:4941/api/v1/users/' + table.row.eventId + '/image'"
                onerror="this.onerror=null;this.src='http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'"
                style="width: 150px; height: 150px"
                :fit="fit">
          </template>
        </el-table-column>

        <el-table-column
            align="right">
          <template #header>
            <el-input
                v-model="search"
                size="mini"
                placeholder="Type to search"/>
          </template>
          <template #default="scope">
            <router-link @click="getSearchevent(scope.$index, scope.row)" :to="{name: 'event', params: {eventId: scope.row.eventId}}">View Events</router-link>
          </template>
        </el-table-column>
      </el-table>
      <el-button-group>
        <el-button type="primary" icon="el-icon-arrow-left">Previous Page</el-button>
        <el-button type="primary">Next Page<i class="el-icon-arrow-right el-icon-right"></i></el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import moment from 'moment'

export default {
  name: 'Events',
  setup() {
    const error = ref("");
    const errorFlag = ref(false);
    const success = ref("");
    const successFlag = ref("");
    const events = ref([]);
    const eventdetails = ref([]);
    const search = ref("");
    const router = useRouter();
    const attendees = ref("");
    const login_id = ref(null);
    const allcategories = ref([]);
    const searchevent = ref("");

    const loggedIn = () => {
      login_id.value = localStorage.getItem("logged_id");
    }
    onMounted(loggedIn);

    const getSearchevent = (index, row) => {
      searchevent.value = (index, row);
      searchevent.value = searchevent.value.eventId;
      getSingleEvent(searchevent.value);
    }

    const getAllEvents = () => {
      axios.get('http://localhost:4941/api/v1/events')
          .then((response) => {
            events.value = response.data;
          }, (err) => {
            error.value = err;
            errorFlag.value = true;
          });
    }
    onMounted(getAllEvents)


    const getSingleEvent = (eventId) => {
      axios.get('http://localhost:4941/api/v1/events/' + eventId)
        .then((response) => {
          eventdetails.value = response.data;
          getAllAttendees(eventId);
        }, (err) => {
          error.value = err;
          errorFlag.value = true;
      })
    }

    const getCategory = () => {
      axios.get('http://localhost:4941/api/v1/events/categories')
      .then((response) => {
        allcategories.value = response.data;
      }, (err) =>{
        error.value = err;
        errorFlag.value = true;
      })
    }
    onMounted(getCategory)

    const getAllAttendees = (eventId) => {
      axios.get('http://localhost:4941/api/v1/events/' + eventId + '/attendees')
      .then((response) => {
        attendees.value = response.data;
      }, (err) => {
        error.value = err;
        errorFlag.value = true;
      })
    }

    const addEvents = (form) => {
      axios.post('http://localhost:4941/api/v1/events', {
            'title': form.title,
            'description': form.description,
            'date': moment(String(form.date)).format("YYYY-MM-DD HH:MM:SS"),
            'fee': form.fee,
            'isOnline': form.is_online,
            'url': form.url,
            'venue': form.venue,
            'categoryIds': Object.values(form.category),
            'capacity': form.capacity,
            'requiresAttendanceControl': form.requires_attendance_control},
          {headers: {'X-Authorization' : localStorage.getItem("auth_token")}})
        .then(() => {
          alert('Added Event');
          location.reload();
        }, (err) => {
          console.log(form.category);
          error.value = err;
          errorFlag.value = true;
        });
    }

    const deleteEvent = (eventId) => {
      axios.delete('http://localhost:4941/api/v1/events/' + eventId, {headers: {'X-Authorization' : localStorage.getItem("auth_token")}})
      .then(() => {
        for (let i = 0; i < events.value.length; i++) {
          if (eventId == events.value[i].eventId) {
            events.value.splice(i, 1);
          }
        }
        router.push('/events');
      }, () => {
        error.value = 'You do not have permission ot delete this Event';
        errorFlag.value = true;
      })
    }

    const logoutUser = () => {
      axios.post('http://localhost:4941/api/v1/users/logout', {}, {headers: {'X-Authorization' : localStorage.getItem("auth_token")}})
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
      events: events,
      success: success,
      successFlag: successFlag,
      eventdetails: eventdetails,
      search: search,
      attendees: attendees,
      dialogTableVisible: false,
      login_id: login_id,
      allcategories: allcategories,
      searchevent: searchevent,
      addEvents: addEvents,
      getAllEvents: getAllEvents,
      getSingleEvent: getSingleEvent,
      logoutUser: logoutUser,
      getAllAttendees: getAllAttendees,
      getCategory: getCategory,
      deleteEvent: deleteEvent,
      getSearchevent: getSearchevent,
      form: ref({
        title: '',
        description: '',
        date: '',
        fee: 0,
        is_online: true,
        url: '',
        venue: '',
        category: [],
        capacity: 0,
        requires_attendance_control: true,
      }),
    }
  },
}
</script>

<style>
.box-card {
  width: 2000px;
  text-align: center;
}
.event-card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-dialog {
  max-width: 50%;
}

#addevent {
  display: table;
  width: 100%;
  text-align: center;
}

#addeventreject {
  width: 100%;
  text-align: center;
}

</style>