<template>
<v-container 
        id="login-attempt"
        tag='section'>
     <DashboardDataTables
        :headers="table.headers"
        :title="table.title"
        :icon="table.icon"
        :endpoint="endpoint"        
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
                    text: 'IP Address',
                    value: 'ip_address'
                },
                {
                    text: 'Email',
                    value: 'email'
                },
                {
                    text: 'Login Success',
                    value: 'login_success'
                },
                {
                    text: 'Time',
                    value: 'created_at'
                },
            ],
            title: 'Login Attempts',
            icon: 'mdi-login-variant',
        }
    }),
    computed: {
        endpoint: function(){
            return `${process.env.VUE_APP_SERVICE_URL}/logging/login-attempt`
        }
    }    
}
</script>