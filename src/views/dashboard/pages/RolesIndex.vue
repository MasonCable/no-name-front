<template>
    <v-container id="roles-index" tag="section">
        <DashboardDataTables
            :headers="table.headers"
            :title="table.title"
            :icon="table.icon"
            :endpoint="endpoint"
            :viewUrl="table.endpoint"
            :formData="formData"
            />
    </v-container>
</template>
<script>
import DashboardDataTables from '@/views/dashboard/tables/DataTables'
import UserRolesVue from '../../user/components/UserRoles.vue'

export default {
    components: { 
        DashboardDataTables
    },
    data: ()  => ({
        formData: {
            select: {
                fields: [],
                fieldName: 'permissions',
                hint: 'Select permissions'
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
          buttonText: 'Role',
          formTitle: 'Add Role',
          postEndpoint: `${process.env.VUE_APP_SERVICE_URL}/role`
        },
        table: {
            endpoint: '/pages/role/',
            title: 'Roles Index',
            viewUrl: '/pages/roles/',
            icon: 'mdi-meditation',
            headers: [
                {
                    text: 'ID',
                    value: 'id'
                },
                {
                    text: 'Name',
                    value: 'name'
                },
                {
                    text: 'Guard Name',
                    value: 'guard_name'
                },
            ]
        }
    }),
    computed: {
        endpoint: function() {
            return `${process.env.VUE_APP_SERVICE_URL}/role`
        }
    },
    mounted(){
        this.getPermissions()
    },
    methods: {
        getPermissions(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/permission`)
                .then(res => {
                    var permissions = res.body.data
                    this.formData.select.reference = permissions
                    permissions.forEach(item => {
                      this.formData.select.fields.push(item.name)  
                    })
                }).catch(err => console.log(err))
        }
    }
}
</script>