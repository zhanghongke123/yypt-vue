<template>
  <div>
     <vxe-grid  v-bind="gridOptions2"></vxe-grid>
  </div>
</template>

<script>
   import YyptTable from '@/components/YyptTable'

  export default {
    name:'',
    props:[''],
    data () {
      return {
              gridOptions2: {
                border: true,
                resizable: true,
                showOverflow: true,
                loading: false,
                height: 300,
                columns: [],
                data: []
              }
      };
    },

    components: {
      YyptTable
    },

    computed: {},

    beforeMount() {},

    mounted() {
            this.gridOptions2.loading = true
            setTimeout(() => {
              this.gridOptions2.loading = false
              this.gridOptions2.columns = [
                { type: 'seq', width: 50 },
                { field: 'name', title: 'Name' },
                { field: 'sex', title: 'Sex', showHeaderOverflow: true },
                { field: 'role', title: 'Role' },
                { field: 'address', title: 'Address', showOverflow: true }
              ]
              this.gridOptions2.data = [
                { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: 'Man', age: 28, address: 'Shenzhen' },
                { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
                { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
                { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: 'Women', age: 23, address: 'Shenzhen' },
                { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: 'Women', age: 30, address: 'Shanghai' },
                { id: 10006, name: 'Test6', nickname: 'T6', role: 'Designer', sex: 'Women', age: 21, address: 'Shenzhen' },
                { id: 10007, name: 'Test7', nickname: 'T7', role: 'Test', sex: 'Man', age: 29, address: 'Shenzhen' },
                { id: 10008, name: 'Test8', nickname: 'T8', role: 'Develop', sex: 'Man', age: 35, address: 'Shenzhen' }
              ]
            }, 3000)
    },

    methods: {
      aa(scope){
        console.error(scope)
      }
    },

    watch: {}

  }

</script>
<style lang='' scoped>

</style>