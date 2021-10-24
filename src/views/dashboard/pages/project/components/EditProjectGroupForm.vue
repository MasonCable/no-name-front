<template>
<div>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formData['formTitle'] }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
             <v-row v-for="(f, index) in formData.fields" :key="f.id" >
                <v-text-field 
                    :label="f.name" required 
                    v-model="f.value"
                    :error-messages="f.errors"
                    v-on:change="clearErrors(index)"
                    ></v-text-field>
             </v-row>
          </v-container>
          <!--This section will only get loaded if the user provided a select area -->
          <v-container v-if="formData.select">
              
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="toggleForm">Close</v-btn>
          <v-btn color="blue darken-1" text @click="postForm">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
      <div class="pt-5">
        <v-btn class="mx-5"  dark  color="orange" @click="toggleForm">
          {{ formData['buttonText'] }}
        </v-btn>
       </div>
    </div>
</template>



<script>
export default {
    
    props: {
        // This gets parsed in mounted imidietly
        formData: Object,
    },
    data: () => ({
        dialog: false,
        selectValues: []
    }),
    computed: {
        form() {
            let form = {}
            let idList = []
            if(this.formData.select){
                this.formData.select.reference.forEach((item) => {
                    this.selectValues.forEach((i) => {
                        if(i == item.name){
                            idList.push(item.id)
                        }
                    })
                    
                })
                form[this.formData.select.fieldName] = idList
            }
            this.formData.fields.forEach((f) => {
                form[f.field] = f.value
            })

            return form
        },
    },
    methods: {
        
        clearErrors: function (index) {
            this.formData.fields[index].errors = ''
        },
        toggleForm(){
            this.dialog = !this.dialog
        },
        postForm(e){
            
            e.preventDefault()
            this.$http.post(this.formData.postEndpoint, this.form)
                .then(res => {
                    this.formData.fields.forEach(item => {
                        item.value = ''
                    })

                    this.toggleForm()

                    this.$emit('save-form')
                })
                .catch(err => {
                    console.log(err)
                    let errors = err.body.errors
                    this.formData.fields.forEach((f) => {
                        if(typeof errors[f.field] !== 'undefined') {
                            f.errors = errors[f.field]
                        }
                    })
                })
        }
    }
}
</script>

