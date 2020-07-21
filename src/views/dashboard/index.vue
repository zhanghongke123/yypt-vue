<template>
  <div>
     <YyptTable :queryRoleId="2">
       <template slot="topButton">
          <el-button size="small" type="primary"  @click="aa">ceshi</el-button>
       </template>

       <template v-slot:userName="{scope}" >
          <el-tag size="small" @click="aa(scope)">{{scope.$index}}</el-tag>
       </template>


      <template v-slot:userId="{scope}" >
          <el-tag size="small" @click="aa(scope)">{{scope.$index}}</el-tag>
       </template>
     </YyptTable>
  </div>
</template>

<script>
   import YyptTable from '@/components/YyptTable'

  export default {
    name:'',
    props:[''],
    data () {
      return {

      };
    },

    components: {
      YyptTable
    },

    computed: {},

    beforeMount() {},

    mounted() {},

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