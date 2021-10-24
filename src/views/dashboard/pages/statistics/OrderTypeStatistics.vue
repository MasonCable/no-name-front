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
		<v-row>
			<v-btn dark color="secondary" class="mr-2" @click="changeRequest">View Summary</v-btn>
			<v-btn dark color="primary" v-if="table" @click="downloadAsCsv">Download As Csv</v-btn>
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
			            Order Types And Word Counts
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
			headers: [			          			          
			          { text: 'Client ID', value: 'client_id' },
			          { text: 'Client', value: 'company' },
			          { text: 'Category ID', value: 'schedule_category_id' },
			          { text: 'Category', value: 'category' },
			          { text: 'Order Type', value: 'order_type' },
			          { text: 'Word Count', value: 'max_wordcount' },
			          { text: 'Total Orders', value: 'total_orders' },
			          { text: 'Total Spent', value: 'total_time' },			          			          
			],
			tableData: [],
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
      			this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/editor-log/order-types-and-wordcounts`, this.form)
      				.then(res => {
      					// console.log(res.data)
      					this.tableData = res.data
      					this.table = true
      					
      				})
      		},
      		downloadAsCsv(){
      			this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/editor-log/order-types-and-wordcounts-to-csv`, this.form)
      				.then(res => {
      					var csv = res.data
					    var hiddenElement = document.createElement('a')
					    hiddenElement.href = 'data:text/csvcharset=utf-8,' + encodeURI(csv)
					    hiddenElement.target = '_blank'
					    hiddenElement.download = 'order-types-wordcounts.csv'
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
		
		}
	}
</script>