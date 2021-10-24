<template>
	<v-container id="user-statistics" tag='section'>
		<v-row>
	<!-- 	    <v-menu
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
		  	</v-menu> -->
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
                    v-model="form.dates"
                    label="Completion Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  ref="picker"
                  v-model="form.dates"
                  
                  min="1950-01-01"
                  @change="save"
                  
                ></v-date-picker>
            </v-menu> 
		  	<v-btn dark color="secondary" @click="changeRequest">Select Range</v-btn>
		  </v-row>
		  		 <base-material-card
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
		      <template v-slot:item.time_logged="{ item }">{{ convertMin(item.time_logged) }}</template>
			      <!-- <template v-slot:item.project_id="{ item }">{{ projectIdToName(item.project_id) }}</template> -->
			      <!-- <template v-slot:item.user_id="{ item }">{{ userIdToName(item.user_id) }}</template> -->
	  			</v-data-table>
	  		</base-material-card>
	  		<base-material-card
			      color="orange"
			      icon="mdi-badge-account-horizontal-outline"
			      inline
			      class="px-5 py-3"  
			    >
			    <template v-slot:after-heading>
			        <div class="display-2 font-weight-light">
			            Category Statistics
			        </div>
			    </template>
		      <v-data-table
		        :headers="categoryHeaders"
		        :items="categoryTableData"
		        v-if="table"
		      >
		      <template v-slot:item.time_worked_on="{ item }">{{ convertMin(item.time_worked_on) }}</template>
			      <!-- <template v-slot:item.project_id="{ item }">{{ projectIdToName(item.project_id) }}</template> -->
			      <!-- <template v-slot:item.user_id="{ item }">{{ userIdToName(item.user_id) }}</template> -->
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
			            Project Statistics
			        </div>
			    </template>
		      <v-data-table
		        :headers="projectHeaders"
		        :items="projectTableData"
		        v-if="table"
		      >
		      <template v-slot:item.time_worked_on="{ item }">{{ convertMin(item.time_worked_on) }}</template>
			      <!-- <template v-slot:item.project_id="{ item }">{{ projectIdToName(item.project_id) }}</template> -->
			      <!-- <template v-slot:item.user_id="{ item }">{{ userIdToName(item.user_id) }}</template> -->
	  			</v-data-table>
	  		</base-material-card>
	</v-container>
</template>

<script>
	import moment from 'moment'

	export default {
		data: () => ({
			headers: [
	          { text: 'User name', value: 'user_name' },			          
	          { text: 'Time', value: 'time_logged' },
	          // { text: 'Date', value: 'date' }
			],
			categoryHeaders: [
	          { text: 'Category', value: 'schedule_category' },			          
	          { text: 'Schedules', value: 'days_worked_on' },
	          { text: 'Time', value: 'time_worked_on' },
			],
			projectHeaders: [
	          { text: 'Project', value: 'project_name' },			          
	          { text: 'Schedules', value: 'days_worked_on' },
	          { text: 'Time', value: 'time_worked_on' },
			],
			categoryTableData: [],
			projectTableData: [],
			tableData: [],
			form: { dates: [moment().format("YYYY-MM-DD")]  },			
			table: false,
			menu: false,
		}),
		mounted(){
			this.loadTodayUserData()
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
    		changeRequest(){
    			this.table = false
    			this.loadTodayUserData()
    		},
    		checkDates(){
        		if(this.form.dates[0] > this.form.dates[1]){
        			var date1 = this.form.dates[0]
        			var date2 = this.form.dates[1]

        			this.form.dates = []
        			this.form.dates.push(date2, date1)
        			// console.log(this.form.dates)
        		}
        	},
        	loadTodayUserData(){
        		this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/user/user-schedule-history`, this.form)
        			.then(res => {
        				this.tableData = res.data.time_scheduled
        				this.categoryTableData = res.data.categories_scheduled
        				this.projectTableData = res.data.projects_scheduled
        				this.table = true
        			}).catch(err => console.log(err))
        	},
        	loadScheduleData(){
        		this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/schedule-data`)
        	},
        	save (date) {
        		this.$refs.menu.save(date)
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