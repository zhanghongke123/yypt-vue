<template>
  <div>
       <el-form :inline="true" ref="queryform"  :model="queyResult" size="small">
         <el-form-item v-for="query in querycols" :label="query.label" :prop="query.prop" :key='"query"+query.prop'>
            <el-input v-if="query.type == 'input'" v-model="queyResult[query.prop]"></el-input>
            <el-input v-else-if="query.type == 'number'" v-model.number="queyResult[query.prop]"  @change="toNumber($event,query.prop)"></el-input>
            <el-select v-else-if="query.type == 'select'" v-model="queyResult[query.prop]">
                  <el-option
                    v-for="item in query.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
            </el-select>
            <el-date-picker v-else v-model="queyResult[query.prop]" type="datetime" :placeholder='"选择"+query.prop'> 
            </el-date-picker>
         </el-form-item>
         <el-form-item>
          <el-button type="primary" size="small"  @click="query">查询</el-button>
          <el-button  size="small"  @click="resetQueryForm()">重置</el-button>
         </el-form-item>
       </el-form>
  </div>
</template>

<script>
// 头部查询部分
  export default {
    name:'YyptQuery',
    props:['querycols'],
    data () {
      return {   
         queyResult:{}
      };
    },
    omponents: {},
    methods: {
        query(){
            //点击查询
            this.$emit("query",this.queyResult)
        },
        resetQueryForm(){
            //重置表单
            this.queyResult = {}
        },
        toNumber(value,prop){
           let num = value.replace(/[^0-9]/ig,"")
           this.queyResult[prop] = num
        }
    },

  }

</script>
<style lang='' scoped>

</style>