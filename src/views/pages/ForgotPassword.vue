<template>
<div>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Provide Your Email</span>
        </v-card-title>
        <v-card-text>
          <v-container>
             <v-row >
                <v-text-field 
                    label="Email" required 
                    v-model="form.email"
                    :type="'text'"
                    ></v-text-field>
                    
             </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="handleSubmit">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

</div>
</template>



<script>

export default {
    data: () => ({
        // The id of this function will be the payload that we send to the server in order verify the password change
        dialog: true,
        form: {
            email: ""
        }
    }),
    mounted(){
        this.form.token = this.$route.params.id
    },
        methods: {
            handleSubmit(e){
                e.preventDefault();
                
                this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/validate-reset`, this.form)
                .then(res => {
                    this.$router.push('/pages/login')
                }).catch(err => console.log(err))
            },
            toggleForm(){

            }
        }
}
</script>