<template>
    <div>
   <el-table ref="table" v-loading="listLoading" :data="tabledata" height="50vh" @cell-dblclick="dblclick" @selection-change="handleSelectionChange"
         @current-change="rowchange" border highlight-current-row >
          <el-table-column v-if="multiselect" type="selection" width="55"></el-table-column>
          <el-table-column v-for="col in datacolumn" :key="col.prop"  :width="col.width" align="center" :label="col.label">
              <template slot-scope="scope">
                <span v-if="col.iscombox">{{ getcomboxvalue(col.comboxvalue, scope.row[col.prop]) }}</span>
                <span v-else> {{  scope.row[col.prop] }}</span>
              </template>
          </el-table-column>
    </el-table>
        
    </div>   
</template>
<script>
export default {
    name:"YyptTable",
    props:['datacolumn','tabledata'],
    data(){
        return {
            listLoading:false
        }
    }
}
</script>

