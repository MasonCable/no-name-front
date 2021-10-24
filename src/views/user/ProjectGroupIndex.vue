<template>
    <v-container>
        <p v-for="item in data" :key="item.id">
            {{ item.id }}
        </p>  
    </v-container>
</template>

<script>
import DashboardDataTables from '@/views/dashboard/tables/DataTables'

export default {
    components: {
        DashboardDataTables
    },
    data: () => ({
        data: []
    }),
    mounted(){
        this.testing()
    },
    methods: {
        testing(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/client/${this.$route.params.id}/project-group`)
                .then(res => {
                    this.data = res.body.data
                }).catch(err => console.log(err))
        },
       
    }
}
</script>