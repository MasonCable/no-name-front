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
            <v-row>
                <v-autocomplete
                v-model="selectValues"
                :items="formData.select.fields"
                :menu-props="{ maxHeight: '400' }"
                label="Select"
                multiple
                :hint="formData.select['hint']"
                persistent-hint
                ></v-autocomplete>
            </v-row>
          </v-container>
        <v-container v-if="formData.select2">
            <v-row>
                <v-autocomplete
                    v-model="selectValues2"
                    :items="formData.select2.fields"
                    :menu-props="{ maxHeight: '400' }"
                    label="Select"
                    multiple
                    :hint="formData.select2['hint']"
                    persistent-hint
                ></v-autocomplete>
            </v-row>
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
      <div class="pt-2">
        <v-btn class="mx-2"  dark small color="green" @click="toggleForm">
          <v-icon dark>mdi-plus</v-icon>
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
        selectValues: [],
        selectValues2: [],
        id1: '',
        id2: ''
    }),
    computed: {
        form() {
            let form = {}
            let idList = []
            if(this.formData.select){
                // console.log(1)
                this.formData.select.reference.forEach((item) => {
                    this.selectValues.forEach((i) => {
                        if(i == item.name){
                            if(this.formData.singleSelect){
                                this.id1 = item.id
                            } 
                            idList.push(item.id)
                        }
                    })
                    
                })
             
                if(this.formData.singleSelect){
                    form[this.formData.select.fieldName] = this.id1
                } else {
                    form[this.formData.select.fieldName] = idList
                }
                
            } 
            if(this.formData.select2){
                // console.log(2)
                this.formData.select2.reference.forEach((item) => {
                    this.selectValues2.forEach((i) => {
                        if(i == item.first_name + ' ' + item.last_name){
                            if(this.formData.singleSelect){

                                this.id2 = item.id
                            }
                            idList.push(item.id)
                        }
                    })
                })
                if(this.formData.singleSelect){
                    form[this.formData.select2.fieldName] = this.id2
                } else {
                    form[this.formData.select2.fieldName] = idList
                }
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
            // console.log(this.form)
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

