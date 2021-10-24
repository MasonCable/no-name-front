<template>
    <v-container tag="section">
            <v-snackbar
              v-model="snackbar"
              :timeout="timeout"
              absolute
              shaped
              right
              top
            >
              Log SuccessfullyCreated 
              <template v-slot:action="{ attrs }">
                <v-btn
                  color="blue"
                  text
                  v-bind="attrs"
                  @click="snackbar = false"
                >
                  Close
                </v-btn>
              </template>
            </v-snackbar>
            <v-flex x1 class="pt-3">
                    <v-btn dark color="secondary mr-2" @click="updateClientForm">Click to Get Latest Projects</v-btn>
                    <v-btn dark color="green" @click="openLogForm">Create Log</v-btn>
           </v-flex> 

              

            <v-row justify="center">
                <v-dialog v-model="dialog2" persistent max-width="600px">
                    <v-card>
                        <v-card-title>
                          <span class="headline">Create Log</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-autocomplete
                                        v-model="schedule_category_id"
                                        :items="scheduleCategories"
                                        label="Category"
                                        @change="checkCategoryForRules"
                                    ></v-autocomplete>
                                </v-row>
                                <div v-if="wholeForm">
                                    <v-row>
                                        <v-autocomplete
                                            v-model="form.project_name"
                                            :items="projects"
                                            label="Project"
                                        ></v-autocomplete>
                                    </v-row>
                                    <v-row>
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
                                                v-model="form.completion_date"
                                                label="Completion Date"
                                                prepend-icon="mdi-calendar"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                              ></v-text-field>
                                            </template>
                                            <v-date-picker
                                              
                                              v-model="form.completion_date"
                                              
                                              
                                              @change="save"
                                              
                                            ></v-date-picker>
                                        </v-menu>               
                                    </v-row>
                                    <v-row>
                                        <!-- <v-text-field
                                            v-model="hours"
                                            label='Hours'
                                            hide-details
                                            single-line
                                            type="number"
                                            />
 -->                                    <!-- <v-divider></v-divider> -->
                                        <v-text-field
                                            v-model="form.minutes"
                                            label='Minutes'
                                            hide-details
                                            single-line
                                            type="Minutes"
                                        />
                                    </v-row>
                                    <v-row>
                                        <v-text-field
                                            v-model="form.orders"
                                            label='Orders'
                                            hide-details
                                            single-line
                                            type="number"
                                        />
                                    </v-row>
<!--                                     <v-row>
                                        <v-text-field
                                            v-model="form.revisions"
                                            label='Revisions'
                                            hide-details
                                            single-line
                                            type="number"
                                        />
                                    </v-row> -->
                                    <v-row>
                                        <v-text-field
                                            v-model="form.note"
                                            label="TPO Note"
                                        ></v-text-field>
                                    </v-row>   
                                </div>
                                <!-- Display this form  If a project is selected  #############################################################################-->
                                <div v-if="clientForm">
                                    <v-row>
                                        <v-autocomplete
                                            v-model="form.client_id"
                                            :items="allClients"
                                            label="Client"
                                            hint="Select Client"
                                            class="ml-1"
                                        ></v-autocomplete>
                                    </v-row>
                                    <v-row>
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
                                                v-model="form.completion_date"
                                                label="Completion Date"
                                                prepend-icon="mdi-calendar"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                              ></v-text-field>
                                            </template>
                                            <v-date-picker
                                              
                                              v-model="form.completion_date"
                                              
                                              
                                              @change="save"
                                              
                                            ></v-date-picker>
                                        </v-menu>               
                                    </v-row>
                                    <v-row>
                                        <!-- <v-text-field
                                            v-model="hours"
                                            label='Hours'
                                            hide-details
                                            single-line
                                            type="number"
                                            />
 -->                                    <!-- <v-divider></v-divider> -->
                                        <v-text-field
                                            v-model="form.minutes"
                                            label='Minutes'
                                            hide-details
                                            single-line
                                            type="Minutes"
                                        />
                                    </v-row>

                                    <v-row>
                                        <v-text-field
                                            v-model="form.note"
                                            label="TPO Note"
                                        ></v-text-field>
                                    </v-row>
                                </div>
                                <!-- Display this form if a client Form is selected #############################################################################-->
                                <div v-if="projectForm">
                                    <v-row>
                                        <v-autocomplete
                                            v-model="form.project_name"
                                            :items="projects"
                                            label="Project"
                                        ></v-autocomplete>
                                    </v-row>
                                    <v-row>
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
                                                v-model="form.completion_date"
                                                label="Completion Date"
                                                prepend-icon="mdi-calendar"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                              ></v-text-field>
                                            </template>
                                            <v-date-picker
                                              
                                              v-model="form.completion_date"
                                              
                                              
                                              @change="save"
                                              
                                            ></v-date-picker>
                                        </v-menu>               
                                    </v-row>
                                    <v-row>
                                        <!-- <v-text-field
                                            v-model="hours"
                                            label='Hours'
                                            hide-details
                                            single-line
                                            type="number"
                                            />
 -->                                    <!-- <v-divider></v-divider> -->
                                        <v-text-field
                                            v-model="form.minutes"
                                            label='Minutes'
                                            hide-details
                                            single-line
                                            type="Minutes"
                                        />
                                    </v-row>
                                    <v-row>
                                        <v-text-field
                                            v-model="form.orders"
                                            label='Orders'
                                            hide-details
                                            single-line
                                            type="number"
                                        />
                                    </v-row>
<!--                                     <v-row>
                                        <v-text-field
                                            v-model="form.revisions"
                                            label='Revisions'
                                            hide-details
                                            single-line
                                            type="number"
                                        />
                                    </v-row> -->
                                    <v-row>
                                        <v-text-field
                                            v-model="form.note"
                                            label="TPO Note"
                                        ></v-text-field>
                                    </v-row>  
                                </div>
                                <!-- This is the form if a client is selecte ######################################################################################################################################################################################################################################## -->
                                <div v-if="orderForm">
                                    <v-row>
                                        <v-autocomplete
                                            v-model="form.client_id"
                                            :items="allClients"
                                            label="Client"
                                            hint="Select Client"
                                            class="ml-1"
                                        ></v-autocomplete>
                                    </v-row>
                                    <v-row>
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
                                                v-model="form.completion_date"
                                                label="Completion Date"
                                                prepend-icon="mdi-calendar"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                              ></v-text-field>
                                            </template>
                                            <v-date-picker
                                              
                                              v-model="form.completion_date"
                                              
                                              
                                              @change="save"
                                              
                                            ></v-date-picker>
                                        </v-menu>               
                                    </v-row>
                                    <v-row>
                                        <!-- <v-text-field
                                            v-model="hours"
                                            label='Hours'
                                            hide-details
                                            single-line
                                            type="number"
                                            />
 -->                                    <!-- <v-divider></v-divider> -->
                                        <v-text-field
                                            v-model="form.minutes"
                                            label='Minutes'
                                            hide-details
                                            single-line
                                            type="Minutes"
                                        />
                                    </v-row>
                                    <v-row>
                                        <v-text-field
                                            v-model="form.orders"
                                            label='Orders'
                                            hide-details
                                            single-line
                                            type="number"
                                        />
                                    </v-row>
<!--                                     <v-row>
                                        <v-text-field
                                            v-model="form.revisions"
                                            label='Revisions'
                                            hide-details
                                            single-line
                                            type="number"
                                        />
                                    </v-row> -->
                                    <v-row>
                                        <v-text-field
                                            v-model="form.note"
                                            label="TPO Note"
                                        ></v-text-field>
                                    </v-row>  
                                </div>
                                                                <!-- This is the form if a client is selecte ######################################################################################################################################################################################################################################## -->
                                <div v-if="projectOrderForm">
                                    <v-row>
                                        <v-autocomplete
                                            v-model="form.project_name"
                                            :items="projects"
                                            label="Project"
                                        ></v-autocomplete>
                                    </v-row>
                                    <v-row>
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
                                                v-model="form.completion_date"
                                                label="Completion Date"
                                                prepend-icon="mdi-calendar"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                              ></v-text-field>
                                            </template>
                                            <v-date-picker
                                              
                                              v-model="form.completion_date"
                                              
                                              
                                              @change="save"
                                              
                                            ></v-date-picker>
                                        </v-menu>               
                                    </v-row>
                                    <v-row>
                                        <!-- <v-text-field
                                            v-model="hours"
                                            label='Hours'
                                            hide-details
                                            single-line
                                            type="number"
                                            />
 -->                                    <!-- <v-divider></v-divider> -->
                                        <v-text-field
                                            v-model="form.minutes"
                                            label='Minutes'
                                            hide-details
                                            single-line
                                            type="Minutes"
                                        />
                                    </v-row>
                                    <v-row>
                                        <v-text-field
                                            v-model="form.orders"
                                            label='Orders'
                                            hide-details
                                            single-line
                                            type="number"
                                        />
                                    </v-row>
<!--                                     <v-row>
                                        <v-text-field
                                            v-model="form.revisions"
                                            label='Revisions'
                                            hide-details
                                            single-line
                                            type="number"
                                        />
                                    </v-row> -->
                                    <v-row>
                                        <v-text-field
                                            v-model="form.note"
                                            label="TPO Note"
                                        ></v-text-field>
                                    </v-row>  
                                </div>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="closeLogForm">Close</v-btn>
                          <v-btn color="blue darken-1" text @click="postForm">Save</v-btn>
                        </v-card-actions> 
                    </v-card>
                </v-dialog>
            </v-row>


        <DashboardDataTables
            :headers="table.headers"
            :title="table.title"
            :icon="table.icon"
            :endpoint="table.endpoint"
            :actions="table.delete"
            :deleteEndpoint="tableEndpoint"
            v-if="loaded"
        />
            <v-row justify="center">
              <v-dialog v-model="dialog" persistent max-width="420" class='align-center'>
                
                <v-card class="p-2">

                  <v-card-title class="headline">Pull recent Projects</v-card-title>                    
                  <!-- <v-card-text>By doing this you ?</v-card-text> -->
                  <v-card-actions>
                    <v-autocomplete
                        v-model="form2.client"
                        :items="allClients"
                        label="Client"
                        hint="Select Client"
                        class="ml-1"
                      ></v-autocomplete>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="dialog = false">Cancel</v-btn>
                    <v-btn color="green darken-1" text @click="updateClientProjects">Update</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
    </v-container>
</template>

<script>
import DashboardDataTables from '@/views/dashboard/tables/DataTables'
import moment from 'moment'

export default {
    components: {
        DashboardDataTables
    },
    data: () => ({
        snackbar: false, 
        timeout: 3000,
        schedule_category_id: '',
        user_id: '',
        wholeForm: false,
        projectOrderForm: false,
        orderForm: false,
        projectForm: false,
        clientForm: false,
        dialog: false,
        dialog2: false,
        allClients: [],
        form2: { client: null, },
        date: null,
        menu: false,
        loaded: false,
        projects: [],
        projectReference: [],
        scheduleCategories: [],
        scheduleCategoriesReference: [],
        valid: true,
        hours: null,
        form: {
            user_id: null,
            project_name: '',
            client_id: null,
            minutes: null,
            completion_date: moment().format("YYYY-MM-DD"),
            orders: null,            
            note: ''
        },
        tableEndpoint: `${process.env.VUE_APP_SERVICE_URL}/editor-log`,
        table: {
            delete: { text: 'Actions', value: 'delete', sortable: false },
            headers: [
                {
                    text: 'Project Name ',
                    value: 'project_name'
                },
                {
                    text: 'Client',
                    value: 'client_name'
                },
                {
                    text: 'Time',
                    value: 'minutes'
                },
                {
                    text: 'Category',
                    value: 'schedule_category'
                },
                {
                    text: 'Completion Date',
                    value: 'completion_date'
                },
                {
                    text: 'Orders',
                    value: 'orders'
                },
                {
                    text: 'TPO Notes',
                    value: 'note'
                }
            ],
            title: 'Your Logs',
            icon: 'mdi-sort-clock-descending-outline',
            endpoint: '',
        }
    }),
    computed: {
        
    },
   
    mounted(){
        this.loadProjects()
        this.loadScheduleCategories()
        this.loadClients()
        this.getUserId()
        setTimeout(() => this.loaded = true, 2000)
    },
     watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
    },
    methods: {
        openLogForm(){
            this.loaded = false
            this.dialog2 = true
        },
        closeLogForm(){
            this.dialog2 = false
            this.loaded = true

        },
        updateClientForm(){
            this.dialog = true
        },
        updateClientProjects(){
            console.log(this.form2)
            this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/client/projects/update-with-form`, this.form2)
                .then(res => {
                    window.location.reload()
                })
        },
        save (date) {
            this.$refs.menu.save(date)
        },
        loadClients(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/client/index-all`)
                .then(res => {
                    // console.log(res.data)
                  res.data.forEach(item => {
                    var clientObj = {
                        "text": item.notes,
                        "value": item.id
                    }
                    this.allClients.push(clientObj)
                  })
            })
        },
        loadProjects(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project/active`)
                .then(res => {
                    this.projectReference = res.data
                    res.data.forEach(item => {
                        this.projects.push(item.name)
                    })
                }).catch(err => console.log(err))
        },
        loadScheduleCategories(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/schedule-category`)
                .then(res => {
                    this.scheduleCategoriesReference = res.data
                    res.data.forEach(item => {
                        this.scheduleCategories.push(item.name)
                    })
                })
        },
        submitLog(){
            console.log(this.form)
            var hoursToMinutes = this.hours * 60
            this.form.minutes = +hoursToMinutes + +this.form.minutes
            this.projectReference.forEach(item => {
                if(this.form.project_name == item.name){
                    this.form.project_id = item.id
                }
            })
            this.scheduleCategoriesReference.forEach(item => {
                if(this.form.schedule_category_id == item.name){
                    this.form.schedule_category_id = item.id
                }
            })
            // Turn this.form into custom variable
            var sendForm = this.form
            this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/editor-log`, sendForm)
                .then(res => {
                    this.form = {}
                    this.minutes = null
                    this.schedule_category_id = null
                    this.hours = null
                    this.form.project = null
                    this.form.completion_date = moment().format("YYYY-MM-DD")
                    this.form.client_id = null
                    this.dialog2 = false
                    this.loaded = true
                    this.snackbar = true
                    // window.location.reload()
                }).catch(err => console.log(err))
        },
        closeAllForms(){
            // this.form = {}
            this.clientForm = false
            this.projectForm = false
            this.wholeForm = false
            this.orderForm = false
            this.projectOrderForm = false
        },
        getUserId(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/me`)
                .then(res => {
                    this.form.user_id = res.data.id
                    this.user_id = res.data.id
                    this.table.endpoint = `${process.env.VUE_APP_SERVICE_URL}/editor-log/${this.form.user_id}`
                    
                }).catch(err => console.log(err))
        },
        checkCategoryForRules(){
            this.scheduleCategoriesReference.forEach(item => {
                if(this.schedule_category_id == item.name){
                    if(item.has_project && item.has_orders){
                        this.loadProjectOrderForm()
                    }
                    else if(item.has_project){
                        this.createProjectForm()
                    } else if(item.has_orders){
                        this.loadOrderForm()
                    }
                    else if(item.has_client){
                        this.createClientForm()
                    }
                    else {
                        this.loadWholeForm()
                    }
                }
            })
        },
        createClientForm(){
            this.closeAllForms()
            this.clientForm = !this.clientForm
        },
        createProjectForm(){
            this.closeAllForms()
            this.projectForm = !this.projectForm
        },
        loadWholeForm(){
            this.closeAllForms()            
            this.wholeForm = !this.wholeForm
        },
        loadOrderForm(){
            this.closeAllForms()
            this.orderForm = !this.orderForm
        },
        loadProjectOrderForm(){
            this.closeAllForms()
            this.projectOrderForm = !this.projectOrderForm
        },
        postForm(){
            this.form.user_id = this.user_id
            this.form.schedule_category_id = this.schedule_category_id
            this.form.minutes = 
            // console.log(this.form)
            this.submitLog()
        }
    }
}
</script>