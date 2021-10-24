<script>
import DashboardDataTables from '@/views/dashboard/tables/DataTables'
import moment from 'moment'

export default{
  components: {
    DashboardDataTables
  },
    data: () => ({
      date: null,
      loadProjectDataTable: false,
      loadUserDataTable: false,
      color: "red",
      icon: 'mdi-clipboard-file',
      color2: 'orange',
      icon2: 'mdi-badge-account-horizontal-outline',
      dialog: false,
      dialog2: false,
      dialog3: false,
      menu: false,
      menu2: false,
      loadTable: false,
      users: [],
      projects: [],
      projectReference: null,
      userReference: null,
      hours: null,
      form: {
        priority: null,
        minutes: null,
        client: null,
        notes: null,
        valid_day: moment().format("YYYY-MM-DD"),
        user_id: null,
        project_id: null
      },
      table: {
        formSettings: { users: true, projects: true, scheduleCategories: true },
        endpoint: `${process.env.VUE_APP_SERVICE_URL}/schedule`,
        endpoint2: `${process.env.VUE_APP_SERVICE_URL}/schedule/day`,
        actionsSchedule: { text: 'Actions', value: 'actionsSchedule', sortable: false },
        copySchedule: { text: 'Copy Schedule', value: 'copySchedule', sortable: false },
        headers: [
          {
              text: 'User Name',
              value: 'user_name'
          },
          {
              text: 'Project Name',
              value: 'project_name'
          },
          {
              text: 'Priority',
              value: 'priority'
          },
          {
              text: 'Category',
              value: 'schedule_category'
          },
          
          {
              text: 'Time',
              value: 'minutes'
          },
          {
              text: 'Notes',
              value: 'notes'
          },
          {
              text: 'Date',
              value: 'valid_day'
          }
      ],
      title: 'Daily Schedule Index',
      icon: 'mdi-timeline-check',
      },
      projectHeaders: [
          { text: 'Project Name', value: 'project_id' },
          // { text: 'Hours', value: 'hours' },
          // { text: 'Minutes', value: 'minutes' },
          { text: 'Total Time', value: 'time_in_minutes' },
          { text: 'Date', value: 'date' }
        ],
      tableData: [],
      userHeaders: [
        { text: 'User Name', value: 'user_name' },
        { text: 'Total Time', value: 'time_in_minutes' },
        { text: 'Date', value: 'date' }
      ],
      userData: [],
      allProjects: [],
      allUsers: [],
      // projectIdArray: [],
      form2: {
        project_id_array: [],
      },
      form3: {
        client: null
      },
      scheduleCategoriesReference: [],
      scheduleCategories: [],
      allClients: [],
      copyScheduleForm: {
        date: null
      }
    }),
    mounted(){
      

      this.loadScheduleCategories()
      this.loadAllUsers()
      this.loadUsers()
      this.loadClients()
      this.loadProjects()
      this.loadProjectData()
      this.loadUserData()
      setTimeout(() => this.loadProjectDataTable = true, 1000)
      setTimeout(() => this.loadUserDataTable = true, 1000)
      setTimeout(() => this.loadTable = true, 1000)
    },
    watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
    },
    computed: {
      tableEndpoint: function(){
        return `${process.env.VUE_APP_SERVICE_URL}/schedule/day`
      }
    },
    methods: {
      save (date) {
        this.$refs.menu.save(date)
      },
      createSchedule(){
        this.dialog = true
      },
      toggleForm(){
        this.dialog = !this.dialog
      },
      loadProjectData(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/schedule/day/data`)
          .then(res => {
            this.tableData = res.data
            res.data.forEach(item => {
              this.form2.project_id_array.push(item.project_id)
            })
            this.loadAllProjects()
          })
      },
      loadUserData(){
        this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/schedule/day/user-data`)
          .then(res => {
            this.userData = res.data
          })
      },
      postForm(){
        // console.log(this.userReference)

        var hoursToMinutes = this.hours * 60
        this.form.minutes = +this.form.minutes + +hoursToMinutes
        this.userReference.forEach(item => {
          var name = item.first_name + ' ' + item.last_name
          if(this.form.user_id == name){
            this.form.user_id = item.id
          }
        })
        // this.projectReference.forEach(item => {          
        //   if(this.form.project_id == item.name){
        //     this.form.project_id = item.id
        //   }
        // })
        // this.scheduleCategoriesReference.forEach(item => {
        //   if(this.form.schedule_category_id == item.name){
        //     this.form.schedule_category_id = item.id
        //   }
        // })

        this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/schedule`, this.form)
          .then(res => {
            this.dialog = false
            this.loadTable = false
            window.location.reload()
            
          })
        // console.log(this.form)

      },
      loadUsers(){
           this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/editors`)
            .then(res => {
              // console.log(res.body)
                this.userReference = res.body
                res.body.forEach(item => {
                  this.users.push(item.first_name + ' ' + item.last_name)
                })
                
            }).catch(err => console.log(err)) 
        },
        loadProjects(){
          this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project/active`)
            .then(res => {
              this.projectReference = res.data
              res.data.forEach(item => {
                var projectObj = {
                  "text": item.name,
                  "value": item.id
                }
                this.projects.push(projectObj)
              })
            })
        },
        loadScheduleCategories(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/schedule-category`)
                .then(res => {
                    this.scheduleCategoriesReference = res.data
                    res.data.forEach(item => {
                        var scObj = {
                          "text": item.name,
                          "value": item.id
                        }
                        this.scheduleCategories.push(scObj)
                    })
                })
        },
        loadClients(){
          this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/client/index-all`)
            .then(res => { 
              res.data.forEach(item => {
                this.allClients.push(item.company)
              })
            })
        },
        loadAllProjects(){
        this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/project/collection-from-array`, this.form2)
              .then(res => {
                  this.allProjects = res.data
              })
        },
        loadAllUsers(){
          this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/all`)
            .then(res => {
              this.allUsers = res.data
              
            })
        },
        convertMin(n){
          var num = n
          var hours = (num / 60)
          var rhours = Math.floor(hours)
          var minutes = (hours - rhours) * 60
          var rminutes = Math.round(minutes)
          return rhours + " hour(s) and " + rminutes + " minute(s)."
        },
        momentTime(time){
          return moment(time).format('LL')
        },
        changeRequest(){
          this.loadTable = false
          this.table.endpoint2 = `${process.env.VUE_APP_SERVICE_URL}/schedule/day?day=${this.date}`
          setTimeout(() => this.loadTable = true, 2000)
        },
        projectIdToName(val){
          for (let i=0; i < this.allProjects.length; i++) {
            if (this.allProjects[i].id === val) {
                return this.allProjects[i].name
            }
          }
        },
        userIdToName(val){
          for(let i = 0; i < this.allUsers.length; i++){
            if(this.allUsers[i].id === val){
              return this.allUsers[i].first_name + ' ' + this.allUsers[i].last_name
            }
          }
        },
        copyScheduleToTomorrow(){

          this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/schedule/copy-to-tomorrow`, this.copyScheduleForm)
            .then(res => {
              this.dialog2 = false
            })
        },
        updateClientProjects(){
          this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/client/projects/update-with-form`, this.form3)
            .then(res => {
                window.location.reload()
            })
        }
    }
}
</script>

<template>
  <v-container 
      id="schedule-index"
      tag='section' v-if="loadProjectDataTable">

        <v-flex x1 class="pt-3">
    <v-btn dark color="brown" @click="changeRequest">Change Date</v-btn>
        <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            label="Select Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          
          v-model="date"
          
          min="1950-01-01"
          @change="save"
          @click="changeRequest"
        ></v-date-picker>
    </v-menu>
   </v-flex> 
         <v-flex x1 class="pt-3">
          <v-btn dark color="blue" @click="createSchedule">Create Schedule</v-btn>
          <v-btn class="ml-1" dark color="green" @click="dialog2 = true">Copy To Tomorrow</v-btn>
          <v-btn class="ml-1" dark color="purple" @click="dialog3 = true">Click to Get Latest Projects</v-btn>
         </v-flex>
        <DashboardDataTables
          :headers="table.headers"
          :title="table.title"
          :icon="table.icon"
          :endpoint="table.endpoint2"
          :actions="table.actionsSchedule"
          :deleteEndpoint="table.endpoint"
          :formSettings="table.formSettings"
          v-if="loadTable"
      />
      <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Create Schedule</span>
        </v-card-title>
        <v-card-text>
          <v-container>
             <v-row >
                 <v-text-field
                  v-model="form.priority"
                  label='Priority'
                  hide-details
                  single-line
                  type="number"
                  />
             </v-row>
           <!--   <v-row >
                 <v-checkbox
                  v-model="form.second_check"
                  label="Second Check"
                ></v-checkbox>
             </v-row> -->
             <v-row >
                 <v-text-field
                  v-model="hours"
                  label='Hours'
                  hide-details
                  single-line
                  type="number"
                  />
             </v-row>
             <v-row >
                 <v-text-field
                  v-model="form.minutes"
                  label='Minutes'
                  hide-details
                  single-line
                  type="number"
                  />
             </v-row>
             <v-row >
                <v-text-field
                  v-model="form.notes"
                  label="Notes"
                ></v-text-field>
             </v-row>
             <v-row >
                <v-text-field
                  v-model="form.valid_day"
                  label="Date"
                ></v-text-field>
             </v-row>
              <v-row>
                <v-autocomplete
                v-model="form.user_id"
                :items="users"
                :menu-props="{ maxHeight: '400' }"
                label="User"
                hint="Select User"
                persistent-hint
                ></v-autocomplete>
            </v-row>
            <v-row>
                <v-autocomplete
                v-model="form.project_id"
                :items="projects"
                :menu-props="{ maxHeight: '400' }"
                label="Project"
                hint="Select Project"
                persistent-hint
                ></v-autocomplete>

                <v-autocomplete
                v-model="form.schedule_category_id"
                :items="scheduleCategories"
                label="Category"
                hint="Select Category"
                class="ml-1"
                ></v-autocomplete>
            </v-row>
            <v-row>
              <v-autocomplete
                v-model="form.client"
                :items="allClients"
                label="Client"
                hint="Select Client"
                class="ml-1"
              ></v-autocomplete>
            </v-row>
          </v-container>
          <!--This section will only get loaded if the user provided a select area -->
          <!-- <v-container v-if="formData.select">
            <v-row>
                <v-select
                v-model="selectValues"
                :items="formData.select.fields"
                :menu-props="{ maxHeight: '400' }"
                label="Select"
                multiple
                :hint="formData.select['hint']"
                persistent-hint
                ></v-select>
            </v-row>
          </v-container>
        <v-container v-if="formData.select2">
            <v-row>
                <v-select
                    v-model="selectValues2"
                    :items="formData.select2.fields"
                    :menu-props="{ maxHeight: '400' }"
                    label="Select"
                    multiple
                    :hint="formData.select2['hint']"
                    persistent-hint
                ></v-select>
            </v-row>
        </v-container> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="toggleForm">Close</v-btn>
          <v-btn color="blue darken-1" text @click="postForm">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <base-material-card
      :color="color"
      :icon="icon"
      inline
      class="px-5 py-3"  
    >
          <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
            Project Data
        </div>
      </template>
        <v-data-table
        :headers="projectHeaders"
        :items="tableData"
        v-if="loadProjectDataTable"
        >
        <template v-slot:item.time_in_minutes="{ item }">{{ convertMin(item.time_in_minutes) }}</template>
        <template v-slot:item.date="{ item }">{{ momentTime(item.date) }}</template>
        <template v-slot:item.project_id="{ item }">{{ projectIdToName(item.project_id) }}</template>
        <!-- <template v-slot:item.user_id="{ item }">{{ userIdToName(item.user_id) }}</template> -->
      </v-data-table>
    </base-material-card>
      <div class="mb-4"></div>
      <v-divider></v-divider>
      <div class="mb-3"></div>
       <base-material-card
      :color="color2"
      :icon="icon2"
      inline
      class="px-5 py-3"  
    >
             <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
            User Data
        </div>
      </template>
      <v-data-table
        :headers="userHeaders"
        :items="userData"
        v-if="loadUserDataTable"
        
      >
        <template v-slot:item.time_in_minutes="{ item }">{{ convertMin(item.time_in_minutes) }}</template>
        <template v-slot:item.date="{ item }">{{ momentTime(item.date) }}</template>
        <template v-slot:item.user_id="{ item }">{{ userIdToName(item.user_id) }}</template>
      </v-data-table>
    </base-material-card>
    <!-- This is here for when a user wants to copy Schedule to Tomorrow -->
      <v-row justify="center">
      <v-dialog v-model="dialog2" persistent max-width="420" class='align-center'>
        
        <v-card class="p-2">
          <v-card-title class="headline">Copy Schedule To Tomorrow</v-card-title>
            <v-menu
              ref="menu"
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
              class="m-1"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="copyScheduleForm.date"
                  label="Select Date"
                  
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                
                v-model="copyScheduleForm.date"
                
                min="1950-01-01"
                @change="save"
                @click="copyScheduleToTomorrow"
              ></v-date-picker>
            </v-menu>
          <!-- <v-card-text>By doing this you ?</v-card-text> -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialog2 = false">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="copyScheduleToTomorrow">Proceed</v-btn>
            
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
              <v-dialog v-model="dialog3" persistent max-width="420" class='align-center'>
                
                <v-card class="p-2">

                  <v-card-title class="headline">Pull recent Projects</v-card-title>                    
                  <!-- <v-card-text>By doing this you ?</v-card-text> -->
                  <v-card-actions>
                    <v-autocomplete
                        v-model="form3.client"
                        :items="allClients"
                        label="Client"
                        hint="Select Client"
                        class="ml-1"
                      ></v-autocomplete>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="dialog3 = false">Cancel</v-btn>
                    <v-btn color="green darken-1" text @click="updateClientProjects">Update</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
     </v-row>
  </v-container>
</template>
