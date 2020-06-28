<template>
  <div> 
       <!-- 查询部分 -->
       <el-form :inline="true" ref="queryform"  :model="queryconditions" size="small">
         <el-form-item v-for="query in querycolumn" :label="query.label" :prop="query.prop" :key='"query"+query.prop'>
            <el-input v-if="query.type == 'input'" v-model="queryconditions[query.prop]"></el-input>
            <el-select v-else-if="query.type == 'select'" v-model="queryconditions[query.prop]">
                  <el-option
                    v-for="item in query.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
            </el-select>
            <el-date-picker v-else v-model="queryconditions[query.prop]" type="datetime" :placeholder='"选择"+query.prop'> 
            </el-date-picker>
         </el-form-item>
         <el-form-item>
          <el-button type="primary" size="small"  @click="fetchData()">查询</el-button>
          <el-button  size="small"  @click="resetQueryForm()">重置</el-button>
         </el-form-item>
       </el-form>

        <el-table stripe ref="table" v-loading="listLoading" :data="data" height="50vh" @cell-dblclick="dblclick" @selection-change="handleSelectionChange"
         @current-change="rowchange" border highlight-current-row >
          <el-table-column v-if="multiselect" type="selection" width="55"></el-table-column>
          <el-table-column v-for="col in datacolumn" :key="col.prop"  :width="col.width" align="center" :label="col.label">
              <template slot-scope="scope">
                <span v-if="col.iscombox">{{ getcomboxvalue(col.comboxvalue, scope.row[col.prop]) }}</span>
                <span v-else> {{  scope.row[col.prop] }}</span>
              </template>
          </el-table-column>
        </el-table>
        <div style="text-align:center;">
            <el-button type="primary" size="small"  @click="confirm()">确认已选</el-button>
            <el-button  size="small"  @click="cancel()">取消</el-button>
        </div>
    <el-pagination background :page-sizes="pagesizes" :current-page="currentPage" @size-change="handleSizeChange" :page-size="pageSize"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    
  </div>
</template>

<script>
const userrep =  require('./userrep.json')
import { userRep } from '@/api/system/role'

  export default {
    name:'userRep',
    props:['queryRoleId'],
    data () {
      return {
         multiselect:userrep.multiselect,
         querycolumn: userrep.querycolumn,
         datacolumn: userrep.datacolumn,
         listLoading: false,
         data:[],
         queryconditions:{},
         currentPage: 0,
         total: 0,
         pagesizes:[20, 40, 100],
         pageSize:20,
         sortField: "userId",
         sortOrder: "desc",
         selectrows: [],
         currenRow:{}
      };
    },
    methods:{
        getcomboxvalue(item, value){
          return item[String(value)]
        },
        rowchange(currenRow, oldRow){
            this.currenRow = currenRow
        },
        handleSizeChange(val){
          this.pageSize = val
          this.fetchData()
        },
        handleCurrentChange(val){
          this.currentPage = val
          this.fetchData()
        },
        fetchData(){
          this.listLoading = true
          this.queryconditions.queryRoleId = this.queryRoleId
          const req = {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            sortField: this.sortField,
            sortOrder: this.sortOrder,
            querylist: this.queryconditions
          }
          userRep(req).then( data =>{
              this.data = data.records
              this.total = data.total
              this.listLoading = false
            if(this.data.length > 0){
                this.$refs['table'].setCurrentRow(this.data[0])
            }
          }).catch(err =>{
              console.log(err)
          })
      },
      resetQueryForm(){
        this.queryconditions = {}
      },
      dblclick(row){
         this.$refs['table'].toggleRowSelection(row);  
      },
      handleSelectionChange(val){
        this.selectrows = val
      },
      confirm(){
        if(this.multiselect){
          //支持多选的话
          this.$emit('ok', this.selectrows)
        }else{
          //当前行
          this.$emit('ok', [this.currenRow])
        }
      },
      cancel(){
        this.$emit('cancel')
      }
    },
    created(){
      this.fetchData()
    }

  }

</script>
<style lang='' scoped>

</style>