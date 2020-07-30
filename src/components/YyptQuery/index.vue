<template>
  <div>
       <el-form :inline="true" ref="queryform"  :model="queyResult" size="small">
         <el-form-item v-for="query in curquerycols" :label="query.label" :prop="query.prop" :key='"query"+query.prop' >
            <el-input v-if="query.type == 'input'" v-model="queyResult[query.prop]" :disabled="query.isdisabled"></el-input>
            <el-input v-else-if="query.type == 'number'" :disabled="query.isdisabled" v-model.number="queyResult[query.prop]"  
            @change="toNumber($event,query.prop)"></el-input>
            <el-select :key="query.prop" filterable clearable v-else-if="query.type == 'select'" :disabled="query.isdisabled"
                      v-model="queyResult[query.prop]" @change="selectchange($event,query.prop) ">
                  <el-option
                    v-for="item in query.options"
                    :value-key="query.prop+''+item.value"
                    :key="query.prop+''+item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
            </el-select>
            <el-date-picker v-else v-model="queyResult[query.prop]" type="datetime" 
                     :disabled="query.isdisabled"  :placeholder='"选择"+query.label'> 
            </el-date-picker>
         </el-form-item>
         <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search"  :loading="isquerying"  @click="query">查询</el-button>
          <el-button  size="small"  @click="resetQueryForm()" :disabled="isquerying">重置</el-button>
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
         queyResult:this.creatres(this.querycols),
         curquerycols:this.querycols,
         isquerying:false
      };
    },

    watch:{
       querycols:{
         handler(value){
           this.curquerycols = value
         },
         immediate:true,
         deep:true
       }
    },
    
    methods: {
        creatres(querycols) {
            let res = {}
            querycols.forEach(item =>{
               res[item.prop] = null
            })
            return res
        },
        query(){
            //点击查询
            this.isquerying = true
            this.$emit("query",this.queyResult)
        },
        disable(isdisable){
          this.curquerycols.forEach(item =>{
                item.isdisabled = isdisable
          })
          this.$forceUpdate()
        },
        resetQueryForm(){
            //重置表单
            this.$refs['queryform'].resetFields();
            this.$emit('reset')
        },
        toNumber(value,prop){
           let num = value.replace(/[^0-9]/ig,"")
           this.queyResult[prop] = num
        },
        selectchange(value,prop){
          this.$emit("selectchange",{
            prop,
            value
          })
        }

    },

  }

</script>
<style lang='' scoped>

</style>