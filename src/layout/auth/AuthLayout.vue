<template>
    <div class="wrapper">        
        <login>loggedIn" ></login>
        <!-- <logout v-if="loggedIn"></logout> -->
    </div>
</template>

<script>
    import Login from '../../pages/Auth/Login.vue'
    import Logout from '../../pages/Auth/Logout.vue'

    export default{
        components: {
            Login,
            Logout
        },
        data: () => ({
            
        }),
        mounted(){
            
        }
    }
</script>