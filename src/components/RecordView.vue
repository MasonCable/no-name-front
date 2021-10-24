<template>
        
        <base-material-card
            :color='color'
            :icon='icon'
            class="px-5 py-3"
            >
          <template v-slot:after-heading>
            <div class="display-2 font-weight-light">
                 {{ record.title }} 
            </div>
          </template>
          <v-divider class="mt-3"/>
              <section class="container container--fluid">
                  <div class="row text-center">
                      <div class="display-3 font-weight-light col col-12 text-left text--primary pa-0 mb-8 pb-0 pl-3 mt-5">
                          <h5 class="font-weight-light">{{ record.title }} Info</h5>
                          <div class="pt-2">
                          </div>
                      </div>
                      <div >
                            <!-- TITLE -->
                        <v-list>
                            <v-list-item v-for="item in record.colNames" :key="item.id" >
                                <span class="font-weight-bold pr-3">{{ item.name }}: </span>  {{ recordData[item.col]  }}
                            </v-list-item>
                        </v-list>
                      
                      </div>
                  </div>
              </section>

            <!--<div class="pt-2">
                <v-btn class="mx-2"  dark small color="blue" @click="updateTextbrokerInfo">
                <v-icon dark>mdi-update</v-icon>
                    Update
                </v-btn>
            </div> -->
        </base-material-card>
</template>
<script>
import DeleteButton from '@/components/DeleteButton'
import DashboardDataTables from '@/views/dashboard/tables/DataTables'


export default {
    name: '',
    props:{
        record: Object,
        recordData: Object
    },
    data: () => ({
        icon: 'mdi-update',
        color: 'green'
    }),
    methods: {
        
    }
}
</script>