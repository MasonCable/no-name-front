<template>
    <v-container id="role-view" tag="section">
        <RecordView
            :record="record"
            :recordData="recordData"
            v-if="loaded"
        />
        <v-btn color="orange" dark @click.stop="modal = true">
            View Permissions
          </v-btn>
           <v-dialog v-model="modal" scrollable max-width="300px">
      <v-card>
        <v-card-title>Select Permissions</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-radio-group v-model="modal" column>
            
            <v-switch 
              v-model="permission.has_permission"
                v-for="permission in allPermissions"
                @click="check(permission.permission_id, permission.has_permission)"
                :key="permission.id" 
                :label="permission.permission_name" 
                class="ma-2"></v-switch>

          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="modal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-container>
</template>

<script>
import RecordView from '@/components/RecordView'

export default {
    components: {
        RecordView
    },
    data: () => ({
        loaded: false,
        modal: false,
        allPermissions: [],
        recordData: {},
        record: {
            colNames: [
                { id: 0, name: 'ID', col: 'id' },
                { id: 1, name: 'Name', col: 'name' },
                { id: 2, name: 'Guard Name', col: 'guard_name' },
            ]
        },
       
    }),
    mounted(){
        this.loadRecordView()
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/role/${this.$route.params.id}/frontend`)
                .then(res => {
                    this.allPermissions = res.data.permissions_for_frontend
                })
    },
    methods: {
        loadRecordView(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/role/${this.$route.params.id}`)
                .then(res => {
                    this.recordData = res.data
                    this.record.title = "Role"
                    this.record.id = this.$route.params.id
                    this.loaded = true
                }).catch(err => console.log(err))
        },
        resetData(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/role/${this.$route.params.id}/frontend`)
            .then(res => {
                // this.user = res.data.user
                this.allPermissions = res.data.permissions_for_frontend
            })
            .catch(err => console.log(err))
      },
      check(permission, hasPermission){
        let data = { permission_id: permission }
        if(!hasPermission){
          // console.log("HAS ROLE")
          this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/role/${this.$route.params.id}/permission/revoke`, {...data})
            .then(res => {
              // this.roles = false
              this.resetData()
            })
            .catch(err => {
              this.roles = false
              console.log(err)
            })
        } else {
          // console.log("DOES NOT HAVE ROLE")
          this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/role/${this.$route.params.id}/permission/add`, {...data})
            .then(res => {
              // this.roles = false
              this.resetData()
            }).catch(err => {
              this.modal = false
              console.log(err)
            })
        }
      
      }
    }
}
</script>