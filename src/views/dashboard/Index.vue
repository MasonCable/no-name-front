<template>
  <v-app>
  <template>
    <div class="mt-4">
    <v-text-field
      color="red"
      loading
      disabled
      v-if="loading"
    ></v-text-field>
    </div>
  </template>
    <dashboard-core-app-bar v-model="expandOnHover" />

    <dashboard-core-drawer :expand-on-hover.sync="expandOnHover" />

    <dashboard-core-view />

    <dashboard-core-settings v-model="expandOnHover" />
  </v-app>
</template>

<script>
import store from '../../store';

  export default {
    name: 'DashboardIndex',

    components: {
      DashboardCoreAppBar: () => import('./components/core/AppBar'),
      DashboardCoreDrawer: () => import('./components/core/Drawer'),
      DashboardCoreSettings: () => import('./components/core/Settings'),
      DashboardCoreView: () => import('./components/core/View'),
    },
    data: () => ({
      expandOnHover: false,
      // loading: store.state.loading
    }),
    computed: {
      loading(){
        return this.$store.state.loading
      }
    }
  }
</script>
