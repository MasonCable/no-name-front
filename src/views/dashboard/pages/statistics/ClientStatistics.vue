<template>
	<v-container id="client-statistics" tag='section'>
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
		        :headers="clientHeaders"
		        :items="clientTable"
		        v-if="table"
		      >
			      <!-- <template v-slot:item.project_id="{ item }">{{ projectIdToName(item.project_id) }}</template> -->
			      <!-- <template v-slot:item.user_id="{ item }">{{ userIdToName(item.user_id) }}</template> -->
			      <template v-slot:item.total_minutes="{ item }">{{ convertMin(item.total_minutes) }}</template>
			      <template v-slot:item.company="{ item }">{{ checkCompanyName(item) }}</template>
      			</v-data-table>
      	</base-material-card>
	</v-container>
</template>

<script>
	import moment from 'moment'

	export default{
		data: () => ({
			table: false,
			form: {
				dates: [
					moment().subtract(1, 'months').format('YYYY-MM-DD'),
					moment().format("YYYY-MM-DD")
				   ]
				},
			menu: false,
			clientHeaders: [
			          { text: 'Company Name', value: 'company' },
			          { text: 'Client ID', value: 'client_id' },
			          { text: 'Total Time', value: 'total_minutes' },			          
			],
			clientTable: []
		}),
		mounted(){
			this.loadClientData()
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
    		loadClientData(){
    			this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/editor-log/time-data`, this.form)
    				.then(res => {
    					console.log(res.data)
    					this.clientTable = res.data
    					this.table = true
    				})
    		},
    		save (date) {
        		this.$refs.menu.save(date)
      		},
      		changeRequest(){
      			this.table = false
      			this.loadClientData()
      		},
      		convertMin(n){
		        var num = n
		        var hours = (num / 60)
		        var rhours = Math.floor(hours)
		        var minutes = (hours - rhours) * 60
		        var rminutes = Math.round(minutes)
		        return rhours + " hour(s) and " + rminutes + " minute(s)."
		    },
		    checkCompanyName(item){
		    	var name = item.company
		    	if(name){
		    		return name
		    	} else {
		    		return "No Name in TB Admin"
		    	}
		    }
    	}
	}
</script>