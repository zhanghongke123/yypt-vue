<template>
  <div class="user-container">
    <div class="user-top">
       <el-button type="success" v-permission="'add'">查询</el-button>
    </div>
    <el-table :data="userlist">

      <el-table-column prop="id" label="ID">
        
      </el-table-column>

      <el-table-column prop="username" label="用户名">
        
      </el-table-column>
      <el-table-column prop="mobile" label="手机号">
        
      </el-table-column>

      <el-table-column prop="create_date" label="创建日期">
        
      </el-table-column>

      <el-table-column prop="modify_date" label="修改日期">
        
      </el-table-column>

    </el-table>
    <el-button v-for="(button,index) in buttons" :key="index">
      {{button.name}}
    </el-button>
  </div>
</template>

<script>

  export default {
    name:'',
    props:[''],
    data () {
      return {
        userlist:[],
        buttons:this.$route.meta.buttons
      };
    },

    components: {},


    beforeMount() {},

    mounted() {},

    methods: {
      
    },

    watch: {}

  }

</script>
<style lang='scss' scoped>
.user {
  &-container{
    margin: 5px;
  }
  &-top{
    margin: 5px;
  }
}

</style>