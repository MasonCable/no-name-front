<template>
	<v-container id="editorLog-statistics" tag='section'>
		  <v-row>
		    <v-menu
			    ref="menu"
			    v-model="menu"
			    :close-on-content-click="false"
			    transition="scale-transition"
			    offset-y
			    min-width="auto"
			  >
		      <v-date-picker
		        v-model="form.dates"
		        range
		      ></v-date-picker>
		      <template v-slot:activator="{ on, attrs }">
		      <v-text-field
		        v-model="dateRangeText"
		        ref="picker"
		        @change="save"
		        label="Date range"
		        prepend-icon="mdi-calendar"
		        readonly
		        v-bind="attrs"
        		v-on="on"
		      ></v-text-field>
		  		</template>
		  	</v-menu>
		  	<v-btn dark color="secondary" @click="changeRequest">Select Range</v-btn>
		  </v-row>
		<!--       <base-material-card
			      color="brown"
			      icon="mdi-badge-account-horizontal-outline"
			      inline
			      class="px-5 py-3"  
			    >
			    <template v-slot:after-heading>
			        <div class="display-2 font-weight-light">
			            User Statistics
			        </div>
			    </template>
		      <v-data-table
		        :headers="headers"
		        :items="tableData"
		        v-if="table"
		      >
			      
			      <template v-slot:item.user_id="{ item }">{{ userIdToName(item.user_id) }}</template>
      			</v-data-table>
      		</base-material-card> -->
      				      <base-material-card
			      color="orange"
			      icon="mdi-chart-tree"
			      inline
			      class="px-5 py-3"  
			    >
			    <template v-slot:after-heading>
			        <div class="display-2 font-weight-light">
			            User Logs
			        </div>
			    </template>
		      <v-data-table
		        :headers="editorLogHeaders"
		        :items="editorLogTable"
		        v-if="table"
		      >
			      <!-- <template v-slot:item.project_id="{ item }">{{ projectIdToName(item.project_id) }}</template> -->
			      <template v-slot:item.user_id="{ item }">{{ userIdToName(item.user_id) }}</template>
			      <template v-slot:item.minutes="{ item }">{{ convertMin(item.minutes) }}</template>
      			</v-data-table>
      		</base-material-card>
      		    <base-material-card
			      color="red"
			      icon="mdi-badge-account-horizontal-outline"
			      inline
			      class="px-5 py-3"  
			    >
			    <template v-slot:after-heading>
			        <div class="display-2 font-weight-light">
			            Categories Logged
			        </div>
			    </template>
		      <v-data-table
		        :headers="scheduleCategoryHeaders"
		        :items="scheduleCategoryTable"
		        v-if="table"
		      >
			      <template v-slot:item.time_worked_on="{ item }">{{ convertMin(item.time_worked_on) }}</template>
			      <!-- <template v-slot:item.user_id="{ item }">{{ userIdToName(item.user_id) }}</template> -->
      			</v-data-table>
      		</base-material-card>
      		    <base-material-card
			      color="green"
			      icon="mdi-badge-account-horizontal-outline"
			      inline
			      class="px-5 py-3"  
			    >
			    <template v-slot:after-heading>
			        <div class="display-2 font-weight-light">
			            Projects Logged
			        </div>
			    </template>
		      <v-data-table
		        :headers="headers"
		        :items="tableData"
		        v-if="table"
		      >
			      <template v-slot:item.time_worked_on="{ item }">{{ convertMin(item.time_worked_on) }}</template>
			      <!-- <template v-slot:item.user_id="{ item }">{{ userIdToName(item.user_id) }}</template> -->
      			</v-data-table>
      		</base-material-card>
      		
        	
	</v-container>
</template>
<script>
	import moment from 'moment'

	export default{

		data: () => ({
			form:{dates: [moment().format("YYYY-MM-DD")]},			
			menu: false,
			headers: [
			          { text: 'Project name', value: 'project_name' },			          
			          { text: 'Total Logs', value: 'days_worked_on' },
			          { text: 'Time Spent', value: 'time_worked_on' }
			],
			editorLogHeaders: [
			          { text: 'User name', value: 'user_name' },
			          { text: 'Project', value: 'project_name' },
			          { text: 'Category', value: 'schedule_category' },
			          // { text: 'Hours', value: 'hours' },
			          { text: 'Time', value: 'minutes' },
			          { text: 'Date', value: 'completion_date' }
			],
			scheduleCategoryHeaders: [
			          { text: 'Category Name', value: 'schedule_category' },
			          { text: 'Total Logs', value: 'days_worked_on' },
			          { text: 'Time Spent', value: 'time_worked_on' },
			],
			tableData: [],
			editorLogTable: [],
			scheduleCategoryTable: [],
			table: false,
			allUsers: [],
			allProjects: [],

		}),
		mounted(){
			this.loadAllUsers()
			this.loadEditorLogs()
			this.loadLogHistory()

		},
		computed: {
      		dateRangeText () {
        		return this.form.dates.join(' ~ ')
      		},
    	},
    	watch: {
      		menu (val) {
        		val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      		},
    	},
    	methods: {
    		loadLogHistory(){
    			this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/user/user-log-history`, this.form)
    				.then(res => {
    					console.log(res.data)
    					this.scheduleCategoryTable = res.data.schedule_categories_logged
    					this.tableData = res.data.projects_logged
    					this.table = true
    				})
    		},
    		loadTodayUserData(){
				this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/schedule/day/user-data?perpage=100`)
					.then(res => {
						this.tableData = res.data
						// console.log(res.data)
						this.table = true
					})
    		},
		     loadAllUsers(){
		        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/all`)
		          .then(res => {
		            this.allUsers = res.data
		          })
		      },
		    loadEditorLogs(){
		    	// console.log(this.form)
		    	this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/editor-log/statistics`, this.form)
		    		.then(res => {
		    			this.editorLogTable = res.body.data
		    			// console.log(res.body.data)
		    		})
		    },
    		changeRequest(){
    			this.checkDates()
    			this.table = false
    			this.loadEditorLogs()
    			this.loadLogHistory()
    			// this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/schedule/user/statistics`, this.form)
    			// 	.then(res => {
    			// 		this.tableData = res.data
    			// 		// console.log(res.data)
    			// 		setTimeout(() => this.table = true, 3000)
    			// 	})
    		},
    		save (date) {
        		this.$refs.menu.save(date)
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
        	checkDates(){
        		if(this.form.dates[0] > this.form.dates[1]){
        			var date1 = this.form.dates[0]
        			var date2 = this.form.dates[1]

        			this.form.dates = []
        			this.form.dates.push(date2, date1)
        			console.log(this.form.dates)
        		}
        	},
        	convertMin(n){
		        var num = n
		        var hours = (num / 60)
		        var rhours = Math.floor(hours)
		        var minutes = (hours - rhours) * 60
		        var rminutes = Math.round(minutes)
		        return rhours + " hour(s) and " + rminutes + " minute(s)."
		    }
    	}
	}
</script>