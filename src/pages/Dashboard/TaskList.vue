<template>
    <base-table :data="taskList"
                thead-classes="text-primary">
      <template slot-scope="{row}">
        <td>
          <base-checkbox v-model="row.done">
          </base-checkbox>
        </td>
        <td>
          <p class="title">{{row.title}}</p>
          <p class="text-muted">{{row.description}}</p>
        </td>
        <td class="td-actions text-right">
          <base-button type="link" aria-label="edit button">
            <i class="tim-icons icon-pencil"></i>
          </base-button>
        </td>
      </template>
    </base-table>
</template>
<script>
  import {BaseTable} from '@/components'
  export default {
    components: {
      BaseTable
    },
    data(){
        return {
        	taskList: [
				{
				title: "Update the Documentation",
				description: "Dwuamish Head, Seattle, WA 8:47 AM",
				done: false
				},
				{
				"title": "GDPR Compliance",
				description: "The GDPR is a regulation that requires businesses to protect the personal data and privacy of Europe citizens for transactions that occur within EU member states.",
				done: true
				},
        	]
        }
    },
	mounted(){

	}, 
	methods: {
		getTasks(){
			
		}
	}
    
  }
</script>
<style>
</style>
