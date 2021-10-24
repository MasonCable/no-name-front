<template>
    <v-container id="article-view" tag="section">
        <RecordView
            :record="record"
            :recordData="recordData"
            v-if="loaded"
        />
    </v-container>
</template>

<script>
import RecordView from '@/components/RecordView'

export default {
    components: {
        RecordView
    },
    data: () => ({
        loaded: false,
        record: {
            colNames: [
                { id: 0, name: 'ID', col: 'id' },
                { id: 1, name: 'Notes', col: 'notes' },
                { id: 2, name: 'Project ID', col: 'project_id' },
                { id: 3, name: 'Headline', col: 'headline' },
                { id: 4, name: 'Word Count', col: 'word_count' },
                { id: 5, name: 'Max Words', col: 'max_words' },
                { id: 6, name: 'Min Words', col: 'min_words' },
            ]
        },
        recordData: {}
    }),
    mounted(){
        this.loadArticlesData()
        
    },
    methods: {
        loadArticlesData(){
            this.$http.get(`${process.env.VUE_APP_SERVICE_URL}/article/${this.$route.params.id}`)
                .then(res => {
                    this.recordData = res.data.article
                    this.record.title = 'Article'
                    this.record.id = this.$route.params.id
                    this.loaded = true
                }).catch(err => console.log(err))
        }
    }    
}
</script>