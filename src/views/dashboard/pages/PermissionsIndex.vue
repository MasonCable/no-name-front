<template>
<v-container 
        id="permission-index"
        tag='section'>
    <DashboardDataTables
        :headers="table.headers"
        :title="table.title"
        :icon="table.icon"
        :endpoint="table.endpoint"
        :viewUrl="table.viewUrl"
        :formData="formData"
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
            select: {
              fields: [],
              fieldName: 'roles',
              hint: 'Assign Permission To Roles'
            },
            fields: [
            {
              id: 1,
              name: 'Name',
              type: 'text',
              field: 'name',
              value: '',
              errors: ''

            }
          ],
          buttonText: 'Permission',
          formTitle: 'Add Permission',
          postEndpoint: `${process.env.VUE_APP_SERVICE_URL}/permission`
        },
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
              text: 'Guard Name',
              value: 'guard_name'
            },
            {
              text: 'Created At',
              value: 'created_at',
            },
          ],
          title: "Permissions Index",
          icon:"mdi-badge-account-horizontal-outline",
          endpoint: `${process.env.VUE_APP_SERVICE_URL}/permission`,
          color: 'purple lighten-1',
      },
    }),
    mounted(){
      this.getRoles()
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
