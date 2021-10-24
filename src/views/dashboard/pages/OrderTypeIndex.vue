<template>
    <DashboardDataTables
        :headers="table.headers"
        :title="table.title"
        :icon="table.icon"
        :endpoint="table.endpoint"
        :viewUrl="table.viewUrl"
        />

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
              text: 'Order Type',
              value: 'order_type',
            },
            {
              text: 'Active',
              value: 'active',
            },
            {
              text: 'Created At',
              value: 'created_at',
            },
          ],
          title: "Order Types Index",
          icon:"mdi-badge-account-horizontal-outline",
          endpoint: `${process.env.VUE_APP_SERVICE_URL}/order-type`,
          color: 'red lighten-2',
      },
    }),
  }
</script>
