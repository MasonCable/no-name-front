<template>
 
  
    <base-material-card
      :color="color"
      :icon="icon"
      inline
      class="px-5 py-3"
      
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
            {{ title }}
        </div>
      </template>

      <v-text-field
        v-model="searchTerm"
        append-icon="mdi-magnify"
        class="ml-auto"
        label="Search"
        hide-details
        single-line
        style="max-width: 250px;"
        @change="update"
      />

      <v-divider class="mt-3" />
        <MagicForm
            v-if="formData"
          :formData="formData"
          v-on:save-form="update"
        />
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="options"
        :loading="loading"
        :server-items-length='serverItemsLength'
        :footer-props="footerProps"
        @update:options="update"
        @click:row="viewItem"
        multi-sort >
          <template v-slot:item.project_status="{ item }">{{ getValue(item.project_status) }}</template>
          <template v-slot:item.minutes="{ item }">{{ convertMin(item.minutes) }}</template>
          <template v-slot:item.created_at="{ item }">{{ humanReadable(item.created_at, false) }}</template>
          <template v-slot:item.valid_day="{ item }">{{ humanReadable(item.valid_day, true) }}</template>
          <template v-slot:item.placed_at="{ item }">{{ humanReadable(item.placed_at, true) }}</template>
          <template v-slot:item.author_submitted_at="{ item }">{{ humanReadable(item.author_submitted_at) }}</template>
          <template v-slot:item.second_check="{ item }">{{ getTrueOrFalse(item.second_check) }}</template>
          <template v-slot:item.user_id="{ item }">{{ showUserName(item.user_id) }}</template>
          <template v-slot:item.project_id="{ item }">{{ showProjectName(item.project_id) }}</template>
          
          <template v-slot:item.actionsSchedule="{ item }">
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon small @click="copySchedule(item)">
              mdi-clipboard-text-multiple-outline
            </v-icon>
          </template>
          <template v-slot:item.delete="{ item }">
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:item.loginAs="{ item }" >
            <v-icon small @click="loginAsUser(item)">
              mdi-login
            </v-icon>
          </template>
         <!--  <template v-slot:item.copySchedule="{ item }">
            <v-icon small @click="copySchedule(item)">
              mdi-copy
            </v-icon> 
          </template>-->
         <!--  <template slot="body.append" v-if="total">
              <tr>
                  <td><span class="font-weight-bold">Total Hours:</span></td>
                  <td><span class="font-italic">{{ total }}</span></td>
                  <td></td>
              </tr>
         </template> -->
        </v-data-table>
          <v-dialog v-model="dialogDelete" max-width="550px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
              <v-dialog v-model="dialog3" persistent max-width="1150px" >
      <v-card>
        <v-card-title>
          <span class="headline">Copy Schedule To Tomorrow</span>
        </v-card-title>
        <v-card-text>
          <v-container>
             <v-row >
                <v-text-field 
                    label="Priority" 
                    v-model="copyForm.priority"
                    ></v-text-field>
             </v-row>
             <v-row >
          <!--       <v-text-field 
                    label="Schedule Category" 
                    v-model="copyForm.schedule_category_id"
                    ></v-text-field> -->
                      <v-autocomplete
                        v-model="copyForm.schedule_category_id"
                        :items="allScheduleCategories"
                        :menu-props="{ maxHeight: '400' }"
                        label="Category"
                        hint="Select Category"
                        persistent-hint
                      ></v-autocomplete>
             </v-row>
            <!--   <v-row >
                <v-text-field 
                    label="Client ID" 
                    v-model="editForm.client_id"
                    ></v-text-field>
             </v-row> -->
        <!--      <v-row >
                <v-text-field 
                    label="Hours" 
                    v-model="copyForm.hours"
                    ></v-text-field>
             </v-row> -->
             <v-row >
                <v-text-field 
                    label="Minutes" 
                    v-model="copyForm.minutes"
                    ></v-text-field>
             </v-row>
             <v-row >
                <v-text-field 
                    label="Date" 
                    v-model="copyForm.valid_day"
                    ></v-text-field>
             </v-row>
             <v-row >
                <v-text-field 
                    label="Notes" 
                    v-model="copyForm.notes"
                    ></v-text-field>
             </v-row>
             <v-row >
       <!--          <v-text-field 
                    label="Project ID" 
                    v-model="copyForm.project_id"
                    ></v-text-field> -->
                      <v-autocomplete
                        v-model="copyForm.project_id"
                        :items="allProjects"
                        :menu-props="{ maxHeight: '400' }"
                        label="Project"
                        hint="Select Project"
                        persistent-hint
                      ></v-autocomplete>
             </v-row>
             <v-row >
<!--                 <v-text-field 
                    label="User ID" 
                    v-model="copyForm.user_id"
                    ></v-text-field> -->
                      <v-autocomplete
                        v-model="copyForm.user_id"
                        :items="allUsers"
                        :menu-props="{ maxHeight: '400' }"
                        label="User"
                        hint="Select User"
                        persistent-hint
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
          <v-btn color="blue darken-1" text @click="toggleCopyToTomorrow">Close</v-btn>
          <v-btn color="blue darken-1" text @click="postCopyToTomorrowForm">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- THIS IS THE END OF COPY TO TOMMOROW -->
      <v-dialog v-model="dialog2" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Schedule</span>
        </v-card-title>
        <v-card-text>
          <v-container>
             <v-row >
                <v-text-field 
                    label="Priority" 
                    v-model="editForm.priority"
                    ></v-text-field>
             </v-row>
             <!-- Wait for CLient ID to start working -->
         <!--      <v-row >
                <v-text-field 
                    label="Client ID" 
                    v-model="editForm.client_id"
                    ></v-text-field>
             </v-row> -->
             <v-row >
           <!--      <v-text-field 
                    label="Schedule Category" 
                    v-model="editForm.schedule_category_id"
                    ></v-text-field> -->
                      <v-autocomplete
                        v-model="editForm.schedule_category_id"
                        :items="allScheduleCategories"
                        :menu-props="{ maxHeight: '400' }"
                        label="Category"
                        hint="Select Category"
                        persistent-hint
                      ></v-autocomplete>
             </v-row>
             <v-row >
                <v-text-field 
                    label="Hours" 
                    v-model="editForm.hours"
                    ></v-text-field>
             </v-row>
             <v-row >
                <v-text-field 
                    label="Minutes" 
                    v-model="editForm.minutes"
                    ></v-text-field>
             </v-row>
             <v-row >
                <v-text-field 
                    label="Notes" 
                    v-model="editForm.notes"
                    ></v-text-field>
             </v-row>
             <v-row >
<!--                 <v-text-field 
                    label="Project ID" 
                    v-model="editForm.project_id"
                    ></v-text-field> -->
                      <v-autocomplete
                        v-model="editForm.project_id"
                        :items="allProjects"
                        :menu-props="{ maxHeight: '400' }"
                        label="Project"
                        hint="Select Project"
                        persistent-hint
                      ></v-autocomplete>
             </v-row>
             <v-row >
               <!--  <v-text-field 
                    label="User ID" 
                    v-model="editForm.user_id"
                    ></v-text-field> -->
                    <v-autocomplete
                      v-model="editForm.user_id"
                      :items="allUsers"
                      :menu-props="{ maxHeight: '400' }"
                      label="User"
                      hint="Select User"
                      persistent-hint
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
    </base-material-card>
  
</template>

<script>
  import MagicForm from '@/components/MagicForm'
  import moment from 'moment'
  
  export default {
    name: 'DashboardDataTables',
    components: {
      MagicForm
    },
    props: {
        title: String,
        icon: String,
        name: String,
        headers: Array,
        endpoint: String,
        color: String,
        viewUrl: String,
        deleteEndpoint: String,
        formData: Object,
        search: String,
        actions: Object,
        actionsSchedule: Object,
        loginAs: Object,
        edit: Object,
        users: Array,
        projects: Array,
        formSettings: Object,
        
    },

    data: () => ({
      dialogDelete: false,
      dialog2: false,
      dialog3: false,
      deleteId: '',
        footerProps: {
            "items-per-page-options": [10,25,100,-1]
        },
        items: [],
        loading: true,
        searchTerm: '',
        serverItemsLength: 5,
        options: {
          page: 1,
          itemsPerPage: 10,
          sortBy: ['id'],
          sortDesc: [true],
        },
        copyForm: {},
        userForm: false,
        userName: '',
        projectName: '',
        editForm:{
          id: '',
          priority: '',
          schedule_category_id: '',
          hours: '',
          minutes: '',
          notes: '',
          valid_day: '',
          project_id: '',
          user_id: ''
        },
        form: {
          project_id_array: []
        },
        userIdArr: [],
        projectsOnPage: [],
        allUsers: [],
        userReference: [],
        allProjects: [],
        projectReference: [],
        scheduleCategoriesReference: [],
        allScheduleCategories: []
    }),
    methods: {
        copySchedule(item){
          console.log(item)
          this.copyForm.client_id = item.client_id
          this.copyForm.priority = item.priority
          this.copyForm.minutes = item.minutes
          this.copyForm.notes = item.notes
          this.copyForm.schedule_category_id = item.schedule_category
          this.copyForm.project_id = item.project_name
          this.copyForm.user_id = item.user_name

          this.copyForm.valid_day = moment().add(1, 'days').format("YYYY-MM-DD")
          this.dialog3 = true
        },
        openForm(){
          this.userForm = true
        },
        update() {
            if(this.options.itemsPerPage == -1) {
                var perPage = this.serverItemsLength
            } else {
                var perPage = this.options.itemsPerPage
            }
           
          this.loading=true;
          this.$http.get(this.endpoint+
              "?page="+this.options.page+
              "&perPage="+this.options.itemsPerPage+
              "&sortBy="+this.options.sortBy +
              "&sortDesc="+this.options.sortDesc+
              "&searchTerm="+this.searchTerm
          )
            .then(res => {
              
              this.items = res.body.data
              this.options.page = res.body.meta.current_page
              this.serverItemsLength = res.body.meta.total
              if(this.projects){
                this.items.forEach(item => {
                  this.form.project_id_array.push(item.project_id)
                })
              }
              
              this.getProjectNames()
              this.loading = false
              
            })
        },
        viewItem(item) {
            if(this.viewUrl) {
              this.$router.push(this.viewUrl + item.id)
            }
        },
        closeForm(){
          this.userForm = false
        },
        getValue(val){
          return (val ? 'Inactive' : 'Active');
        },
        humanReadable(time, num){
          return (num ? moment(time).format('LL') : moment(time).format('LLL'))
        },
        deleteItem (item) {
          // console.log(item)
          this.deleteId = item.id
          this.dialogDelete = true
        },
        loginAsUser(item){
          var userId = item.id
          this.$store.dispatch("loginAs", userId)
            .then(res => {
              this.$router.push('/pages/users')
              window.location.reload()
            })
        },
        deleteItemConfirm () {
          // var endpoint = `${process.env.VUE_APP_SERVICE_URL}/schedule/${this.deleteId}/delete`
          var endpoint = `${this.deleteEndpoint}/${this.deleteId}`
          this.$http.delete(endpoint)
            .then(res => {
              this.update()
            }).catch(err => console.log(err))
          this.closeDelete()
          
        },
        closeDelete () {
          this.deleteId = ''
          this.dialogDelete = false        
        },
        shortenNotes(notes){
          return notes.slice(0, 10) + '...'
        },
        showUserName(userId){
          for(let i = 0; i < this.users.length; i++){
            if(userId === this.users[i].id){
              return this.users[i].first_name + ' ' + this.users[i].last_name
            }
          }
        },
        showProjectName(projectId){
          // console.log(this.items)
          for(let i = 0; i < this.projectsOnPage.length; i++){
            if(projectId === this.projectsOnPage[i].id){
              return this.projectsOnPage[i].name
            }
          }
        },
        getTrueOrFalse(val){
          return (val ? "True" : "False")
        },
        editItem(item){
          this.editForm.id = item.id
          this.editForm.priority = item.priority          
          // this.editForm.hours = item.hours
          this.editForm.minutes = item.minutes
          this.editForm.schedule_category_id = item.schedule_category
          this.editForm.notes = item.notes
          this.editForm.valid_day = item.valid_day
          this.editForm.project_id = item.project_name
          this.editForm.user_id = item.user_name
          
          this.dialog2 = true
        },
        toggleForm(){
          this.dialog2 = !this.dialog2
        },
        convertMin(n){
          var num = n
          var hours = (num / 60)
          var rhours = Math.floor(hours)
          var minutes = (hours - rhours) * 60
          var rminutes = Math.round(minutes)
          return rhours + " hour(s) and " + rminutes + " minute(s)."
        },
        postForm(){
          this.userReference.forEach(item => {
            var name = item.first_name + ' ' + item.last_name
            if(this.editForm.user_id == name){
              this.editForm.user_id = item.id
            }
          })
          this.projectReference.forEach(item => {          
            if(this.editForm.project_id == item.name){
              this.editForm.project_id = item.id
            }
          })
          this.scheduleCategoriesReference.forEach(item => {
            if(this.editForm.schedule_category_id == item.name){
              this.editForm.schedule_category_id = item.id
            }
          })
          // console.log(this.editForm)
          this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/schedule/${this.editForm.id}`, this.editForm)
            .then(res => {
              this.dialog2 = false
              this.update()
            })

        },
        toggleCopyToTomorrow(){
          this.dialog3 = false
        },
        postCopyToTomorrowForm(){
          this.userReference.forEach(item => {
            var name = item.first_name + ' ' + item.last_name
            if(this.copyForm.user_id == name){
              this.copyForm.user_id = item.id
            }
          })
          // this.projectReference.forEach(item => {          
          //   if(this.copyForm.project_id == item.name){
          //     this.copyForm.project_id = item.id
          //   }
          // })
          // this.scheduleCategoriesReference.forEach(item => {
          //   if(this.copyForm.schedule_category_id == item.name){
          //     this.copyForm.schedule_category_id = item.id
          //   }
          // })
          
          this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/schedule`, this.copyForm)
            .then(res => {
              console.log(res.data)
              this.dialog3 = false
            })
        },
        getProjectNames(){
            this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/project/collection-from-array`, this.form)
              .then(res => {
                  this.projectsOnPage = res.data
              })
        },
        loadUsers(){
             this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/editors`)
              .then(res => {
                // console.log(res.body)
                  this.userReference = res.body
                  res.body.forEach(item => {
                    this.allUsers.push(item.first_name + ' ' + item.last_name)
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
                  this.allProjects.push(projectObj)
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
                        this.allScheduleCategories.push(scObj)
                    })
                })
        },
        makeFormEdits(){
          this.loadUsers()
          this.loadProjects()
          this.loadScheduleCategories()
        }
    },

    mounted(){

        if (this.endpoint) {
            this.update()
            // if(this.projects){
            //   this.getProjectNames()
            // }
        }
        if(this.actions){
          this.headers.push(this.actions)
        }
        
        if(this.formSettings){
          
          this.makeFormEdits()
        }
    }
  }
</script>
