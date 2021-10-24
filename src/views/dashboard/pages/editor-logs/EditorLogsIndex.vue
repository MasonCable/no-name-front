<template>
    <v-container tag="section">
         <DashboardDataTables
                    :headers="table.headers"
                    :title="table.title"
                    :icon="table.icon"
                    :endpoint="tableEndpoint"
                    :actions="table.delete"
                    :deleteEndpoint="tableEndpoint"
                    v-if="loadTable"
                    />
    </v-container>
</template>

<script>
import DashboardDataTables from '@/views/dashboard/tables/DataTables'

export default {
    components: {
        DashboardDataTables
    },
    data: () => ({
        loadTable: false,
        allUsers: [],
        allProjects: [],
        render: false,
        tableEndpoint: `${process.env.VUE_APP_SERVICE_URL}/editor-log`,
        table: {
            delete: { text: 'Actions', value: 'delete', sortable: false },            
            title: 'Editor Logs',
            icon: 'mdi-sort-clock-descending',
            
            headers: [
                {
                    text: 'User Name',
                    value: 'user_name'
                },
                {
                    text: 'Project Name ',
                    value: 'project_name'
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
                    text: 'Category',
                    value: 'schedule_category'
                },
                {
                    text: 'Completion Date',
                    value: 'completion_date'
                },
                {
                    text: 'TPO Notes',
                    value: 'note'
                }
            ]
        }
    }),
    mounted(){
        // this.loadProjects()
        // this.loadUsers()
        // setTimeout(() => this.loadTable = true, 4000)
        this.loadTable = true
    },
    methods: {

        
    }
}
</script>