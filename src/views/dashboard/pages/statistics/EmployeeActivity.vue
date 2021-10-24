<template>
	<v-container id='employee-activity' tag='section'>
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
		  	<v-autocomplete
                v-model="form.user_id"
                prepend-icon="mdi-account"
                :items="userReference"
                item-text="full_name"
                item-value="id"
                :menu-props="{ maxHeight: '400' }"
                label="Select Employee"
                persistent-hint
            ></v-autocomplete>
            <v-btn class="mt-2 ml-3" dark color="green darken-1" @click="handleSubmit">View Summary</v-btn>
		  </v-row>
		  <!-- <v-btn v-if="loadAllLogs" class="mt-2 ml-3" dark color="red darken-1" @click="downloadData">View Summary</v-btn> -->
		  <!-- Time Per Cateogry Table  -->
		  	<v-row>
			 	<v-col>
			  		<base-material-card
				      color="green"
				      icon="mdi-badge-account-horizontal-outline"
				      inline
				      class="px-5 py-3"
				      v-if="loadTimePerCategory"  
				    >
						    <template v-slot:after-heading>
						        <div class="display-2 font-weight-light">
						            Hours By Client/Category
						        </div>
						    </template>
					      <v-data-table
					        :headers="timePerCategoryHeaders"
					        :items="timePerCategoryTable"
					        
					      >
					      <template v-slot:item.total_time="{ item }">{{ convertMin(item.total_time) }}</template>
					      <!-- <template v-slot:item.user_id="{ item }">{{ userIdToName(item.user_id) }}</template> -->
		      			</v-data-table>
	      			</base-material-card>
	      		</v-col>
	      		<v-col>
	      			<base-material-card
				      color="green"
				      icon="mdi-badge-account-horizontal-outline"
				      inline
				      class="px-5 py-3"
				      v-if="loadTpoByCategoryTable"  
				    >
						    <template v-slot:after-heading>
						        <div class="display-2 font-weight-light">
						            TPO Per Category
						        </div>
						    </template>
					      <v-data-table
					        :headers="tpoByCategoryCategoryHeaders"
					        :items="tpoByCategoryTable"
					        
					      >
					      <!-- <template v-slot:item.total_time="{ item }">{{ convertMin(item.total_time) }}</template> -->
					      <template v-slot:item.orders="{ item }">{{ checkNull(item.orders) }}</template>
					      <template v-slot:item.tpo_in_minutes="{ item }">{{ checkNull(item.tpo_in_minutes) }}</template>
					      <template v-slot:item.avg_tpo="{ item }">{{ checkNull(item.avg_tpo) }}</template>
		      			</v-data-table>
	      			</base-material-card>
	      		</v-col>
      		</v-row>
      		
	      			<base-material-card
				      color="green"
				      icon="mdi-badge-account-horizontal-outline"
				      inline
				      class="px-5 py-3"
				      v-if="loadAllLogs"  
				    >
						    <template v-slot:after-heading>
						        <div class="display-2 font-weight-light">
						            All Logs
						        </div>
						    </template>
					      <v-data-table
					        :headers="allLogsHeaders"
					        :items="allLogsTable"
					        
					      >
					      <!-- <template v-slot:item.total_time="{ item }">{{ convertMin(item.total_time) }}</template> -->
					      <template v-slot:item.orders="{ item }">{{ checkNull(item.orders) }}</template>
					      <template v-slot:item.note="{ item }">{{ checkNull(item.note) }}</template>
					      <template v-slot:item.tpo="{ item }">{{ checkNull(item.tpo) }}</template>
		      			</v-data-table>
	      			</base-material-card>      			
      		
	</v-container>
</template>
<script>
	import moment from 'moment'

	export default {
		data: () => ({
			form:{dates: [
				moment().subtract(1, 'months').format('YYYY-MM-DD'),
				moment().format("YYYY-MM-DD")
				], user_id: null},
			menu: false,
			user_id: null,
			users: [],
			userReference: [],
			timePerCategoryHeaders: [
			          { text: 'Name', value: 'name' },
			          { text: 'Time', value: 'total_time' },
			],
			tpoByCategoryCategoryHeaders: [
			          { text: 'Name', value: 'name' },
			          // { text: 'Minutes', value: 'minutes' },
			          { text: 'Orders', value: 'orders' },
			          { text: 'TPO', value: 'tpo_in_minutes' },
			          { text: 'Team Avgerage TPO', value: 'avg_tpo' },
			],
			allLogsHeaders: [
			          { text: 'Name', value: 'name' },
			          { text: 'Minutes', value: 'minutes' },
			          { text: 'Orders', value: 'orders' },
			          { text: 'TPO', value: 'tpo' },
			          { text: 'Note', value: 'note' },
			          { text: 'Completion Date', value: 'completion_date' },
			],
			allLogsTable: [],
			loadAllLogs: false,
			timePerCategoryTable: [],
			loadTimePerCategory: false,
			tpoByCategoryTable: [],
			loadTpoByCategoryTable: false
		}),
		mounted(){			
			this.loadUsers()
		},
		computed: {
      		dateRangeText () {
        		return this.form.dates.join(' ~ ')
      		},
    	},
    	methods: {
    		save (date) {
        		this.$refs.menu.save(date)
      		},
      		loadUsers(){
      			this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/all`)
      				.then(res => {
      					
      					this.userReference = res.body.data
      					// res.body.data.forEach(item => {
      					// 	this.users.push(item.full_name)
      					// })
      				})
      		},
      		handleSubmit(){
      			this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/user/${this.form.user_id}/activity-summary`, this.form)
      				.then(res => {
      					this.allLogsTable = res.data.all_logs
      					this.timePerCategoryTable = res.data.time_per_category
      					this.tpoByCategoryTable = res.data.tpo_by_category

      					this.loadTimePerCategory = true
      					this.loadAllLogs = true
      					this.loadTpoByCategoryTable = true
      				})      		
      		},
      		downloadData(){
      			this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/user/${this.form.user_id}/activity-summary/to-csv`, this.form)
      				.then(res => {
      					
      					var csv = res.data
					    var hiddenElement = document.createElement('a')
					    hiddenElement.href = 'data:text/csvcharset=utf-8,' + encodeURI(csv)
					    hiddenElement.target = '_blank'
					    hiddenElement.download = 'employee-activity.csv'
					    hiddenElement.click()

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
		    checkNull(val){
		    	if (!val){
		    		return "n/a"
		    	}
		    	return val
		    }
    	}
	}
</script>