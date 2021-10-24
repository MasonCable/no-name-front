<template>
<v-container 
        id="project-index"
        tag='section'>
    <DashboardDataTables
        :headers="table.headers"
        :title="table.title"
        :icon="table.icon"
        :endpoint="table.endpoint"
        :viewUrl="table.viewUrl"
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
        table: {
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
              text: 'Client',
              value: 'client_id',
            },
            {
              text: 'Due Date',
              value: 'due_date',
            },
            {
              text: 'Project Status',
              value: 'project_status',
            },
          ],
          title: "Projects Index",
          icon:"mdi-badge-account-horizontal-outline",
          endpoint: `${process.env.VUE_APP_SERVICE_URL}/project`,
          color: 'lime',
          viewUrl: '/pages/project/'
        },
    }),
    mounted(){
    }
}
</script>
