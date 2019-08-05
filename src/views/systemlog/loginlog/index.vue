<template>
  <div>
      <YyptQuery :querycols="querycols" @query="query"></YyptQuery>
    
  </div>
</template>

<script>
import YyptQuery from '@/components/YyptQuery'

  export default {
    name:'',
    props:[''],
    data () {
      return {
          querycols:[
            {
                prop:"userName",
                label:"用户名",
                type:"input"
            }
          ]
      };
    },

    components: {
        YyptQuery
    },

    computed: {},

    beforeMount() {},

    mounted() {},

    methods: {
        query(res){
            console.error(res)
        }
    },

    watch: {}

  }

</script>
<style lang='' scoped>

</style>