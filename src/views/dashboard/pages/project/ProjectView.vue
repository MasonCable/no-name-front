<template>
    <v-container id="project-view" tag='section'>
    <v-btn
        rounded
        color="blue"
        @click="updateTbInfo"
        v-if='loaded'
    >
    Update 
    </v-btn>
    <span>Updated {{ timeDiff }}</span>
        <RecordView 
            :record="record"
            :recordData="recordData"
            v-if="loaded"
        />
         
        <base-material-chart-card
          :data="graph.data"
          :options="graph.options"
          v-if="graphLoaded"
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
        <DashboardDataTables
            :headers="table.headers"
            :title="table.title"
            :icon="table.icon"
            :endpoint="endpoint"
            :viewUrl="table.viewUrl"
            v-if="articles"
            />
    </v-container>
</template>

<script>
import RecordView from '@/components/RecordView'
import DashboardDataTables from '@/views/dashboard/tables/DataTables'
import moment from 'moment'
import store from '../../../../store';
export default {
    components: {
        RecordView,
        DashboardDataTables
    },
    data: () => ({
        graphLoaded: false,
        graphLoaded2: false,
        graphLoaded3: false,
        graph: {
          data: {
            labels: [],
            series: [],
          },
          options: {
               axisX: {
                labelInterpolationFnc: function(value, index) {
                     return index % 7  === 0 ? value : null;
                    // return value.slice(5, 10);
                    
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
      timeDiff: '',
      loaded: false,
      articles: false,
        table: {
            title: 'Project Articles',
            // Where to redirect the user after they click an item
            viewUrl: '/pages/articles/',
            icon: 'mdi-file-document-multiple-outline',
            headers: [
                {

                },
                {
                    text: 'ID',
                    value: 'id'
                },
                {
                    text: 'Notes',
                    value: 'notes'
                },
                {
                    text: 'Project Id',
                    value: 'project_id'
                },
                {
                    text: 'Headline',
                    value: 'headline'
                },
                {
                    text: 'Word Count',
                    value: 'word_count'
                },
                {
                    text: 'Star Level',
                    value: 'star_level'
                },
                {
                    text: 'Author Submit',
                    value: 'author_submitted_at'
                },
                {
                    text: 'Placed At',
                    value: 'placed_at'
                },
            ],
            
        },
        record: {
            colNames: [
                { id: 0, name: 'ID', col: 'id' },
                { id: 1, name: 'Client ID', col: 'client_id' },
                { id: 2, name: 'Name', col: 'name' },
                { id: 3, name: 'Notes', col: 'notes' },
                { id: 4, name: 'Project Status', col: 'project_status' },
            ]
        },
        recordData:{},
       
    }),
    computed: {
        endpoint: function () {
            return `${process.env.VUE_APP_SERVICE_URL}/project/${this.$route.params.id}/articles`
        }
    },
    mounted(){
        this.loadProjectData()
        this.loadGraphData1()
        this.loadGraphData2()
        this.loadGraphData3()
        this.articles = true
        
    },
    methods:{
        loadProjectData(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project/${this.$route.params.id}`)
            .then(res => {
                this.recordData = res.data.project
                this.record.title = "Project"
                this.record.id = this.$route.params.id
                this.timeDiff = moment(res.data.project.updated_at).fromNow()
                this.loaded = true
                
            })
            .catch(err => console.log(err))
        },
        loadProjectArticles(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project/${this.$route.params.id}/article/update`)
                .then(res => {
                    this.articles = true
                    window.location.reload()
                }).catch(err => console.log(err))
        },
        updateTbInfo(){
            this.timeDiff = 0
            this.$store.state.loading = true
            // console.log(store.state.loading)
            this.articles = false
            this.graphLoaded1 = false
            this.graphLoaded2 = false
            this.graphLoaded3 = false
            this.loadProjectArticles()            
        },
        loadGraphData1(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project/${this.$route.params.id}/articles/order-completion`)
                .then(res => {
                    this.graph.data.labels = res.data.labels
                    this.graph.data.series.push(res.data.series)
                    this.graph.options.high = res.data.high + 5    
                    this.xAxisLabels(res.data.labels.length, "this.graph")
                    this.graphLoaded = true
                }).catch(err => console.log(err))
        },
        loadGraphData2(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project/${this.$route.params.id}/articles/not-complete`)
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
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project/${this.$route.params.id}/articles/author-submitted-at`)
                .then(res => {
                    this.graph3.data.labels = res.data.labels
                    this.graph3.data.series[0] = res.data.series2
                    this.graph3.data.series[1] = res.data.series1
                    this.graph3.options.high = res.data.high + 5
                    this.xAxisLabels(res.data.labels.length, "this.graph3")
                    this.graphLoaded3 = true
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
                graph.options.axisX = { labelInterpolationFnc: function(value, index) { return index % 10  === 0 ? value : null } }
            }  else if(labels > 40){
                graph.options.axisX = { labelInterpolationFnc: function(value, index) { return index % 20  === 0 ? value : null } }
            } else if(labels > 15 && labels < 20){
                graph.options.axisX = { labelInterpolationFnc: function(value, index) { return index % 7  === 0 ? value : null } }
            }
        }
    }
}
</script>

