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
              Log Successfully Created 
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
                    <v-btn dark color="secondary mr-2" @click="clientForm = true">Click to Get Latest Projects</v-btn>
                    <v-btn dark color="green" @click="openLogForm">Create Log</v-btn>
           </v-flex>
                      <v-row justify="center">
                <v-dialog v-model="dialog" persistent max-width="600px">
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
                                
                                <!-- Display this form  If a project is selected  #############################################################################-->
                                <div v-if="categorySelected">
                                    <v-row >
                                        <v-autocomplete
                                            v-model="form.client_id"
                                            :items="allClients"
                                            label="Client"
                                            hint="Select Client"
                                            class="ml-1"
                                            v-if='isClient'
                                        ></v-autocomplete>
                                    </v-row>
                                    <v-row>
                                        <v-autocomplete
                                            v-model="form.project_id"
                                            :items="projects"
                                            label="Project"
                                            v-if='isProject'
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
                                        <v-text-field
                                            v-model="form.orders"
                                            label='Orders'
                                            hide-details
                                            single-line
                                            required
                                            type="number"
                                            v-if='isOrder'
                                        />
                                    </v-row>
                                    <v-row>
                                        <v-text-field
                                            v-model="hours"
                                            label='Hours'
                                            hide-details
                                            single-line
                                            type="number"
                                            />
                                    <v-divider></v-divider>
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
            <!-- THIS FORM IS WHERE THE USER CAN MANUALLY UPDATE THE CLIENT -->
            <v-row justify="center">
              <v-dialog v-model="clientForm" persistent max-width="420" class='align-center'>
                
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
                    <v-btn color="red darken-1" text @click="clientForm = false">Cancel</v-btn>
                    <v-btn color="green darken-1" text @click="updateClientProjects">Update</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row> 
	</v-container>
</template>


<script>
	import moment from 'moment'
	import DashboardDataTables from '@/views/dashboard/tables/DataTables'

	export default {
		components: {
			DashboardDataTables
		},
	    data: () => ({
	    	clientForm: false,
	    	categorySelected: false,
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
	        isClient: false,
	        isOrder: false,
	        isProject: false,
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
	    watch: {
      		menu (val) {
        		val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      		},
    	},
	    mounted(){
	    	this.loadProjects()
	    	this.loadScheduleCategories()
	    	this.loadClients()
	    	this.form.user_id = this.$store.state.user_id
	    	this.table.endpoint = `${process.env.VUE_APP_SERVICE_URL}/editor-log/${this.form.user_id}`
	    	setTimeout(() => this.loaded = true, 2000)
	    }, 
	    methods: {
	    	loadClients(){
	            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/client/index-all`)
	                .then(res => {
	                    // console.log(res.data)
	                  res.data.forEach(item => {
	                    var clientObj = {
	                        "text": item.company,
	                        "value": item.id
	                    }
	                    this.allClients.push(clientObj)
	                  })
	            })
	        },
	    	loadProjects(){
            	this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project/active`)
	                .then(res => {
	                    // this.projectReference = res.data
	                    res.data.forEach(item => {
	                    	var projectObj = {
	                    		"text": item.name,
		                    	"value": item.id
	                    	}
	                        this.projects.push(projectObj)
	                    })
	                }).catch(err => console.log(err))
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
        	updateClientProjects(){
            	console.log(this.form2)
            	this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/client/projects/update-with-form`, this.form2)
                .then(res => {
                    window.location.reload()
                })
        	},
        	openLogForm(){
        		this.dialog = true
        		this.loaded = false
        	},
        	closeLogForm(){
        		this.dialog = false
        		this.loaded = true
        	},
        	save (date) {
            	this.$refs.menu.save(date)
        	},
        	postForm(){

        		if(this.hours){
        			var hoursToMinutes = this.hours * 60
            		this.form.minutes = +hoursToMinutes + +this.form.minutes
        		}
        		// this.projectReference.forEach(item => {
	         //        if(this.form.project_id == item.name){
	         //            this.form.project_id = item.id
	         //        }
          //   	})
	
	            // Turn this.form into custom variable
	            // this.form.
	            var sendForm = this.form
	            this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/editor-log`, sendForm)
	                .then(res => {
	                   	this.form = {
		         			user_id: this.$store.state.user_id,
		         			project_name: '',
				            client_id: null,
				            minutes: null,
				            completion_date: moment().format("YYYY-MM-DD"),
				            orders: null,            
				            note: ''
		         		}
		         		this.schedule_category_id = null
	                    this.hours = null	                    
	                    this.dialog = false
	                    this.loaded = true
	                    this.snackbar = true
	                    // window.location.reload()
	                }).catch(err => console.log(err))
	            // console.log(this.form)
	         	
        	},
        	checkCategoryForRules(){
        		// console.log(this.schedule_category_id)
        		this.form.schedule_category_id = this.schedule_category_id
	            this.scheduleCategoriesReference.forEach(item => {
	                if(this.schedule_category_id == item.id){
	                	this.categorySelected = true
	                	this.closeAllForms()
	                    // if(item.has_project && item.has_orders){	                    	
	                    //     this.isOrder = true
	                    //     this.isProject = true
	                    // }
	                    // else if(item.has_project){	                        
	                    //     this.isProject = true
	                    //     this.isOrder = true
	                    // } else if(item.has_orders){	                        
	                    //     this.isOrder = true
	                    //     this.isClient = true
	                    // }
	                    // else if(item.has_client){	                        
	                    //     this.isClient = true
	                    // }
	                    // else {	                        
	                    //     this.isOrder = true
	                    //     this.isProject = true
	                    //     this.isClient = true
	                    // }
	                    if(item.has_orders){
	                    	this.isOrder = true	                    	
	                    } 
	                    if(item.has_project){
	                    	this.isProject = true
	                    } 
	                    if(item.has_client){
	                    	this.isClient = true
	                    }
	                }
	            })
	        },
	        closeAllForms(){

	            this.isOrder = false
	            this.isClient = false
	            this.isProject = false	        	          	  
	        },
	    }
	}
</script>