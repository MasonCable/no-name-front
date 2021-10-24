<template>
	<!-- <v-container id="user-logs" tag="section"> -->
		<base-material-card
	          color="purple"
	          icon="mdi-timeline-check"
	          inline
	          class="px-5 py-3"
	        >
	        <template v-slot:after-heading>
	        <div class="display-2 font-weight-light">
	            Daily Logs
	        </div>
	      </template>
	    <v-data-table
	        :headers="headers"
	        :items="tableData"
	        
	        
	      >
	      <template v-slot:item.minutes="{ item }">{{ convertMin(item.minutes) }}</template>
	      <!--<template v-slot:item.project_id="{ item }">{{ projectIdToName(item.project_id) }}</template> -->
	        <template slot="body.append">
	          <tr>
	              <td><span class="font-weight-bold">Total:</span></td>
	              <td><span class="font-italic">{{ total }}</span></td>
	              <td><span class="font-italic">{{ time }}</span></td>
	          </tr>
	        </template>
	      </v-data-table>
	    </base-material-card>
	<!-- </v-container> -->
</template>

<script>
	import moment from 'moment'

	export default{
		props: {
			user_id: Number
		},
		data: () => ({
			time: moment().format("YYYY-MM-DD"),
			total: '',
			headers: [
	          { text: 'Project Name', value: 'project_name' },
	          { text: 'Client', value: 'client_name' },
	          { text: 'Category', value: 'schedule_category' },
	          { text: 'Time', value: 'minutes' },
	          { text: 'Category', value: 'schedule_category' },
	          { text: 'Date', value: 'completion_date' }
        	],
        	tableData: []
		}),
		mounted(){
			// console.log(this.user_id)
			this.loadLogs()
			
		},
		methods: {
			getTotalTime(){
				
			},
			loadLogs(){
				var id = localStorage.getItem('user_id')
				this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/${id}/log-data`)
					.then(res => {												 
						this.tableData = res.body.data
						let totalTime = 0
						for(let i=0;i<res.body.data.length;i++){
							totalTime += res.body.data[i].minutes
						}
						this.total = this.convertMin(totalTime)
					})
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