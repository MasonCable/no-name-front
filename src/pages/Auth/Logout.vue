<template>
    <div class="container-fluid ps-md-0" id="test">
    <!-- <img src="@/assets/gif/loading1.gif"> -->
        <div class="row align-items-center justify-content-center">
            <!-- <div class="col">This will be centered vertically and horizontally</div> -->
            <img class="mt-4" src="@/assets/gif/loading4.gif">
        </div>
    </div>
</template>
<script>
    export default {
        data: () => ({

        }),
        mounted(){
            this.logout()
        }, 
        methods: {
            logout(){
                this.$store.dispatch("logout")
                    .then(res =>{
                        
                        this.$router.push('/auth/login')
                    })
                    .catch(err => {
                            this.$router.push('/auth/login')
                            console.log(err)
                            
                    })
            }
        }
    }
</script>
<style scoped>
    #test{
        background: rgb(52,52,52);
        background: linear-gradient(13deg, rgba(52,52,52,1) 13%, rgba(52,33,74,1) 20%, rgba(52,52,52,1) 43%, rgba(52,52,52,1) 60%, rgba(52,33,74,1) 79%, rgba(52,52,52,1) 87%); 
    }
</style>