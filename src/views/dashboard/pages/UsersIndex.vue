<template>
  <v-container>
        <DashboardDataTables
          :headers="table.headers"
          :title="table.title"
          :icon="table.icon"
          :endpoint="table.endpoint"
          :viewUrl="table.viewUrl"
          :name="table.name"
          :formData="formData"          
          v-if="userTable"
        />
        <DashboardDataTables
          :headers="table2.headers"
          :title="table2.title"
          :icon="table2.icon"
          :endpoint="table2.endpoint"
          :viewUrl="table2.viewUrl"
          :name="table2.name"
          :formData="formData"
          :actions="table2.loginAs"
          v-if="adminTable"
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
      isAdmin: localStorage.getItem('isAdmin'),
      userTable: false,
      adminTable: false,
        formData: {
          
          select: {
            fields: [],
            fieldName: 'roles',
            hint: 'Select 1 Role',

          },
          fields: [
            {
              id: 1,
              name: 'Email',
              type: 'text',
              field: 'email',
              value: '',
            errors: ''

            },
            {
              id: 2,
              name: 'First Name',
              type: 'text',
              field: 'first_name',
              value: '',
            errors: ''
            },
            {
              id: 3,
              name: 'Last Name',
              type: 'text',
              field: 'last_name',
              value: '',
            errors: ''
            }
          ],
          buttonText: 'User',
          formTitle: 'Add User',
          postEndpoint: `${process.env.VUE_APP_SERVICE_URL}/register/user`
      },
      
      table: {
          // loginAs : { text: 'Login As', value: 'loginAs', sortable: false },
          headers: [
            {
              text: 'ID',
              value: 'id'
            },
            {
              text: 'First Name',
              value: 'first_name',
            },
            {
              text: 'Last Name',
              value: 'last_name'
            },
            {
              text: 'Email',
              value: 'email',
            },            
            {
              text: 'Created At',
              value: 'created_at',
            },
          ],
          title: "Users Index",
          icon:"mdi-badge-account-horizontal-outline",
          endpoint: `${process.env.VUE_APP_SERVICE_URL}/user`,
          color: 'indigo',
          viewUrl: '/pages/user/'
      },
        table2: {
          loginAs : { text: 'Login As', value: 'loginAs', sortable: false },
          headers: [
            {
              text: 'ID',
              value: 'id'
            },
            {
              text: 'First Name',
              value: 'first_name',
            },
            {
              text: 'Last Name',
              value: 'last_name'
            },
            {
              text: 'Email',
              value: 'email',
            },            
            {
              text: 'Created At',
              value: 'created_at',
            },
          ],
          title: "Users Index",
          icon:"mdi-badge-account-horizontal-outline",
          endpoint: `${process.env.VUE_APP_SERVICE_URL}/user`,
          color: 'indigo',
          viewUrl: '/pages/user/'
      },

    }),
    mounted(){
       this.getRoles()
       if(this.isAdmin == 'true'){
          this.adminTable = true
          this.userTable = false
       } else {
        this.userTable = true
        this.adminTable = false
       }
    },
    methods: {
      getRoles(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/role`)
          .then(res => {
            var roles = res.body.data
            this.formData.select.reference = roles
            roles.forEach(item => {
              this.formData.select.fields.push(item.name)
            })
          }).catch(err => console.log(err))
      }
    }
  }
</script>
