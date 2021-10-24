<template>
	<v-container
    	id="dashboard"
    	fluid
    	tag="section"
    >

		<base-material-card
	          color="green"
	          icon="mdi-timeline-check"
	          inline
	          class="px-5 py-3"
	          v-if="table"
	        >
	        <template v-slot:after-heading>
	        <div class="display-2 font-weight-light">
	            Daily Schedule
	        </div>
	      </template>
	    <v-data-table
	        :headers="headers"
	        :items="tableData"
	        :hide-default-footer="true"
	        
	      >
	      <!--<template v-slot:item.project_id="{ item }">{{ projectIdToName(item.project_id) }}</template> -->
	        <template slot="body.append">
	          <tr>
	              <td><span class="font-weight-bold">Total:</span></td>
	              <td><span class="font-italic">{{ convertMin(total) }}</span></td>
	              <td><span class="font-italic">{{ time }}</span></td>
	          </tr>
	        </template>
	      </v-data-table>
	    </base-material-card> 	
	</v-container>
</template>

<script>
	import DashboardDataTables from '@/views/dashboard/tables/DataTables'
	import moment from 'moment'

	export default{
		components: {
			DashboardDataTables
		},
		data: () => ({
	           
          headers: [
            {
              text: 'Project',
              value: 'project_name',
            },
            {	
            	text: 'Category',
            	value: 'schedule_category'
            },
            {
              text: 'Priority',
              value: 'priority'
            },
            {
              text: 'Hours',
              value: 'hours',
            },            
            {
              text: 'Minutes',
              value: 'minutes',
            },
			{
              text: 'Notes',
              value: 'notes',
            },
            {
              text: 'Date',
              value: 'valid_day',
            },
          ],        
	      tableData: [],
	      total: 0,
	      time: moment().format("YYYY-MM-DD"),
	      table: false,
		}),
		mounted(){
			this.getUserSchedule()			
		},
		methods: {
			getUserSchedule(){
				this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/schedule`)
					.then(res => {
						for(let i=0;i<res.body.data.data.length;i++){
							this.total = +res.body.data.data[i].minutes + +this.total
							// console.log(res.body.data.data[i].minutes)
						}			
						this.tableData = res.body.data.data
						this.table = true
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