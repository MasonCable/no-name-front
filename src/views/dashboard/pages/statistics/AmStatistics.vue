<template>
	<v-container id="am-statistics" tag='section'>
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
		  </v-row>
		  <v-row>
		  	<v-autocomplete
                v-model="user_id"
                prepend-icon="mdi-account"
                :items="users"
                :menu-props="{ maxHeight: '400' }"
                label="Select Employee"
                persistent-hint
            ></v-autocomplete>
		  </v-row>
		  <v-row>
		  	<v-btn dark color="secondary" @click="changeRequest">View Summary</v-btn>
		  </v-row>
		       	<base-material-card
			      color="green"
			      icon="mdi-badge-account-horizontal-outline"
			      inline
			      class="px-5 py-3"
			      v-if="table"  
			    >
			    <template v-slot:after-heading>
			        <div class="display-2 font-weight-light">
			            Project Statistics
			        </div>
			    </template>
		      <v-data-table
		        :headers="headers"
		        :items="tableData"
		        
		      >
			      <template v-slot:item.total_time="{ item }">{{ convertMin(item.total_time) }}</template>
			      <!-- <template v-slot:item.user_id="{ item }">{{ userIdToName(item.user_id) }}</template> -->
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
				]},
			menu: false,
			user_id: null,
			users: [],
			userReference: [],
			headers: [
			          { text: 'Client', value: 'client_name' },
			          { text: 'Time', value: 'total_time' },
			],
			tabledata: [],
			table: false
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
      		changeRequest(){
      			this.userReference.forEach(user => {
      				if(this.user_id == user.first_name+' '+user.last_name){
      					
      					this.user_id = user.id
      				}
      			})

      			this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/user/${this.user_id}/am-activity-summary`, this.form)
      				.then(res => {
      					this.tableData = res.data
      					this.table = true
      				})
      		},
      		loadUsers(){
      			this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/account-manager`)
      				.then(res => {
      					this.userReference = res.data
      					res.data.forEach(item => {
      						this.users.push(item.first_name + ' ' + item.last_name)
      					})
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