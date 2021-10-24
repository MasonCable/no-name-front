<template>
  <v-container 
        id="client-index"
        tag='section'>
    <DashboardDataTables
        :formData="formData"
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
        formData: {
          fields: [
            {
              id: 1,
              name: 'Textbroker ID',
              type: 'text',
              field: 'id',
              value: '',
              errors: ''
            },
            {
              id: 2,
              name: 'Notes',
              type: 'text',
              field: 'notes',
              value: '',
              errors: ''
            },
          ],
          buttonText: 'Add Client',
          formTitle: 'Add Client',
          postEndpoint: `${process.env.VUE_APP_SERVICE_URL}/client`
      },
      table: {
          headers: [
            {
              text: 'ID',
              value: 'id'
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
          title: "Clients Index",
          icon:"mdi-badge-account-horizontal-outline",
          endpoint: `${process.env.VUE_APP_SERVICE_URL}/client`,
          color: 'purple lighten-1',
          viewUrl: '/client/'
      },
    }),
    mounted(){
    }
  }
</script>
