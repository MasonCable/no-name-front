<template>
	<v-container id="user-statistics" tag='section'>
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
<!-- 		  <v-row>
		  	<v-autocomplete
                v-model="user_id"
                prepend-icon="mdi-account"
                :items="users"
                :menu-props="{ maxHeight: '400' }"
                label="Select Employee"
                persistent-hint
            ></v-autocomplete>
		  </v-row> -->
		  <v-row>
		  	<v-btn dark color="secondary" class="mr-2" @click="changeRequest">View Summary</v-btn>
		  	<v-btn dark color="primary" @click="convertToCsv">Download As Csv</v-btn>
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
			            Employee Activity Summary
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
			          { text: 'Client', value: 'company' },			          
			          { text: 'Client ID', value: 'client_id' },
			          { text: 'First Name', value: 'first_name' },
			          { text: 'Last Name', value: 'last_name' },
			          { text: 'Time Spent', value: 'total_time' },			          			          
			],
			tabledata: [],
			table: false
		}),
		mounted(){
			this.getMonthlySummary()
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
      			this.table = false
      			this.getMonthlySummary()      			
      		},
      		getMonthlySummary(){
      			this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/user/activity-summary`, this.form)
      				.then(res => {
      					// console.log(res.data)
      					this.tableData = res.data
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
		    },
		    convertToCsv(){
		    	var json = this.tableData
				var fields = Object.keys(json[0])
				var replacer = function(key, value) { return value === null ? '' : value } 
				var csv = json.map(function(row){
				  return fields.map(function(fieldName){
				    return JSON.stringify(row[fieldName], replacer)
				  }).join(',')
				})
				csv.unshift(fields.join(',')) // add header column
				 csv = csv.join('\r\n');
				// console.log(csv)

				this.download('order-types-wordcounts.csv', csv)
		    },
		    download(filename, text) {
			    var element = document.createElement('a');
			    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
			    element.setAttribute('download', filename);

			    element.style.display = 'none';
			    document.body.appendChild(element);

			    element.click();

			    document.body.removeChild(element);
			}
    	}
	}
</script>