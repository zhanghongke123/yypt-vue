<template>
  <div> 
      <el-row style="text-align:right;margin-top:8px;">
              <el-col :span="6">
                <slot name="topButton">
                     
                </slot>
              </el-col>
              <el-col :span="18">
                  <YyptQuery ref="yyptquery" :querycols="querycolumn" @query="query" @reset='resetQueryForm'></YyptQuery>
              </el-col>
      </el-row>

      <el-row>

       <el-table stripe ref="table" v-loading="listLoading" 
        :data="data" 
        height="50vh" 
        @cell-dblclick="dblclick" 
        @selection-change="handleSelectionChange" 
        @current-change="rowchange" border highlight-current-row >
          <el-table-column v-if="multiselect" type="selection" width="55"></el-table-column>
          <el-table-column v-for="col in datacolumn" :key="col.prop"  :width="col.width" align="center" :label="col.label">
              <template slot-scope="scope">
                <slot :name="col.prop" :scope="scope">
                    <span v-if="col.iscombox">{{ getcomboxvalue(col.comboxvalue, scope.row[col.prop]) }}</span>
                    <span v-else> {{  scope.row[col.prop] }}</span>
                </slot>
              </template>
          </el-table-column>
        </el-table>

      </el-row>




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
import YyptQuery from '@/components/YyptQuery'
const userrep =  require('./userrep.json')
import { userRep } from '@/api/system/role'

  export default {
    name:'YyptTable',
    props:['queryRoleId'],
    components:{
        YyptQuery
    },
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
      query(res){
          this.queryconditions = res
          this.currentPage = 0
          this.fetchData()
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