<template>
    <v-container id="generate-project" tag='section'>
        <v-snackbar
          v-model="snackbar"
          :timeout="timeout"
          absolute
          shaped
          left
          top
        >
          Unable to auto fill form
          <template v-slot:action="{ attrs }">
            <v-btn
              color="blue"
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
    <h1>Project Name: <span v-if="loaded" color="" class="font-italic">{{ project_name }}</span></h1>
        <v-form>
              <v-autocomplete
                v-model="project"
                :items="referenceProjects"
                :menu-props="{ maxHeight: '400' }"
                label="Reference Project"
                hint="Select Project"
                persistent-hint
                @change="fillForm"
                ></v-autocomplete>
             <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="date"
                        label="Due Date"
                        
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker                
                v-model="date"
                
                min="1950-01-01"
                @change="save"
                ></v-date-picker>
            </v-menu>
            <!-- <v-divider class="mb-3"></v-divider> -->
            <v-text-field
                v-model="maxWords"
                label='Max Words'
                hide-details
                single-line
                type="number"
                />
            <!-- <v-divider class="mb-3"></v-divider> -->
            <v-text-field
                v-model="numberOfOrders"
                label='Number of Orders'
                hide-details
                single-line
                type="number"
                />
            <!-- <v-divider class="mb-3"></v-divider> -->
            <v-text-field
                v-model="editorTPO"
                label='Editor TPO'
                hide-details
                single-line
                type="number"
                />
            <!-- <v-divider class='mb-3'></v-divider> -->
            <v-autocomplete
            v-model="am"
            :items="users"
            label="Account Manager"
            
            ></v-autocomplete>
            <!-- <v-divider class='mb-3'></v-divider> -->
            <v-select
            v-model="stage"
            :items="stages"
            label="Stage"
            
            ></v-select>
            <!-- <v-divider class='mb-3'></v-divider> -->
            <v-select
            v-model="afterEdit"
            :items="afterEdits"
            label="After edit"
            
            ></v-select>
            <!-- <v-divider class="mb-3"></v-divider> -->
            <v-text-field
            v-model="orderType"
            label="Order Type"
            ></v-text-field>
            <v-btn color="success" @click="createProjectName">Create Project</v-btn>
        </v-form>
    </v-container>
</template>

<script>
import moment from 'moment'

export default {
    data: () => ({
      snackbar: false,
      timeout: 2000,
      project: null,
      referenceProjects: [],
      date: null,
      clientName: null,
      clientId: null,
      maxWords: null,
      numberOfOrders: null,
      editorTPO: null,
      stage: null,
      afterEdit: null,
      orderType: '',
      am: null,
      stages: ["Pilot", "Ongoing", "Special"],
      afterEdits: ["Leave In Interim", "Redirect To Clients", "Accept Some Orders"],
      users: [],
      menu: false,
      loaded: false,
      project_name: null,
      projectReference: []
    }),
    mounted(){
      this.pullClientProjects()
        this.getClient()
        this.getUsers()
    },
    watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
    },
    methods: {
      save (date) {
        this.$refs.menu.save(date)
      },
      pullClientProjects(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/client/${this.$route.params.id}/index-all`)
          .then(res => {
            this.projectReference = res.body.data
            res.body.data.forEach(item => {
              this.referenceProjects.push(item.name)
            })
          })
      },
      createProjectName(){
          if(!this.clientName) {
            alert("The client does not have a company name in TB admin, make sure to add one.")
          }
          var projectName = ""
          var formattedDate = this.date
          var orderT = !this.orderType ? '' : this.orderType.replace('_', ' ')
          var user = this.am.substr(0,4)
          var after_edit = this.afterEdit.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')
          var stg = this.stage.substr(0,3).toUpperCase()
          var clientname = this.clientName.replace(/\s/g, '')
          projectName = formattedDate + '_' + 
                        this.numberOfOrders + '_' +
                        clientname + '_' +
                        this.clientId + '_' +
                        orderT + '_' +
                        user + '_' +
                        after_edit + '_' +
                        stg + '_' +
                        this.maxWords + '_' +
                        this.editorTPO + "MIN"
            this.project_name = projectName
            this.loaded = true

      },
      getClient(){
          this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/client/${this.$route.params.id}`)
            .then(res => {

                this.clientName = res.data.client.company
                this.clientId = res.data.client.id
            })
      },
      fillForm(){
        var stringLength = this.project.length
        var clientName = this.clientName.replace(/\s/g, '')
        // Check and see if we can auto-populate form
        if(stringLength < 20){
          // alert("Unable to auto fill form")
          this.snackbar = true
        }
        this.orderType = this.project.split('_')[4]
        this.projectReference.forEach(item => {
          if(this.project == item.name){
            this.maxWords = item.max_wordcount
            this.editorTPO = item.tpo
            // this.date = item.due_date
            this.numberOfOrders = item.number_of_orders
          } 
        })
        this.fillStage()
        this.fillAfterEdit()
        this.findAccountManager()
        // this.date = this.project.substr(0, 10)
      },
      getUsers(){
          this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/user/account-manager`)
            .then(res => {
                // console.log(res.data)
                let users = res.data
                users.forEach(item => {
                    this.users.push(item.first_name)
                })
            }).catch(err => console.log(err))     
      },
      fillStage(){
          if(this.project.match("PIL") || this.project.match("Pil")){
            this.stage = this.stages[0]
          } else if(this.project.match("ONG") || this.project.match("Ong")){
            this.stage = this.stages[1]
          } else if(this.project.match("Spe") || this.project.match("SPE")) {
            this.stage = this.stages[2]
          }
      },
      fillAfterEdit(){
        if(this.project.match("LII") || this.project.match("Lii")){
          this.afterEdit = this.afterEdits[0]
        } else if(this.project.match("RTC") || this.project.match("Rtc")){
          this.afterEdit = this.afterEdits[1]
        } else if(this.project.match("ASO") || this.project.match("Aso")){
          this.afterEdit = this.afterEdits[2]
        }
      },
      findAccountManager(){
        this.users.forEach(user => {
            var firstThree = user.substr(0,4)
            var strMatch = this.project.match(firstThree.toUpperCase())
            var strMatch2 = this.project.match(firstThree)
            // console.log(strMatch)
            if(strMatch || strMatch2){
                this.am = user                
            }
        })
      },
      fillTPO(){
            
      }
    },
  }
</script>