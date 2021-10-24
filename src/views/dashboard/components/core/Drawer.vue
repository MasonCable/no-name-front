<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    src="../../../../assets/textbroker.jpg"
    mobile-breakpoint="960"
    app
    mini-variant-width="80"
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom, ${barColor}`"
        v-bind="props"
      />
    </template>

    <v-list-item two-line>
      <v-list-item-content>
          <v-img src="../../../../assets/visor-logo.png" aspect-ratio="1.1"></v-img>
      </v-list-item-content>
    </v-list-item>

    <v-divider class="mb-1" />

    <v-list
      dense
      nav
    >
      <base-item-group :item="profile" />
    </v-list>

    <v-divider class="mb-2" />

    <v-list
      expand
      nav
    >
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />

      <template v-for="(item, i) in computedItems">
        <base-item-group
          v-if="item.children"
          :key="`group-${i}`"
          :item="item"
        >
          <!--  -->
        </base-item-group>

        <base-item
          v-else
          :key="`item-${i}`"
          :item="item"
        />
      </template>

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  // Utilities
  import {
    mapState,
  } from 'vuex'

  export default {
    name: 'DashboardCoreDrawer',

    props: {
      expandOnHover: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      items: [
        {
          icon: 'mdi-view-dashboard',
          title: 'navigation-drawer.dashboard',
          to: '/',
        },
        {
          icon: 'mdi-badge-account-horizontal-outline',
          title: 'navigation-drawer.users',
          to: '/pages/users',
        },
        {
          icon: 'mdi-sort-clock-descending-outline',
          title: 'Editor Logs',
          to: '/pages/editor-logs',
        },
        {
          icon: 'mdi-clipboard-file',
          title: 'navigation-drawer.projects',
          to: '/project',
        },
        {
          icon: 'mdi-account-star',
          title: 'navigation-drawer.clients',
          to: '/client',
        },
        {
          icon: 'mdi-timeline-check',
          title: 'Schedule',
          to: '/pages/daily-schedule',
        },
        {
          group: '/pages',
          icon: 'mdi-graph',
          title: 'Statistics',
          children: [
            // {
            //   title: 'Projects',
            //   to: '/statistics/projects',
            // },
            // {
            //   title: 'Project Groups',
            //   to: '/statistics/project-groups',
            // },
            {
              title: 'Revenue vs Cost',
              to: 'statistics/order-type'
            },
            {
              title: 'Employee Activity',
              to: 'statistics/employee-activity'
            },
            {
              title: 'Editor Logs',
              to: 'statistics/editor-logs'
            },
            {
              title: 'Order Types',
              to: 'statistics/order-type'
            },
            {
              title: 'Schedule',
              to: 'statistics/schedule'
            },
            {
              title: 'Client',
              to: 'statistics/client'
            },
            {
              title: 'Account Manager',
              to: 'statistics/account-manager'
            },
            {
              title: 'User',
              to: 'statistics/user'
            }
          ],
        },
       
       
        
        
      ],
    }),
  
    computed: {
      ...mapState(['barColor', 'barImage']),
      drawer: {
        get () {
          return this.$store.state.drawer
        },
        set (val) {
          this.$store.commit('SET_DRAWER', val)
        },
      },
      computedItems () {
        return this.items.map(this.mapItem)
      },
      profile () {
        // user = JSON.parse(localStorage.getItem('user'))
        // firstName = user.first_name
        // lastName = user.last_name
        return {
          avatar: true,
          group: '/pages',
          // Make sure that this is the users name after they have logged in
          title: localStorage.getItem('name'),
          // title: firstName + ' ' + lastName,
          children: [
            {
              to: 'user/profile',
              title: 'Public Profile',
            },
            {
              to: 'logs/create',
              title: 'Logs'
            },
            {
              to: 'user/account',
              title: 'Account Settings',
              icon: 'mdi-account-key'
            }
          ],
        }
      },
    },

    watch: {
      '$vuetify.breakpoint.smAndDown' (val) {
        this.$emit('update:expandOnHover', !val)
      },
    },

    methods: {
      mapItem (item) {
        return {
          ...item,
          children: item.children ? item.children.map(this.mapItem) : undefined,
          title: this.$t(item.title),
        }
      },
    },
    mounted(){
      var isAdmin = localStorage.getItem('isAdmin')
      var payload =  { group: '/admin', icon: 'mdi-meditation',title: 'Admin',children: [{ title: 'Permissions', to: 'permissions',}, { title: 'Roles',to: 'roles',},{title: 'Login Attempts',to: 'login-attempts',},],}
      var logout = { icon: 'mdi-logout', title: 'navigation-drawer.logout', to: '/logout'}
      if(isAdmin == "true"){
         this.items.push(payload)
      }
      this.items.push(logout)
    }
  }
</script>

<style lang="sass">
  @import '~vuetify/src/styles/tools/_rtl.sass'

  #core-navigation-drawer
    &.v-navigation-drawer--mini-variant
      .v-list-item
        justify-content: flex-start !important

      .v-list-group--sub-group
        display: block !important

    .v-list-group__header.v-list-item--active:before
      opacity: .24

    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px

        +ltr()
          margin-right: 24px
          margin-left: 12px !important

        +rtl()
          margin-left: 24px
          margin-right: 12px !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
          padding-left: 8px

        +rtl()
          padding-right: 8px

      .v-list-group__header
        +ltr()
          padding-right: 0

        +rtl()
          padding-right: 0

        .v-list-item__icon--text
          margin-top: 19px
          order: 0

        .v-list-group__header__prepend-icon
          order: 2

          +ltr()
            margin-right: 8px

          +rtl()
            margin-left: 8px

</style>
