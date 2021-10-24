<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card icon="mdi-account-outline">
          <template v-slot:after-heading>
            <div class="font-weight-light card-title mt-2">
              User Profile
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                

                <v-col
                  cols="12"
                  md="8"
                >
                  <v-text-field
                    label="Email Address"
                    class="purple-input"
                    disabled
                    :value="email"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    label="First Name"
                    class="purple-input"
                    disabled
                    :value="first_name"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    label="Last Name"
                    class="purple-input"
                    disabled
                    :value="last_name"
                  />
                </v-col>

                


                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="success"
                    class="mr-0"
                    disabled
                  >
                    Update Profile
                  </v-btn>
                </v-col>
                
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <base-material-card
          class="v-card-profile"
          avatar="https://finanzmesse.ch/userdata/uploads/referenten/avatar.jpg"
        >
          <v-card-text class="text-center">
            <!-- <h6 class="display-1 mb-1 grey--text">
              CEO / CO-FOUNDER
            </h6> -->

            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ first_name + ' ' + last_name }}
            </h4>

            <p class="font-weight-light grey--text">
              THIS IS WHERE WE WILL LIST THE USERS ROLES
            </p>

            <!-- <v-btn
              color="error"
              rounded
              class="mr-0"
              @click="resetPassword"
            >
              Reset Password
            </v-btn> -->
              <v-btn
              color="success"
              rounded
              class="mr-0"
              @click="form = true"
            >
              Change Password
            </v-btn>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
    <template>
        <div>
  <v-row justify="center">
    <v-dialog v-model="form" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formData['formTitle'] }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
             <v-row v-for="f in formData.fields" :key="f.id" >
                <v-text-field 
                    :label="f.name" required 
                    :value="f.value"
                    :error-messages="f.errors"
                    v-model="postForm[f.field]"
                    :type="f.type"
                    v-if="!error"
                    ></v-text-field>
                    <v-text-field 
                    :label="f.name" required 
                    :value="f.value"
                    :error-messages="f.errors"
                    v-model="postForm[f.field]"
                    hint="At least 8 characters"
                    :type="f.type"
                    v-if="error"
                    error
                    ></v-text-field>
             </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="form = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="changePassword">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
    </div>
    </template>
  </v-container>
</template>

<script>
import MagicForm from '@/components/MagicForm'

  export default {
      components: {
          MagicForm
      },
    data: () => ({
        error: false,
        postForm: {
            currentPassword: '',
            newPassword: ''
        },
        form: false,
        email: '',
        first_name: '',
        last_name: '',
        formData: {
          fields: [
            {
              id: 1,
              name: 'Current Password',
              type: 'password',
              field: 'currentPassword'
            },
            {
              id: 2,
              name: 'New Password',
              type: 'password',
              field: 'newPassword'
            }
          ],
        buttonText: 'User',
        formTitle: 'Change Password',
        postEndpoint: `${process.env.VUE_APP_SERVICE_URL}/me/change-password`
      },
    }),
    mounted(){
        this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/me`)
            .then(res => {
                this.email = res.data.email
                this.first_name = res.data.first_name
                this.last_name = res.data.last_name
            }).catch(err => {
                //Handle errors here
            })
    },
    methods:{
        changePassword(){
            this.$http.post(this.formData.postEndpoint, {...this.postForm})
                .then(res => {
                    this.form = false
                }).catch(err => {
                    if(err.status == 406){
                      console.log('Your password needs to be at least 6 charachters long')
                      this.error = true
                    }
                })
        }
    }
  }
</script>