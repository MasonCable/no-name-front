<template>
    <div>
        <v-btn color="red darken-1" text @click='confirmDelete'>
                Confirm Delete
        </v-btn>
    </div>
</template>

<script>
export default {    
    props: {
        endpoint: String,
        afterDelete: String
    },
    data: () => ({

    }),
    methods: {
        confirmDelete(e){
            this.$http.delete(this.endpoint).then(res => {
                this.$router.back()
            }).catch(err => {
                this.$router.push(this.afterDelete)
            })
        }
    }
}
</script>