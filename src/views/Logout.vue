<template>
  <v-container
    id="login"
    class="fill-height justify-center"
    tag="section"
  >
    <div class="main-logout">
        <img src="@/assets/loading.gif">
    </div>
  </v-container>
</template>

<script>
export default {
    name: 'Logout',
    data(){
        return {}
    },
    mounted(){
        this.$store.dispatch("logout")
            .then(res => {
                this.$router.push('/pages/login')
            }).catch(err => {
                this.$router.push('/pages/login')
            })
    }
}
</script>

<style scoped>
.main-logout{
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