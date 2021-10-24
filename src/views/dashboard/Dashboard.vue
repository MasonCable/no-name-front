<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row>
      <v-col cols="12">
        <UserLogs/>
        <UserSchedule />        
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import UserSchedule from '@/views/dashboard/components/UserSchedule'
  import UserLogs from '@/views/dashboard/components/UserLogs'

  export default {
    components: {
      UserSchedule,
      UserLogs
    },
    data: () => ({
      loaded: false,
      user_id: null
    }),
    mounted(){
      // this.getUserId()

    },
    methods:{
      // getUserId(){
      //   this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/me`)
      //     .then(res => {
      //       this.user_id = res.data.id
      //       this.loaded = true
      //     })
      // }
    }
  }
</script>
