<template>
<div>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Password Reset</span>
        </v-card-title>
        <v-card-text>
          <v-container>
             <v-row >
                <v-text-field 
                    label="Password" required 
                    v-model="form.password"
                    :type="'password'"
                    ></v-text-field>
                    
             </v-row>
             <v-row>
                <v-text-field 
                    label="Confirm Password" required
                    v-model="form.c_password"
                    :type="'password'"
                    ></v-text-field>
             </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="handleSubmit">Save</v-btn>
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
            token: '',
            password: '',
            c_password: ''
        }
    }),
    mounted(){
        this.form.token = this.$route.params.id
    },
        methods: {
            handleSubmit(e){
                e.preventDefault();
                
                this.$http.post(`${process.env.VUE_APP_SERVICE_URL}/reset-password`, this.form)
                .then(res => {
                    this.$router.push('/pages/login')
                }).catch(err => console.log(err))
            },
            toggleForm(){

            }
        }
}
</script>

