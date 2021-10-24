<template>
    <v-container 
        id="client-view"
        tag='section'>
        <v-row>
        <v-btn v-if='loaded' :to="`/client/generate/${clientId}`" rounded color="pink">Generate Project</v-btn>
             <v-btn
                rounded
                color="blue"
                @click="updateTbInfo"
                v-if='loaded'
                >
                Update 
             </v-btn>
                <span v-if='loaded'>Updated {{ timeDiff }}</span>
        </v-row>
        <RecordView 
            :record="record"
            :recordData="recordData"
            v-if="loaded"
        />       


            <DashboardDataTables
                :headers="table.headers"
                :title="table.title"
                :icon="table.icon"
                :endpoint="tableEndpoint"
                :viewUrl="table.viewUrl"
                v-if="projectRender"
            />
            <!-- PASS formData props-->
            <DashboardDataTables
                :formData="formData"
                :headers="projectGroupsTable.headers"
                :title="projectGroupsTable.title"
                :icon="projectGroupsTable.icon"
                :endpoint="projectGroupsTableEndpoint"
                :viewUrl="projectGroupViewUrl"
                v-if="projectRender"
            />

    </v-container>
</template>


<script>
import DeleteButton from '@/components/DeleteButton'
import DashboardDataTables from '@/views/dashboard/tables/DataTables'
import RecordView from '@/components/RecordView'
import moment from 'moment'

export default {
    name: 'client-view',
    components: {
        DeleteButton,
        DashboardDataTables,
        RecordView
    },
    data: () => ({
        projectGroupViewUrl: "/pages/project-group/",
        projectRender: false,
        formData: {
            select: {
                fields: [],
                fieldName: 'projects',
                hint: 'Select Projects',
                // postLink: `${process.env.VUE_APP_SERVICE_URL}/project-group/{projectGroup}/assign-projects`
            },
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
            {
              id: 3,
              name: 'Client ID',
              type: 'text',
              field: 'client_id',
              value: null,
              errors: ''
            }
          ],
          buttonText: 'Create Project Group',
          formTitle: 'Create Project Group',
          postEndpoint: `${process.env.VUE_APP_SERVICE_URL}/project-group`
        },
        projectGroupsTable: {
            headers: [
                {
                    text: 'ID',
                    value: 'id'
                },
                {
                    text: 'Name',
                    value: 'name'
                },
                {
                    text: 'Description',
                    value: 'description'
                },
            ],
            title: "ProjectGroups",
            icon:"mdi-badge-account-horizontal-outline",
            endpoint: ''
        },
        table: {
            headers: [
                {
                    text: 'ID',
                    value: 'id'
                },
                {
                    text: 'Name',
                    value: 'name'
                },
                {
                    text: 'Due Date',
                    value: 'due_date'
                }
            ],
            title: "Client Projects",
            icon: 'mdi-update',
            viewUrl: '/pages/project/',
            icon:"mdi-badge-account-horizontal-outline",
        },
          // This is the object that is being sent to the RecordView Component
            // All data is being updated on buildRecordData()
                // If you are confused, message Mason, he probably knows whats up
        record: {
            colNames: [
                {
                    id: 0,
                    name: 'Company Name',
                    col: 'company'
                },
                {
                    id: 1,
                    name:'ID',
                    col: 'id'
                },
                {
                    id: 2,
                    name:'Notes',
                    col: 'notes'
                },
                {
                    id: 3,
                    name:'First Name',
                    col: 'first_name'
                },
                {
                    id: 4,
                    name:'Last Name',
                    col: 'last_name'
                },
            ]
        },
        // This is the current Data that you want to display, make sure it correlates with the order of your record.colNames
        recordData: {},
        loaded: false,
        client: {},
        clientId: '',
        afterDelete: '/client',
        color: 'green',
        icon:"mdi-badge-account-horizontal-outline",
        timeDiff: ''
    }),
    mounted(){
        this.table.endpoint = `${process.env.VUE_APP_SERVICE_URL}/client/${this.$route.params.id}/projects`
        this.getProjectNames()
        this.formData.fields[2].value = this.$route.params.id
        this.clientId = this.$route.params.id
        this.projectGroupsTable.endpoint = `${process.env.VUE_APP_SERVICE_URL}/client/${this.$route.params.id}/project-group`
        this.updateClient()
        this.getLatestProjects()
    },
    computed: {
        projectGroupsTableEndpoint: function () {
            return `${process.env.VUE_APP_SERVICE_URL}/client/${this.$route.params.id}/project-group`
        },
        tableEndpoint: function () {
            return `${process.env.VUE_APP_SERVICE_URL}/client/${this.$route.params.id}/projects`
        }
    },
    methods: {
        updateClient() {
            
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/client/${this.clientId}`)
            .then(res => {
                // this.client = res.body.data
                
                // Set the data for the RecordView component
                this.record.title = "Client"
                this.record.id = this.$route.params.id
                this.recordData = res.data.client
                this.loaded = true
                this.getProjectNames()
                this.projectRender = true
                this.timeDiff = moment(res.data.client.updated_at).fromNow()
                this.$store.state.loading = false
            })
            .catch(err => console.log(err))
        },
        updateTextbrokerInfo() {
            
            this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/client/${this.clientId}/textbroker`)
            .then(res => {
                this.updateClient()

            })
            .catch(err => console.log(err))   
        },
        buildRecordData(){
            // String that displays what "model" this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/client/${this.$route.params.id}/projects/update`)is displayed
            this.record.title = "Client"
            // This is the record ID that is sent to the component
            this.record.id = this.$route.params.idprojectRender
        },
        getLatestProjects(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/client/${this.$route.params.id}/projects/update`)
                .then(res => {
                    this.projectRender = true
                }).catch(err => console.log(err))
        },
        getProjectNames(){
            this.$http.get(`${this.table.endpoint}?page=1&perPage=150&sortBy=id&sortDesc=true&searchTerm=`)
                .then(res => {
                    var projects = res.data.data
                    this.formData.select.reference = projects
                    projects.forEach(item => {
                        this.formData.select.fields.push(item.name)
                    });
                })
        },
        updateTbInfo(){
            this.loaded = false
            this.projectRender = false
            this.$store.state.loading = true
            this.updateTextbrokerInfo()
        }
    }
}
</script>