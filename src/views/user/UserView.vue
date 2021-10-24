<template>
<v-container tag='section'>
<v-row>

  <v-card
    max-width="375"
    
  >
    <v-img
      src="../../assets/pricing.jpg"
      height="400px"
      dark
    >
      <v-row class="fill-height">
      <!--   <v-card-title>
          <v-btn dark icon>
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn dark icon class="mr-4">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <v-btn dark icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-card-title> -->

        <v-spacer></v-spacer>

        <v-card-title class="white--text pl-12 pt-12">
          <div class="display-1 pl-12 pt-12">{{ user.first_name }} {{ user.last_name }}</div>
        </v-card-title>
      </v-row>
    </v-img>

    <v-list two-line>
      <v-list-item >
        <v-list-item-icon>
          <v-icon color="indigo">mdi-phone</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ user.phone_number || 'N/A' }}</v-list-item-title>
          <v-list-item-subtitle>Mobile</v-list-item-subtitle>
        </v-list-item-content>

        
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item >
        <!-- <v-list-item-action></v-list-item-action> -->
         <v-list-item-icon>
          <v-icon color="indigo">mdi-email</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ user.email }}</v-list-item-title>
          <v-list-item-subtitle>Work</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item >
        <v-list-item-icon>
          <v-icon color="indigo">mdi-map-marker</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>8076 W Saharah ave</v-list-item-title>
          <v-list-item-subtitle>Las Vegas, NV 89012</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

       <v-divider inset></v-divider>
      <v-list-item >
        <v-list-item-icon>
          <v-icon color="indigo">mdi-account-hard-hat</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-btn color="orange" dark @click.stop="roles = true">
            View Roles
          </v-btn>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>
      <v-list-item >
        <v-list-item-icon>
          <v-icon color="indigo">mdi-delete</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-btn color="red" dark @click.stop="dialog = true">
            Delete User
          </v-btn>
        </v-list-item-content>
      </v-list-item>

     
    </v-list>
  </v-card>
   <!-- <FormModal
      :model="user"
  /> -->
  
  
  <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="420" class='align-center'>
        
        <v-card>
          <v-card-title class="headline">Delete {{ user.first_name + ' ' + user.last_name }}?</v-card-title>
          <v-card-text>Deleting a user will remove the user and all of their associated data. Do you still want to proceed?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">Cancel</v-btn>
            <v-btn color="red darken-1" text @click="open">Proceed</v-btn>
            
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- THIS IS THE FORM FOR CONFIRMING THE DELETE -->
      <v-dialog v-model="credential_form" persistent max-width="420">
        <v-card>
          <v-card-title class="headline">Delete {{ user.first_name + ' ' + user.last_name }}?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="credential_form = false">Cancel</v-btn>
            <!--<v-btn color="red darken-1" text @click="confirmDelete">AGREE</v-btn>-->
            <DeleteButton :endpoint='endpoint' :afterDelete='afterDelete' />
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- THIS IS THE USER ROLES COMPONENT -->
      <v-dialog v-model="roles" scrollable max-width="300px">
      <v-card>
        <v-card-title>Select Roles</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-radio-group v-model="roles" column>
            
            <v-switch 
              v-model="role.has_role"
                v-for="role in allRoles"
                @click="check(role.role_id, role.has_role)"
                :key="role.role_id" 
                :label="role.role_name" 
                class="ma-2"></v-switch>

          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="roles = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-row>

  </v-row>
        <base-material-card
          color="green"
          icon="mdi-timeline-check"
          inline
          class="px-5 py-3"  
        >
        <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
            Schedule
        </div>
      </template>
    <v-data-table
        :headers="headers"
        :items="tableData"
        :hide-default-footer="true"
        
      >
      <template v-slot:item.project_id="{ item }">{{ projectIdToName(item.project_id) }}</template>
        <template slot="body.append">
          <tr>
              <td><span class="font-weight-bold">Total:</span></td>
              <td><span class="font-italic">{{ total }}</span></td>
              <td><span class="font-italic">{{ time }}</span></td>
          </tr>
        </template>
      </v-data-table>
    </base-material-card>
      <!-- Editor Logs -->
        <base-material-card
          color="purple"
          icon="mdi-timeline-check"
          inline
          class="px-5 py-3"  
        >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
            Editor Logs
        </div>
      </template>
      <v-data-table
        :headers="headers2"
        :items="tableData2"
        :hide-default-footer="true"
        class=""
      >
      <template v-slot:item.project_id="{ item }">{{ projectIdToName(item.project_id) }}</template>
        <template slot="body.append">
          <tr>
              <td><span class="font-weight-bold">Total:</span></td>
              <td><span class="font-italic">{{ total2 }}</span></td>
              <td><span class="font-italic">{{ time }}</span></td>
          </tr>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>


<script>
import moment from 'moment'
import DeleteButton from '@/components/DeleteButton'

export default {
    name: 'user-view',
    components: { DeleteButton },
    data: () => ({
      allProjects: [],
      total: null,
      total2: null,
      time: moment().format('LLL'),
      headers: [
          { text: 'Project Name', value: 'project_name' },
          { text: 'Time', value: 'time' },
          { text: 'Category', value: 'schedule_category' },
          { text: 'Date', value: 'date' }
        ],
        headers2: [
          { text: 'Project Name', value: 'project_name' },
          { text: 'Time', value: 'time' },
          { text: 'Category', value: 'schedule_category' },
          { text: 'Date', value: 'date' }
        ],
        tableData: [],
        tableData2:[],
        dialog: false,
        credential_form: false,
        roles: false,
        link: '',
        user: {},        
        allRoles: [],
        endpoint: '',
        afterDelete: '/pages/users'
    }),
    mounted(){
        
        this.getUserScheduleData()
        this.getUserLogData()
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/${this.$route.params.id}`)
        .then(res => {
            this.user = res.data.user     
              
            this.allRoles = res.data.roles_for_frontend
            this.endpoint = `${process.env.VUE_APP_SERVICE_URL}/user/${res.data.user.id}/delete`
        })
        .catch(err => console.log(err))
    },
    
    methods: {
      projectIdToName(val){
          for (let i=0; i < this.allProjects.length; i++) {
            if (this.allProjects[i].id === val) {
                return this.allProjects[i].name
            }
          }
      },
      getUserScheduleData(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/${this.$route.params.id}/schedule-data`)
          .then(res => {
            // console.log(res.data)
            this.tableData = res.data.table_data
            this.total = this.convertMin(res.data.total_time)
          })
      },
      getUserLogData(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/${this.$route.params.id}/log-data`)
          .then(res => {
            // console.log(res.data)
            this.tableData2 = res.data.table_data
            this.total2 = this.convertMin(res.data.total_time)
          })
      },
      open(){
        this.dialog = false
        this.credential_form = true
      },
      confirmDelete(e){
        e.preventDefault()

        this.$http.delete(`${process.env.VUE_APP_SERVICE_URL}/user/${this.$route.params.id}/delete`)
          .then(res => {
            this.credential_form = false
            this.$router.push('/pages/users')
          }).catch(err => {
            console.log(err)
            this.credential_form = false
          })
      },
      saveRoles(e) {
        e.preventDefault()

        
      },
      resetData(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/${this.$route.params.id}`)
          .then(res => {
            // this.user = res.data.user
            this.allRoles = res.data.roles_for_frontend
        })
        .catch(err => console.log(err))
      },
      check(role, hasRole){
        let data = { role_id: role }
        if(!hasRole){
          // console.log("HAS ROLE")
          this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/role/user/${this.user.id}/remove`, {...data})
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
          this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/user/${this.user.id}/role/grant`, {...data})
            .then(res => {
              // this.roles = false
              this.resetData()
            }).catch(err => {
              this.roles = false
              console.log(err)
            })
        }
      
      },
      convertMin(n){
        var num = n
        var hours = (num / 60)
        var rhours = Math.floor(hours)
        var minutes = (hours - rhours) * 60
        var rminutes = Math.round(minutes)
        return rhours + " hour(s) and " + rminutes + " minute(s)."
      }
    }
}
</script>
