<template>
<v-container tag='section'>
  <v-card
    max-width="375"
    
  >
    <v-img
      src="../../assets/pricing.jpg"
      height="400px"
      dark
    >
      <v-row class="fill-height">
        <v-card-title>
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
        </v-card-title>

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

      <!-- <v-list-item >
        <v-list-item-action></v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>(323) 555-6789</v-list-item-title>
          <v-list-item-subtitle>Work</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon>mdi-message-text</v-icon>
        </v-list-item-icon>
      </v-list-item> -->

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
    </v-list>
  </v-card>
  <!-- END OF THE CARD COMPONENT -->

  </v-container>
</template>

<script>
export default {
    name: 'user-profile',
    data:() => ({
        user: {},
        item: 1,
        items: [
            { text: '$EMAIL', icon: 'mdi-email' },
            { text: 'Audience', icon: 'mdi-account' },
            { text: 'Conversions', icon: 'mdi-flag' },
      ],
    }),
    mounted(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/me`)
            .then(res => {
                this.user = res.data
                // items.text = res.data.email
                // console.log(res.data)
            })
            .catch(err => console.log(err))
    },
    
}
</script>
