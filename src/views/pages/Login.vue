<template >
  <v-container
    id="login"
    class="fill-height justify-center"
    tag="section"
  >
    <v-row justify="center" v-if="!ms">
      <v-slide-y-transition appear>
        <base-material-card
          color="success"
          light
          max-width="100%"
          width="400"
          
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <div class="text-center">
            <a :href="link">
              <h1 class="display-2 font-weight-bold mb-2">
                Login
              </h1>

              <v-btn
                v-for="(social, i) in socials"
                :key="i"
                
                class="ma-1"
                icon
                rel="noopener"
                target="_blank"
              >
                <v-icon
                  v-text="social.icon"
                />
              </v-btn>
              </a>
            </div>
          </template>

          <v-card-text class="text-center">
            <div class="text-center grey--text body-1 font-weight-light" v-if="!error">
              Classic Login
            </div>
            <div class="text-center red--text body-1 font-weight-light" v-if="error">
              There was a problem, try again
            </div>
            <!-- <v-text-field
              color="secondary"
              label="First Name..."
              prepend-icon="mdi-face"
              class="mt-10"
            /> -->
            <form v-on:keyup.enter="handleSubmit">
              <v-text-field
                v-if="!error"
                color="secondary"
                label="Email..."
                prepend-icon="mdi-email"
                v-model='form.email'
              />
               <v-text-field
                v-if="error"
                error
                label="Email"
                prepend-icon="mdi-email"
                v-model='form.email'
              />

              <v-text-field
                v-if="!error"
                class="mb-8"
                color="secondary"
                label="Password..."
                :type="'password'"
                prepend-icon="mdi-lock-outline"
                v-model='form.password'
              />
              <v-text-field
                v-if="error"
                class="mb-8"
                error
                label="Password..."
                :type="'password'"
                prepend-icon="mdi-lock-outline"
                v-model='form.password'
              />
              <p><router-link id="pass" to='/forgot-password'>Forgot Password</router-link></p>
              
              <pages-btn
                large
                color=""
                depressed
                class="v-btn--text success--text"
              >
                <div @click="handleSubmit">
                  Let's Go
                </div>
              </pages-btn>
            </form>
          </v-card-text>
        </base-material-card>
      </v-slide-y-transition>
    </v-row>
    <!-- THIS IS WHERE THE LOADING GIF IS LOCATED -->
    <div class="microsoft" v-if="ms">
      <img src="@/assets/loading.gif" >
    </div>
    
  </v-container>
</template>

<script>
  export default {
    name: 'PagesLogin',

    components: {
      PagesBtn: () => import('./components/Btn'),
    },

    data: () => ({
      link: '',
      error: false,
      form: {
        email: '',
        password: '',
      },
      data: { code: '' },
      ms: false,
      socials: [
        {
          href: '#',
          icon: 'mdi-facebook-box',
        },
        {
          href: '#',
          icon: 'mdi-microsoft',
        },
        {
          href: '#',
          icon: 'mdi-github-box',
        },
      ],
    }),
    mounted(){
      if(this.$route.query.code){
          this.ms = true
          this.data.code = this.$route.query.code
          // Send the code from microsoft to our backend; If the req is true, send the user to their dashboar, else, send them to the login page with no params 
          this.$store.dispatch("redirect", this.data)
            .then(res => this.$router.push("/"))
            .catch(err => {
              this.ms = false
              // LEAVE A MESSAGE FOR THE USER HERE
              this.$router.push("/pages/login")
              this.error = true
            })
      }
      //Make sure that these variables are in an ENV file
      let clientId = process.env.VUE_APP_CLIENT_ID
      let redirect_uri = process.env.VUE_APP_REDIRECT_URI

      var url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}
                    &response_type=code
                    &redirect_uri=${redirect_uri}
                    &response_mode=query
                    &scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2FUser.Read`

      this.link = url
    },
    methods: {
      handleSubmit (e) {
        e.preventDefault()
        
        this.$store.dispatch("login", this.form)
          .then(res => this.$router.push('/'))
          .catch(err => {
            this.error = true
            console.log(err)
          })
      },
      
    },
  }
</script>

<style scoped>
  a {
   text-decoration: none;
   color: #fff;
  }

  #pass {
    color: grey;
    font-size: 0.8em;
  }
  .microsoft{
    background:rgb(255, 255, 255);
    position:absolute;
    top:0px;
    right:0px;
    bottom:0px;
    left:0px;
    padding-top:20%;
    text-align: center;
  }
</style>  
  
