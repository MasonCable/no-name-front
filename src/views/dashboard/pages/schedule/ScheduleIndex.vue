<script>
import DashboardDataTables from '@/views/dashboard/tables/DataTables'
import moment from 'moment'

export default {
    components: {
        DashboardDataTables
    },
    data: () => ({
        date: null,
        menu: false,
        tableLoad: false,
        users: [],
        projects: [],
        table: {
            endpoint: `${process.env.VUE_APP_SERVICE_URL}/schedule`,
            actions: { text: 'Actions', value: 'actions', sortable: false },
            edit: { text: 'Edit', value: 'edit', sortable: false },
            formData: {
            singleSelect: true,
            select: {
                fields: [],
                fieldName: 'project_id',
                hint: 'Select Project',
            },
            select2:{
                fields: [],
                fieldName: 'user_id',
                hint: 'Select User'
            },
            fields: [
                {
                id: 1,
                name: 'Priority (number only)',
                type: 'number',
                field: 'priority',
                value: '',
                errors: ''

                },
                {
                id: 2,
                name: 'Second Check',
                type: 'checkbox',
                field: 'second_check',
                value: '',
                errors: ''
                },
                {
                id: 3,
                name: 'Hours (number only)',
                type: 'number',
                field: 'hours',
                value: '',
                errors: ''
                },
                {
                id: 4,
                name: 'Minutes (number only)',
                type: 'number',
                field: 'minutes',
                value: '',
                errors: ''
                },
                {
                id: 5,
                name: 'Notes',
                type: 'text',
                field: 'notes',
                value: '',
                errors: ''
                },
                {
                id: 6,
                name: 'Date (YYYY-MM-DD)',
                type: 'text',
                field: 'valid_day',
                value: moment().format("YYYY-MM-DD"),
                errors: ''
                }
            ],
            buttonText: 'Schedule',
            formTitle: 'Create new Schedule',
            postEndpoint: `${process.env.VUE_APP_SERVICE_URL}/schedule`
            },
            headers: [
                {
                    text: 'User ID',
                    value: 'user_id'
                },
                {
                    text: 'Project Id',
                    value: 'project_id'
                },
                {
                    text: 'Priority',
                    value: 'priority'
                },
                {
                    text: 'Second Check',
                    value: 'second_check'
                },
                {
                    text: 'Hours',
                    value: 'hours'
                },
                {
                    text: 'Minutes',
                    value: 'minutes'
                },
                {
                    text: 'Notes',
                    value: 'notes'
                },
                {
                    text: 'Date',
                    value: 'valid_day'
                }
            ],
            title: 'Schedule Index',
            icon: 'mdi-timeline-check',
        }
    }),
    watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
      endpoint(val){
        console.log(val)
      }
    },
    computed: {
        endpoint: function(){
            return `${process.env.VUE_APP_SERVICE_URL}/schedule`
        }
    },
    mounted(){
        this.getProjects()
        this.getUsers()
        this.tableLoad = true
    },
    methods: {
        save (date) {
            this.$refs.menu.save(date)
        },
        getProjects(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/project?page=1&perPage=100&sortBy=id&sortDesc=true&searchTerm=`)
                .then(res => {
                    var projects = res.body.data
                    this.projects = projects
                    this.table.formData.select.reference = projects
                    projects.forEach(item => {
                        if(!item.project_status){
                            this.table.formData.select.fields.push(item.name)
                        }
                    })
                }).catch(err => console.log(err))
        },
        getUsers(){
           this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/editors`)
            .then(res => {
                // console.log(res.body)
                var users = res.body
                this.users = users
                this.table.formData.select2.reference = users
                users.forEach(item => {
                    this.table.formData.select2.fields.push(item.first_name + ' ' + item.last_name)
                })
            }).catch(err => console.log(err)) 
        },
        changeRequest(){
            this.tableLoad = false
            this.update()
        },
        update(){
            this.table.endpoint = `${process.env.VUE_APP_SERVICE_URL}/schedule/day?day=${this.date}`
            setTimeout(() => this.tableLoad = true, 2000)
        }
    }
}
</script>

<template>
  <v-container 
        id="schedule-index"
        tag='section'>
  <v-flex x1 class="pt-3">
    <v-btn dark color="secondary" @click="changeRequest">Change Date</v-btn>
        <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            label="Select Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          ref="picker"
          v-model="date"
          
          min="1950-01-01"
          @change="save"
          @click="changeRequest"
        ></v-date-picker>
    </v-menu>
   </v-flex>    
     <DashboardDataTables
        :headers="table.headers"
        :title="table.title"
        :icon="table.icon"
        :endpoint="table.endpoint"
        :formData="table.formData"
        :users="users"
        :projects="projects"
        :actions="table.actions"
        :deleteEndpoint="table.endpoint"
        v-if="tableLoad"        
        />
</v-container>
</template>
