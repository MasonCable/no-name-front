<template>
    <v-container id="projectGroup-view" tag='section'>
     <v-row v-if="update">
        <EditProjectGroupForm :formData='formData' />
          <div class="relative">
            <v-btn class='mr-5' color="purple" dark @click.stop="modal = true">Add/Remove Projects</v-btn>
            <v-btn class='ml-5' color="blue" dark @click='updateAllProjects'>Update all projects</v-btn>
            <v-dialog v-model="modal" scrollable max-width="600px">
                <v-card>
                    <v-card-title>Select Projects</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 500px;">
                      <v-radio-group v-model="modal" column>
                        
                        <v-switch 
                          v-model="project.has_project"
                            v-for="project in allProjects"
                            @click="check(project.project_id, project.has_project)"
                            :key="project.id" 
                            :label="project.project_name" 
                            class="ma-2"></v-switch>

                      </v-radio-group>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-btn color="blue darken-1" text @click="modal = false">Close</v-btn>
                    </v-card-actions>
                  </v-card>
              </v-dialog>
          </div>
        </v-row>
        <RecordView
           :record="record"
           :recordData="recordData"
           v-if="loaded"
          />
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
            :headers="projectTimeHeaders"
            :items="projectTimeData"
            v-if="table"
          >
            <template v-slot:item.time_worked="{ item }">{{ convertMin(item.time_worked) }}</template>
            <!-- <template v-slot:item.user_id="{ item }">{{ userIdToName(item.user_id) }}</template> -->
            </v-data-table>
          </base-material-card>
        <base-material-chart-card
          :data="graph1.data"
          :options="graph1.options"
          v-if="graphLoaded1"
          color="success"
          type="Line"
          class="px-4 py-3"
        >
          <h4 class="display-1 font-weight-light mt-2">
            Order Completion History
          </h4>

          <div class="grey--text font-weight-light">
            Historical
          </div>
        </base-material-chart-card>
        <base-material-card
            id="coloured-line"
            v-if="graphLoaded2"
            color="warning"
            icon="mdi-chart-timeline-variant"
            class="px-4 py-3"
            >
            <template v-slot:after-heading>
                <div class="display-1 font-weight-light mt-2">
                Open orders Compared to Complete orders
                <!--<span class="subtitle-1">— Multiple</span> -->
                </div>
            </template>

            <chartist
                :data="graph2.data"
                :options="graph2.options"
                type="Line"
                style="max-height: 150px;"
                class="mt-3"
            />
            </base-material-card>
            <base-material-card
            id="coloured-line3"
            v-if="graphLoaded3"
            color="purple"
            icon="mdi-chart-timeline-variant"
            class="px-4 py-3"
            >
            <template v-slot:after-heading>
                <div class="display-1 font-weight-light mt-2">
                Author Submitted VS Not Submitted
                <!--<span class="subtitle-1">— Multiple</span> -->
                </div>
            </template>

            <chartist
                :data="graph3.data"
                :options="graph3.options"
                type="Line"
                style="max-height: 150px;"
                class="mt-3"
                color="purple"
            />
            </base-material-card>
       
<!--         <DashboardDataTables
            :headers="table.headers"
            :title="table.title"
            :icon="table.icon"
            :endpoint="endpoint"
            :viewUrl="table.viewUrl"
        /> -->
        
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
            :headers="table.headers"
            :items="tableData"
            v-if="loadTable"
          >
            </v-data-table>
          </base-material-card>
    </v-container>
</template>

<script>
import RecordView from '@/components/RecordView'
import DashboardDataTables from '@/views/dashboard/tables/DataTables'
import EditProjectGroupForm from '@/views/dashboard/pages/project/components/EditProjectGroupForm'

export default {
    components:{
        RecordView,
        DashboardDataTables,
        EditProjectGroupForm
    },
    data: () => ({
      projectTimeHeaders: [
                { text: 'Project name', value: 'project_name' },                
                { text: 'Total Logs', value: 'total_logs' },
                { text: 'Time Spent', value: 'time_worked' }
      ],
      tableData: [],
      projectTimeData: [],
      table: false,
      modal: false,
      loadTable: false,
      update: true,
      allProjects: [],
      loaded: false,
      graphLoaded1: false,
      graphLoaded2: false,
      graphLoaded3: false,
      graph1: {
      data: {
        labels: [],
        series: [],
      },
      options: {
         axisX: {
                labelInterpolationFnc: function(value, index) {
                    
                    return index % 7  === 0 ? value : null;
                },
            },
        low: 0,
        high: 0, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
    graph2: {
    data: {
      labels: [],
      series: [
        [],
        []
      ],
    },
    options: {
          axisX: {
          labelInterpolationFnc: function(value, index) {
              return index % 7  === 0 ? value : null;
              // return value.slice(5, 10);
          },
      },
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  },
  graph3: {
    data: {
      labels: [],
      series: [
        [],
        []
      ],
    },
    options: {
          axisX: {
          labelInterpolationFnc: function(value, index) {
              return index % 7  === 0 ? value : null;
              // return value.slice(5, 10);
          },
      },
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  },
      recordData: {},
      record: {
        colNames: [
          { id: 0, name: 'Total Projects', col: 'total_projects' },
          { id: 1, name: 'Total Orders', col: 'total_orders' },
          { id: 2, name: 'Total Accepted Orders', col: 'total_accepted' },
          { id: 3, name: 'Total Time Spent First Checks', col: 'total_time_first_checks' },
          { id: 4, name: 'Total Time Spent Second Checks', col: 'total_time_second_checks' },
          { id: 5, name: 'Total First Checks', col: 'total_first_checks' },
          { id: 6, name: 'Total Second Checks', col: 'total_second_checks' },
        ]
      },
        routeBack: "/pages/project-group",
        showProject: false,
        table: {
          tableData: [],
          headers: [
            {
              text: 'ID',
              value: 'id'
            },
            {
              text: 'Name',
              value: 'name',
            },
            
            {
              text: 'Notes',
              value: 'notes',
            },
            {
              text: 'Created At',
              value: 'created_at',
            },
          ],
          title: "Projects",
          icon:"mdi-badge-account-horizontal-outline",
          
          color: 'lime',
          viewUrl: '/pages/project/'
        },
        formData: {
            // Fields for creating a Project group
            fields: [
            {
              id: 1,
              name: 'Name',
              type: 'text',
              field: 'name',
              value: '',
              errors: ''
            },
            {
              id: 2,
              name: 'Description',
              type: 'text',
              field: 'description',
              value: '',
              errors: ''
            },
            // {
            //   id: 3,
            //   name: 'Client ID',
            //   type: 'text',
            //   field: 'client_id',
            //   value: null,
            //   errors: ''
            // }
          ],
          buttonText: 'Edit',
          formTitle: 'Edit Project Group',
          postEndpoint: `${process.env.VUE_APP_SERVICE_URL}/project-group`
        },
    }),
    computed: {
        deleteEndpoint: function(){
            return `${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}`
        },
        endpoint: function(){
            return `${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}/projects`
        },
        editEndpoint: function(){
          return `${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}`
        },
        updateEndpoint: function(){
          return `${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}/update-all-projects`
        }
    },
    mounted(){
      this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}/frontend`)
        .then(res => {
          this.allProjects = res.data.projects_for_frontend.reverse()
          
        }).catch(err => console.log(err))
        // ------COMBINE THESE 2 FUNCTIONS--------
        this.loadFistStats()
        // this.loadStatistics()
        // _--------------------------------------
        this.loadGraphData1()
        this.loadGraphData2()
        this.loadGraphData3()
        this.createFormData()
        this.loadProjects()
        this.formData.postEndpoint = this.editEndpoint
    },
    methods: {
      loadFistStats(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}/statistics`)
          .then(res => {
            this.recordData = res.data.statistics
            this.record.title = "Project Group Statistics"
            this.record.id = this.$route.params.id
            this.loaded = true
            this.projectTimeData = res.data.hours_worked
            this.table = true
          })
      },
      loadStatistics(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}/statistics`)
          .then(res => {
            this.recordData = res.data
            this.record.title = "Project Group Statistics"
            this.record.id = this.$route.params.id
            this.loaded = true
            
          })
          .catch(err => console.log(err))
      },
      loadGraphData1(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}/articles/order-completion`)
          .then(res => {
              this.graph1.data.labels = res.data.labels
              this.graph1.data.series.push(res.data.series)
              this.graph1.options.high = res.data.high + 5
              this.xAxisLabels(res.data.labels.length, "this.graph1")
              this.graphLoaded1 = true
          }).catch(err => console.log(err))
      },
      loadGraphData2(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}/articles/not-complete`)
          .then(res => {
              this.graph2.data.labels = res.data.labels
              this.graph2.data.series[0] = res.data.series1
              this.graph2.data.series[1] = res.data.series2
              this.graph2.options.high = res.data.high + 5
              this.xAxisLabels(res.data.labels.length, "this.graph2")
              this.graphLoaded2 = true
          }).catch(err => console.log(err))
      },
       loadGraphData3(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}/articles/not-complete`)
          .then(res => {
              this.graph3.data.labels = res.data.labels
              this.graph3.data.series[0] = res.data.series2
              this.graph3.data.series[1] = res.data.series1
              this.graph3.options.high = res.data.high + 5
              this.xAxisLabels(res.data.labels.length, "this.graph3")
              this.graphLoaded3 = true
          }).catch(err => console.log(err))
      },
      createFormData(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}`)
          .then(res => {
              this.formData.fields[0].value = res.data.projectGroup.name
              this.formData.fields[1].value = res.data.projectGroup.description              
          }).catch(err => console.log(err))
      },
      resetData(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}/frontend`)
            .then(res => {
                // this.user = res.data.user
                this.allProjects = res.data.projects_for_frontend
            })
            .catch(err => console.log(err))
      },
       check(project, hasProject){
        let data = { project_id: project }
        if(!hasProject){
          // console.log("HAS ROLE")
          this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}/project/remove`, {...data})
            .then(res => {
              // this.roles = false
              this.resetData()
            })
            .catch(err => {
              this.modal = false
              console.log(err)
            })
        } else {
          // console.log("DOES NOT HAVE ROLE")
          this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/project-group/${this.$route.params.id}/project/add`, {...data})
            .then(res => {
              // this.roles = false
              this.resetData()
            }).catch(err => {
              this.modal = false
              console.log(err)
            })
        }
      
      },
      updateAllProjects(){
        this.$store.state.loading = true
        this.$http.get(this.updateEndpoint)
          .then(res => {
            window.location.reload()
          }).catch(err => console.log(err))
        
      },
      loadProjects(){
        this.$http.get(this.endpoint)
          .then(res => {
            console.log(res.data)
            this.tableData = res.body.data
            // console.log(res.body.data)
            this.loadTable = true
          })
      },
      xAxisLabels(labels, graphNum){
          // labels variable is the length of the array of labels
          // The following variable will take in the graph varaible as a string and return as a varaible
          var graph = eval(graphNum)
          if(labels < 15){
              // make no changes to the labels if the array is less than 15 
              graph.options.axisX = {} 
          } else if(labels > 25 && labels < 40){
              graph.options.axisX = { labelInterpolationFnc: function(value, index) { return index % 15  === 0 ? value : null } }
          } else if(labels < 25 && labels > 20){
              graph.options.axisX = { labelInterpolationFnc: function(value, index) { return index % 20  === 0 ? value : null } }
          }  else if(labels > 40){
              graph.options.axisX = { labelInterpolationFnc: function(value, index) { return index % 10  === 0 ? value : null } }
          } else if(labels > 15 && labels < 20){
              graph.options.axisX = { labelInterpolationFnc: function(value, index) { return index % 7  === 0 ? value : null } }
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

<style scoped>
  .relative {   
    padding: 10px;
    position: relative;
    margin: 10px;
  }
</style>